import TaskDataTable from "@/app/tasks/task-data-table";

export default function TasksPage() {
  return (
    <div className="mx-7 my-10 flex flex-col gap-2 lg:mx-auto lg:w-3/4">
      <h1 className="text-2xl font-extrabold leading-tight tracking-tighter md:text-4xl lg:text-5xl">
        Tasks
      </h1>
      <TaskDataTable />
    </div>
  );
}
