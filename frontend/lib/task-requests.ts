import { isTask } from "./guards";

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
