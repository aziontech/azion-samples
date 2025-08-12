import { useExecute, useQuery } from "azion/sql";

const DATABASE_NAME = process.env.DATABASE_NAME || "tasks";

export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export const getTasks = async (): Promise<Task[]> => {
  const { data, error } = await useQuery(DATABASE_NAME, [
    "SELECT * FROM tasks",
  ]);
  if (error) {
    throw error;
  }
  return (
    data?.results?.[0]?.rows?.map(
      (row) =>
        ({
          id: row[0],
          title: row[1],
          completed: row[2] === 1,
        } as Task)
    ) || []
  );
};

export const getTask = async (id: number): Promise<Task | null> => {
  const { data, error } = await useQuery(DATABASE_NAME, [
    `SELECT * FROM tasks WHERE id = ${id}`,
  ]);
  if (error) {
    throw error;
  }
  return (
    (data?.results?.[0]?.rows?.[0] &&
      ({
        id: data?.results?.[0]?.rows?.[0][0],
        title: data?.results?.[0]?.rows?.[0][1],
        completed: data?.results?.[0]?.rows?.[0][2] === 1,
      } as Task)) ||
    null
  );
};

export const createTask = async (task: Omit<Task, "id">): Promise<Task> => {
  const { data, error } = await useExecute(DATABASE_NAME, [
    `INSERT INTO tasks (title, completed) VALUES ('${task.title}', ${task.completed}) RETURNING id`,
  ]);
  if (error) {
    throw error;
  }
  const newId = data?.results?.[0]?.rows?.[0]?.[0] || "";
  return { ...task, id: Number(newId) };
};

export const updateTask = async (
  id: number,
  task: Partial<Omit<Task, "id">>
): Promise<Task | null> => {
  const existingTask = await getTask(id);
  if (!existingTask) {
    return null;
  }

  const updatedTitle =
    task.title !== undefined ? task.title : existingTask.title;
  const updatedCompleted =
    task.completed !== undefined ? task.completed : existingTask.completed;

  const { data, error } = await useExecute(DATABASE_NAME, [
    `UPDATE tasks SET title = '${updatedTitle}', completed = ${updatedCompleted} WHERE id = ${id}`,
  ]);
  if (error) {
    throw error;
  }
  return { ...existingTask, title: updatedTitle, completed: updatedCompleted };
};

export const deleteTask = async (id: number): Promise<boolean> => {
  const { data, error } = await useExecute(DATABASE_NAME, [
    `DELETE FROM tasks WHERE id = ${id}`,
  ]);
  
  if (error) {
    throw error;
  }

  return data?.state === "executed" || data?.state === "pending";
};
