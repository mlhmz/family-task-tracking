package org.ftt.familytasktracking.utils;

import java.time.LocalDateTime;

public class CronFormattingUtils {
    private CronFormattingUtils() {
    }

    public static String format(String cronExpression) {
        LocalDateTime dateTime = LocalDateTime.now();
        return cronExpression
                .replace("${CS}", Integer.toString(dateTime.getSecond()))
                .replace("${CM}", Integer.toString(dateTime.getMinute()))
                .replace("${CH}", Integer.toString(dateTime.getHour()))
                .replace("${CD}", Integer.toString(dateTime.getDayOfMonth()))
                .replace("${CMT}", Integer.toString(dateTime.getMonthValue()))
                .replace("${CDOW}", Integer.toString(dateTime.getDayOfWeek().getValue()));
    }
}
