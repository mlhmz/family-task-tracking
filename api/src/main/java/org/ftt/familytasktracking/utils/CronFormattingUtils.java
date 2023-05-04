package org.ftt.familytasktracking.utils;

import io.micrometer.common.util.StringUtils;

import java.time.LocalDateTime;

/**
 * Utility for Formatting Cron Expressions
 */
public class CronFormattingUtils {
    private CronFormattingUtils() {
    }

    /**
     * Formats Time Identifiers of a cron expression
     * <ul>
     *     <li>${CS} => Current Seconds</li>
     *     <li>${CM} => Current Minutes</li>
     *     <li>${CH} => Current Hours</li>
     *     <li>${CD} => Current Days</li>
     *     <li>${CMT} => Current Month</li>
     *     <li>${CDOW} => Current Day of the Week</li>
     * </ul>
     *
     * @param cronExpression Expression to format
     * @return Returns formatted cron string
     */
    public static String format(String cronExpression) {
        if (StringUtils.isNotEmpty(cronExpression)) {
            LocalDateTime dateTime = LocalDateTime.now();
            return cronExpression
                    .replace("${CS}", Integer.toString(dateTime.getSecond()))
                    .replace("${CM}", Integer.toString(dateTime.getMinute()))
                    .replace("${CH}", Integer.toString(dateTime.getHour()))
                    .replace("${CD}", Integer.toString(dateTime.getDayOfMonth()))
                    .replace("${CMT}", Integer.toString(dateTime.getMonthValue()))
                    .replace("${CDOW}", Integer.toString(dateTime.getDayOfWeek().getValue()));
        } else {
            return null;
        }

    }
}
