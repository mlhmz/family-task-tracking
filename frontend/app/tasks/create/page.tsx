import TaskCreateForm from "@/app/tasks/create/task-create-form";

export default function CreateTaskPage() {
  return (
    <div className="m-auto my-5 flex w-1/3 flex-col gap-5">
      <h1 className="text-center text-2xl font-bold">Create a Task</h1>
      <TaskCreateForm />
    </div>
  );
}
