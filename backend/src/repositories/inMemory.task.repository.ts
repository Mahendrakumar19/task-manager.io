import { CreateTaskDto, UpdateTaskDto } from "../dtos/task.dto";

export type TaskEntity = {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";
  creatorId: string;
  assignedToId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export class InMemoryTaskRepository {
  private tasks: TaskEntity[] = [];

  async create(payload: CreateTaskDto & { creatorId: string }) {
    const id = `task_${this.tasks.length + 1}`;
    const now = new Date().toISOString();
    const task: TaskEntity = {
      id,
      title: payload.title,
      description: payload.description,
      dueDate: payload.dueDate,
      priority: (payload.priority || "MEDIUM") as TaskEntity["priority"],
      status: (payload.status || "TODO") as TaskEntity["status"],
      creatorId: payload.creatorId,
      assignedToId: payload.assignedToId ?? null,
      createdAt: now,
      updatedAt: now,
    };
    this.tasks.push(task);
    return task;
  }

  async findById(id: string) {
    return this.tasks.find((t) => t.id === id) || null;
  }

  async update(id: string, payload: UpdateTaskDto) {
    const idx = this.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    const current = this.tasks[idx];
    const updated: TaskEntity = {
      ...current,
      ...payload,
      updatedAt: new Date().toISOString(),
    } as TaskEntity;
    this.tasks[idx] = updated;
    return updated;
  }

  async delete(id: string) {
    const idx = this.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return false;
    this.tasks.splice(idx, 1);
    return true;
  }

  async list(filter?: { status?: string; priority?: string }) {
    let res = this.tasks.slice();
    if (filter?.status) res = res.filter((t) => t.status === filter.status);
    if (filter?.priority) res = res.filter((t) => t.priority === filter.priority);
    return res;
  }
}
