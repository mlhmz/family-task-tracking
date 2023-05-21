export enum PermissionType {
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
