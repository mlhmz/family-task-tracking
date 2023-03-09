package org.ftt.familytasktracking.mappers;


import org.ftt.familytasktracking.dtos.TaskRoutineDto;
import org.ftt.familytasktracking.entities.TaskRoutine;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * Mapper for the {@link TaskRoutine} and {@link TaskRoutineDto} Object.
 */
@Mapper(componentModel = "spring")
public interface TaskRoutineMapper {
    /**
     * Maps a {@link TaskRoutine} to a {@link TaskRoutineDto}-Entity
     * The household will be mapped to a special uuid field
     *
     * @param taskRoutine {@link TaskRoutine} to map
     * @return Mapped {@link TaskRoutineDto}
     */
    @Mapping(target = "householdUuid", source = "household.uuid")
    TaskRoutineDto mapTaskRoutineToTaskRoutineDto(TaskRoutine taskRoutine);

    /**
     * Maps a {@link TaskRoutineDto} to a {@link TaskRoutine}-Entity
     * The household will be ignored.
     *
     * @param taskRoutineDto {@link TaskRoutineDto} to map
     * @return Mapped {@link TaskRoutine}
     */
    @Mapping(target = "household", ignore = true)
    TaskRoutine mapTaskRoutineDtoToTaskRoutine(TaskRoutineDto taskRoutineDto);
}
