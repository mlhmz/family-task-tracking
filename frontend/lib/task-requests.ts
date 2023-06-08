import { TaskRequest } from "@/types/task";

import { isTask, isTasks } from "./guards";

export async function getTask(uuid: string) {
  const response = await fetch(`/api/v1/tasks/${uuid}`);
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }
  const task = await response.json();
  if (!isTask(task)) throw new Error("Problem fetching data");
  return task;
}
export async function deleteTask(uuid: string) {
  const response = await fetch(`/api/v1/admin/tasks/${uuid}`, { method: "DELETE" });
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }
  return response;
}

export async function getTasks(query: string[]) {
  const request = new URLSearchParams({
    query: query.join(","),
  });
  const response = await fetch(`/api/v1/tasks${"?" + request}`);
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }
  const tasks = await response.json();
  if (!isTasks(tasks)) throw new Error("Problem fetching data");
  return tasks;
}

export async function createTask(request: TaskRequest) {
  const response = await fetch("/api/v1/admin/tasks", {
    method: "POST",
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }

  const task = await response.json();
  if (!isTask(task)) throw new Error("Problem fetching data");
  return task;
}

interface updateTaskParams {
  request: TaskRequest;
  uuid?: string;
}

export async function updateTask({ request, uuid }: updateTaskParams) {
  const response = await fetch(`/api/v1/admin/tasks/${uuid}`, {
    method: "PUT",
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }

  const task = await response.json();
  if (!isTask(task)) throw new Error("Problem fetching data");
  return task;
}
