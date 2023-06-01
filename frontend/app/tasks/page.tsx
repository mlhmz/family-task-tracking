import TaskDataTable from "@/app/tasks/task-data-table";

export default function TasksPage() {
  return (
    <div className="mx-7 my-10 flex flex-col gap-10 lg:mx-auto lg:w-3/4">
      <TaskDataTable />
    </div>
  );
}
