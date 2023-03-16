package org.ftt.familytasktracking.mappers;


import org.ftt.familytasktracking.dtos.TaskRoutineDto;
import org.ftt.familytasktracking.entities.TaskRoutine;
import org.mapstruct.Mapper;

/**
 * Mapper for the {@link TaskRoutine} and {@link TaskRoutineDto} Object.
 */
@Mapper(componentModel = "spring")
public interface TaskRoutineMapper {
    /**
     * Maps a {@link TaskRoutine} to a {@link TaskRoutineDto}-Entity
     *
     * @param taskRoutine {@link TaskRoutine} to map
     * @return Mapped {@link TaskRoutineDto}
     */
    TaskRoutineDto mapTaskRoutineToTaskRoutineDto(TaskRoutine taskRoutine);

    /**
     * Maps a {@link TaskRoutineDto} to a {@link TaskRoutine}-Entity
     *
     * @param taskRoutineDto {@link TaskRoutineDto} to map
     * @return Mapped {@link TaskRoutine}
     */
    TaskRoutine mapTaskRoutineDtoToTaskRoutine(TaskRoutineDto taskRoutineDto);
}
