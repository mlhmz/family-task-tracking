package org.ftt.familytasktracking.mappers;


import org.ftt.familytasktracking.dtos.TaskRoutineRequestDto;
import org.ftt.familytasktracking.dtos.TaskRoutineResponseDto;
import org.ftt.familytasktracking.entities.TaskRoutine;
import org.mapstruct.Mapper;

/**
 * Mapper for the {@link TaskRoutine} and {@link TaskRoutineResponseDto} Object.
 */
@Mapper
public interface TaskRoutineMapper extends DefaultMapper {
    /**
     * Maps a {@link TaskRoutine} to a {@link TaskRoutineResponseDto}-Entity
     *
     * @param taskRoutine {@link TaskRoutine} to map
     * @return Mapped {@link TaskRoutineResponseDto}
     */
    TaskRoutineResponseDto mapTaskRoutineToTaskRoutineDto(TaskRoutine taskRoutine);

    /**
     * Maps a {@link TaskRoutineRequestDto} to a {@link TaskRoutine}-Entity
     *
     * @param dto {@link TaskRoutineRequestDto} to map
     * @return Mapped {@link TaskRoutine}
     */
    TaskRoutine mapTaskRoutineDtoToTaskRoutine(TaskRoutineRequestDto dto);
}
