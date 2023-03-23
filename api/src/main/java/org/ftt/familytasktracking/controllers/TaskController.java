package org.ftt.familytasktracking.controllers;

import org.ftt.familytasktracking.services.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
public class TaskController {

    private TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @DeleteMapping(value = "/id")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public HttpStatusCode delete(@PathVariable UUID taskId) {
        taskService.delete(taskId);
        return HttpStatus.NO_CONTENT;
    }
}
