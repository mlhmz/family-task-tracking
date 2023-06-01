export enum TaskState {
  /**
   * Task is not done yet.
   */
  Undone = "UNDONE",
  /**
   * Task is done but not reviewed
   */
  Done = "DONE",
  /**
   * Task is done and reviewed
   */
  Reviewed = "REVIEWED",
  /**
   * Task is done, reviewed and points are granted
   */
  Finished = "FINISHED",
}

export function getTranslatedTaskStateValue(state: TaskState) {
  switch (state) {
    case TaskState.Done:
      return "Done";
    case TaskState.Undone:
      return "Not done";
    case TaskState.Reviewed:
      return "Reviewed";
    case TaskState.Finished:
      return "Finished";
    default:
      return "Invalid";
  }
}
