package org.ftt.familytasktracking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;

@SpringBootApplication
@ServletComponentScan
public class FamilyTaskTrackingApplication {

    public static void main(String[] args) {
        SpringApplication.run(FamilyTaskTrackingApplication.class, args);
    }
}
