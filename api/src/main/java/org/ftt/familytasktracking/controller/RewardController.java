package org.ftt.familytasktracking.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.ftt.familytasktracking.config.ApplicationConfigProperties;
import org.ftt.familytasktracking.dtos.ProfileResponseDto;
import org.ftt.familytasktracking.dtos.RewardRequestDto;
import org.ftt.familytasktracking.dtos.RewardResponseDto;
import org.ftt.familytasktracking.dtos.TaskResponseDto;
import org.ftt.familytasktracking.exceptions.ErrorDetails;
import org.ftt.familytasktracking.models.RewardModel;
import org.ftt.familytasktracking.services.RewardService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Controller for all unprivileged Reward related Operations
 */
@RestController
@RequestMapping("/api/v1/rewards")
public class RewardController {
    private final RewardService rewardService;

    public RewardController(RewardService rewardService) {
        this.rewardService = rewardService;
    }

    @Operation(summary = "Gets all Rewards by the JWT")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Found rewards",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProfileResponseDto.class))}),
            @ApiResponse(responseCode = "400", description = "Invalid JSON submitted",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "401", description = "Request doesn't contain valid bearer token or " +
                    "Session ID is not valid",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "404", description = "Reward couldn't be found",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}
            )}
    )
    @GetMapping
    public List<RewardResponseDto> getAllRewardsByJwt(@AuthenticationPrincipal Jwt jwt) {
        return mapModelCollectionToDtoCollection(
                this.rewardService.getAllRewardsByJwt(jwt)
        );
    }

    @Operation(summary = "Updates a Reward safely" +
            "(Safely means that fields that unprivileged users shouldn't update won't be updated).")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Updated Reward",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = TaskResponseDto.class))}),
            @ApiResponse(responseCode = "400", description = "Invalid JSON submitted",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "401", description = "Request doesn't contain valid bearer token or " +
                    "Session ID is not valid",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "404", description = "Task to update couldn't be found from session",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}
            )}
    )
    @PutMapping("/{id}")
    public RewardResponseDto safeUpdateRewardByUuidAndJwt(
            @PathVariable(value = "id") UUID uuid,
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody RewardRequestDto dto,
            @RequestHeader(ApplicationConfigProperties.SESSION_ID_KEY) UUID sessionId) {
        RewardModel model = this.rewardService.buildModelFromRewardRequestDto(dto);
        return this.rewardService.updateRewardByUuidAndJwt(model, uuid, jwt, sessionId,true).toResponseDto();
    }

    private List<RewardResponseDto> mapModelCollectionToDtoCollection(List<RewardModel> models) {
        return models
                .stream()
                .map(RewardModel::toResponseDto)
                .toList();
    }

}
