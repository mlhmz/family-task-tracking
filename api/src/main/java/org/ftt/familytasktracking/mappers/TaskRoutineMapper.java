package org.ftt.familytasktracking.mappers;


import org.ftt.familytasktracking.dtos.TaskRoutineResponseDto;
import org.ftt.familytasktracking.entities.TaskRoutine;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * Mapper for the {@link TaskRoutine} and {@link TaskRoutineResponseDto} Object.
 */
@Mapper(componentModel = "spring")
public interface TaskRoutineMapper {
    /**
     * Maps a {@link TaskRoutine} to a {@link TaskRoutineResponseDto}-Entity
     *
     * @param taskRoutine {@link TaskRoutine} to map
     * @return Mapped {@link TaskRoutineResponseDto}
     */
    TaskRoutineResponseDto mapTaskRoutineToTaskRoutineDto(TaskRoutine taskRoutine);

    /**
     * Maps a {@link TaskRoutineResponseDto} to a {@link TaskRoutine}-Entity
     *
     * @param taskRoutineResponseDto {@link TaskRoutineResponseDto} to map
     * @return Mapped {@link TaskRoutine}
     */
    @Mapping(target = "household", ignore = true)
    TaskRoutine mapTaskRoutineDtoToTaskRoutine(TaskRoutineResponseDto taskRoutineResponseDto);
}
