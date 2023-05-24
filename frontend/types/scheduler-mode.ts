export enum PermissionType {
  /**
   * Cron uses a Cron Expression for resolving Execution Dates
   */
  Cron = "CRON",
  /**
   * Milli Interval uses an actual Milli Interval for resolving Execution Dates
   */
  MilliInterval = "MILLI_INTERVAL",
  /**
   * Deactivates the Scheduler
   */
  Deactivated = "DEACTIVATED",
}
