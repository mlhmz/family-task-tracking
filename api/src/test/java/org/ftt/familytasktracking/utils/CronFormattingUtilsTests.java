package org.ftt.familytasktracking.utils;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.MockedStatic;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mockStatic;

class CronFormattingUtilsTests {

    @ParameterizedTest
    @ValueSource(strings = {"${CS}", "${CM}", "${CH}", "${CD}", "${CM}", "${CDOW}"})
    void format_ReturnsRightContentOnIdentifier(String identifier) {
        assertThat(CronFormattingUtils.format(identifier)).containsOnlyDigits();
    }

    @Test
    void format_ReturnsRightFormattedCronExpression() {

        LocalDateTime localDateTime = LocalDateTime.of(2022, 7, 20, 15, 14, 13);
        String cronExpression = "${CS}/5 ${CM}/5 ${CH}/5 ${CD}/5 ${CMT}/5 ${CDOW}/5";
        try (MockedStatic<LocalDateTime> ldt = mockStatic(LocalDateTime.class)) {
            ldt.when(LocalDateTime::now).thenReturn(localDateTime);
            assertThat(CronFormattingUtils.format(cronExpression))
                    .isEqualTo("13/5 14/5 15/5 20/5 7/5 3/5");
        }
    }
}
