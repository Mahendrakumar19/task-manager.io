import { CreateTaskDto, UpdateTaskDto } from "../dtos/task.dto";
import { InMemoryTaskRepository, TaskEntity } from "../repositories/inMemory.task.repository";

export class TaskService {
  constructor(private repo: InMemoryTaskRepository) {}

  validateBusinessRules(payload: CreateTaskDto) {
    // title already validated by Zod; enforce dueDate not in the past
    const due = new Date(payload.dueDate);
    const now = new Date();
    if (due.getTime() < now.getTime()) {
      throw new Error("dueDate cannot be in the past");
    }
  }

  async createTask(creatorId: string, payload: CreateTaskDto) {
    this.validateBusinessRules(payload);
    const task = await this.repo.create({ ...payload, creatorId });
    return task as TaskEntity;
  }

  async updateTask(id: string, payload: UpdateTaskDto) {
    if (payload.dueDate) {
      const due = new Date(payload.dueDate);
      if (due.getTime() < Date.now()) throw new Error("dueDate cannot be in the past");
    }
    const updated = await this.repo.update(id, payload);
    if (!updated) throw new Error("NotFound");
    return updated as TaskEntity;
  }

  async getTask(id: string) {
    const t = await this.repo.findById(id);
    if (!t) throw new Error("NotFound");
    return t;
  }

  async deleteTask(id: string) {
    const ok = await this.repo.delete(id);
    if (!ok) throw new Error("NotFound");
    return true;
  }

  async list(filter?: { status?: string; priority?: string; creatorId?: string; assignedToId?: string }) {
    return this.repo.list(filter);
  }
}
