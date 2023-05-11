package org.ftt.familytasktracking.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.ftt.familytasktracking.dtos.ProfileResponseDto;
import org.ftt.familytasktracking.dtos.RewardRequestDto;
import org.ftt.familytasktracking.dtos.RewardResponseDto;
import org.ftt.familytasktracking.exceptions.ErrorDetails;
import org.ftt.familytasktracking.models.RewardModel;
import org.ftt.familytasktracking.services.RewardService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/rewards")
public class RewardAdminController {
    private final RewardService rewardService;

    public RewardAdminController(RewardService rewardService) {
        this.rewardService = rewardService;
    }

    @Operation(summary = "Creates a new reward")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Created reward",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProfileResponseDto.class))}),
            @ApiResponse(responseCode = "400", description = "Invalid JSON submitted",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "401", description = "Request doesn't contain valid bearer token or " +
                    "Session Id is invalid",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "403", description = "The profile that is trying to create this resource is " +
                    "unprivileged",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))})
    }
    )
    @PostMapping
    public ResponseEntity<RewardResponseDto> createReward(@RequestBody @Valid final RewardRequestDto dto,
                                                          @AuthenticationPrincipal Jwt jwt) {
        RewardResponseDto responseDto = rewardService.createReward(dto, jwt);
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    @Operation(summary = "Updates a Reward by it's UUID and it's Authorization-Token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Found reward and updated it",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProfileResponseDto.class))}),
            @ApiResponse(responseCode = "400", description = "Invalid JSON submitted",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "401", description = "Request doesn't contain valid bearer token or " +
                    "Session Id is invalid",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "403", description = "The profile is unprivileged",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "404", description = "Reward to update couldn't be found",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}
            )}
    )
    @PutMapping("/{id}")
    public RewardResponseDto updateRewardByUuidAndJwt(@PathVariable(value = "id") UUID uuid,
                                                      @AuthenticationPrincipal Jwt jwt,
                                                      @RequestBody RewardRequestDto dto) {
        RewardModel model = this.rewardService.buildModelFromRewardRequestDto(dto);
        return this.rewardService.updateRewardByUuidAndJwt(model, uuid, jwt).toResponseDto();
    }

    @Operation(summary = "Deletes a Reward by it's UUID and it's Authorization-Token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Found reward and deleted it",
                    content = {@Content(mediaType = "application/json")}),
            @ApiResponse(responseCode = "401", description = "Request doesn't contain valid bearer token or " +
                    "Session Id is invalid",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "403", description = "The profile that is trying to delete this resource is " +
                    "unprivileged",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}),
            @ApiResponse(responseCode = "404", description = "Reward to delete couldn't be found",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorDetails.class))}
            )}
    )
    @DeleteMapping(value = "/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRewardById(@PathVariable("id") UUID id,
                                 @AuthenticationPrincipal Jwt jwt) {
        rewardService.deleteRewardByIdAndJwt(id, jwt);
    }
}
