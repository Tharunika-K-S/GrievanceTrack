package com.example.grievancetrack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
@SpringBootApplication
@EnableScheduling
public class GrievancetrackApplication {

    public static void main(String[] args) {
        SpringApplication.run(GrievancetrackApplication.class, args);
    }

}
