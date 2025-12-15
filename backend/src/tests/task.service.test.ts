import { TaskService } from "../services/task.service";
import { InMemoryTaskRepository } from "../repositories/inMemory.task.repository";

const repo = new InMemoryTaskRepository();
const service = new TaskService(repo);

describe("TaskService business rules", () => {
  test("should create a task with valid dueDate", async () => {
    const payload = {
      title: "Test Task",
      description: "desc",
      dueDate: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    };
    const t = await service.createTask("user_1", payload as any);
    expect(t).toHaveProperty("id");
    expect(t.title).toBe("Test Task");
  });

  test("should reject dueDate in the past", async () => {
    const payload = {
      title: "Old Task",
      dueDate: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    };
    await expect(service.createTask("user_1", payload as any)).rejects.toThrow("dueDate cannot be in the past");
  });

  test("should update task and reject updating dueDate to past", async () => {
    const payload = {
      title: "Updatable",
      dueDate: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    };
    const t = await service.createTask("user_2", payload as any);
    await expect(service.updateTask(t.id, { dueDate: new Date(Date.now() - 1000 * 60).toISOString() } as any)).rejects.toThrow("dueDate cannot be in the past");
  });
});
