import { serve } from "@hono/node-server";
import request from "supertest";
import app from "./app";
import * as db from "./db";
import { Task } from "./db";

jest.mock("./db");

const getMockTasks = (): Task[] => [
  { id: 1, title: "Buy milk", completed: false },
  { id: 2, title: "Walk the dog", completed: true },
];

let mockTasks: Task[];
let server: ReturnType<typeof serve>;

describe("Task API", () => {
  beforeAll(() => {
    server = serve(app);
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    mockTasks = getMockTasks();

    (db.getTasks as jest.Mock).mockReturnValue(mockTasks);
    (db.getTask as jest.Mock).mockImplementation((id: number) =>
      mockTasks.find((task) => task.id === id)
    );
    (db.createTask as jest.Mock).mockImplementation(
      (task: Omit<Task, "id">) => {
        const newTask = { ...task, id: mockTasks.length + 1 };
        mockTasks.push(newTask);
        return newTask;
      }
    );
    (db.updateTask as jest.Mock).mockImplementation(
      (id: number, task: Partial<Omit<Task, "id">>) => {
        const taskIndex = mockTasks.findIndex((t) => t.id === id);
        if (taskIndex === -1) {
          return null;
        }
        mockTasks[taskIndex] = { ...mockTasks[taskIndex], ...task };
        return mockTasks[taskIndex];
      }
    );
    (db.deleteTask as jest.Mock).mockImplementation((id: number) => {
      const taskIndex = mockTasks.findIndex((t) => t.id === id);
      if (taskIndex === -1) {
        return false;
      }
      mockTasks.splice(taskIndex, 1);
      return true;
    });
  });

  it("should return all tasks", async () => {
    const res = await request(server).get("/tasks");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockTasks);
  });

  it("should return a single task", async () => {
    const res = await request(server).get("/tasks/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockTasks[0]);
  });

  it("should return 404 for a non-existent task", async () => {
    (db.getTask as jest.Mock).mockReturnValue(null);
    const res = await request(server).get("/tasks/99");
    expect(res.status).toBe(404);
  });

  it("should create a new task", async () => {
    const res = await request(server)
      .post("/tasks")
      .send({ title: "New Task", completed: false });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("New Task");
  });

  it("should update a task", async () => {
    const res = await request(server)
      .put("/tasks/1")
      .send({ title: "Updated Task" });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated Task");
  });

  it("should return 404 when updating a non-existent task", async () => {
    (db.updateTask as jest.Mock).mockReturnValue(null);
    const res = await request(server)
      .put("/tasks/99")
      .send({ title: "Updated Task" });
    expect(res.status).toBe(404);
  });

  it("should delete a task", async () => {
    const res = await request(server).delete("/tasks/1");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Task deleted");
  });

  it("should return 404 when deleting a non-existent task", async () => {
    (db.deleteTask as jest.Mock).mockReturnValue(false);
    const res = await request(server).delete("/tasks/99");
    expect(res.status).toBe(404);
  });
});
