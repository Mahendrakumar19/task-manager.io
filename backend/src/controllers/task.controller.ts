import express, { Request, Response } from "express";
import { createTaskSchema, updateTaskSchema } from "../dtos/task.dto";
import { TaskService } from "../services/task.service";
import { PrismaClient } from "@prisma/client";
import { PrismaTaskRepository } from "../repositories/prisma.task.repository";
import { authMiddleware } from "../middleware/auth.middleware";
import { getIO } from "../socket";

const prisma = new PrismaClient();
const repo = new PrismaTaskRepository(prisma);
const service = new TaskService(repo as any);

export const taskRouter = express.Router();

// All routes require authentication
taskRouter.use(authMiddleware);

// Create
taskRouter.post("/", async (req: Request, res: Response) => {
  const parse = createTaskSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.errors });
  const creatorId = (req as any).user?.id;
  try {
    const task = await service.createTask(creatorId, parse.data);
    // Emit real-time event
    const io = getIO();
    io.emit("task:created", task);
    if (task.assignedToId) {
      io.to(`user:${task.assignedToId}`).emit("task:assigned", task);
    }
    return res.status(201).json(task);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

// Read
taskRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const t = await service.getTask(req.params.id);
    return res.json(t);
  } catch (err: any) {
    if (err.message === "NotFound") return res.status(404).json({ error: "Not found" });
    return res.status(400).json({ error: err.message });
  }
});

// Update
taskRouter.put("/:id", async (req: Request, res: Response) => {
  const parse = updateTaskSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.errors });
  try {
    const oldTask = await service.getTask(req.params.id);
    const t = await service.updateTask(req.params.id, parse.data);
    // Emit real-time event
    const io = getIO();
    io.emit("task:updated", t);
    // If assignee changed, notify new assignee
    if (parse.data.assignedToId && parse.data.assignedToId !== oldTask.assignedToId) {
      io.to(`user:${parse.data.assignedToId}`).emit("task:assigned", t);
    }
    return res.json(t);
  } catch (err: any) {
    if (err.message === "NotFound") return res.status(404).json({ error: "Not found" });
    return res.status(400).json({ error: err.message });
  }
});

// Delete
taskRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    await service.deleteTask(req.params.id);
    const io = getIO();
    io.emit("task:deleted", { id: req.params.id });
    return res.status(204).send();
  } catch (err: any) {
    if (err.message === "NotFound") return res.status(404).json({ error: "Not found" });
    return res.status(400).json({ error: err.message });
  }
});

// List with optional filtering
taskRouter.get("/", async (req: Request, res: Response) => {
  const { status, priority, creatorId, assignedToId } = req.query as any;
  const tasks = await service.list({ status, priority, creatorId, assignedToId });
  return res.json(tasks);
});

export default taskRouter;
