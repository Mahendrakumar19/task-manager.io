import { PrismaClient } from "@prisma/client";
import { CreateTaskDto, UpdateTaskDto } from "../dtos/task.dto";

export class PrismaTaskRepository {
  constructor(private prisma: PrismaClient) {}

  async create(payload: CreateTaskDto & { creatorId: string }) {
    return this.prisma.task.create({
      data: {
        title: payload.title,
        description: payload.description,
        dueDate: new Date(payload.dueDate),
        priority: payload.priority || "MEDIUM",
        status: payload.status || "TODO",
        creatorId: payload.creatorId,
        assignedToId: payload.assignedToId,
      },
      include: {
        creator: { select: { id: true, email: true, name: true } },
        assignee: { select: { id: true, email: true, name: true } },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.task.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, email: true, name: true } },
        assignee: { select: { id: true, email: true, name: true } },
      },
    });
  }

  async update(id: string, payload: UpdateTaskDto) {
    const data: any = { ...payload };
    if (payload.dueDate) data.dueDate = new Date(payload.dueDate);
    return this.prisma.task.update({
      where: { id },
      data,
      include: {
        creator: { select: { id: true, email: true, name: true } },
        assignee: { select: { id: true, email: true, name: true } },
      },
    });
  }

  async delete(id: string) {
    await this.prisma.task.delete({ where: { id } });
    return true;
  }

  async list(filter?: { status?: string; priority?: string; creatorId?: string; assignedToId?: string }) {
    const where: any = {};
    if (filter?.status) where.status = filter.status;
    if (filter?.priority) where.priority = filter.priority;
    if (filter?.creatorId) where.creatorId = filter.creatorId;
    if (filter?.assignedToId) where.assignedToId = filter.assignedToId;
    return this.prisma.task.findMany({
      where,
      include: {
        creator: { select: { id: true, email: true, name: true } },
        assignee: { select: { id: true, email: true, name: true } },
      },
      orderBy: { dueDate: "asc" },
    });
  }
}
