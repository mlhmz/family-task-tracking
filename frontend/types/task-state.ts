export enum TaskState {
  Undone = "UNDONE",
  Done = "DONE",
  Reviewed = "REVIEWED",
  Finished = "FINISHED",
}

export function getTranslatedTaskStateValue(state: TaskState) {
  switch (state) {
    case TaskState.Done:
      return "Done";
    case TaskState.Undone:
      return "Not done";
    case TaskState.Reviewed:
      return "Reviewed"; //ToDo: is "In review" more suitable?
    case TaskState.Finished:
      return "Finished";
    default:
      return "Invalid";
  }
}
