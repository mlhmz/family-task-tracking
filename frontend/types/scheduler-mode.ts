export enum SchedulerMode {
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

export function getTranslatedSchedulerModeValue(mode: SchedulerMode) {
  switch (mode) {
    case SchedulerMode.Cron:
      return "Cron";
    case SchedulerMode.MilliInterval:
      return "Interval";
    case SchedulerMode.Deactivated:
      return "Inactive";
    default:
      return "Invalid";
  }
}
