import TaskDataTable from "@/app/tasks/task-data-table";

export default function TasksPage() {
  return (
    <div className="container">
      <h1 className="my-5 text-2xl font-extrabold leading-tight tracking-tighter md:text-4xl lg:text-5xl">
        Tasks
      </h1>
      <TaskDataTable />
    </div>
  );
}
