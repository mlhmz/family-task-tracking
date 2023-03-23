package org.ftt.familytasktracking.services;

import org.ftt.familytasktracking.repositories.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class TaskServiceImpl implements TaskService {

    private TaskRepository taskRepository;

    @Override
    public void delete(UUID taskId) {

        if (!taskRepository.existsTaskByUuid(taskId)) {
            //TODO durch fachliche Exception ersetzen
            throw new RuntimeException("Task was not found");
        }
        taskRepository.deleteById(taskId);
    }
}
