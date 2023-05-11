package org.ftt.familytasktracking.models;

import org.ftt.familytasktracking.dtos.RewardRequestDto;
import org.ftt.familytasktracking.dtos.RewardResponseDto;
import org.ftt.familytasktracking.entities.Reward;
import org.ftt.familytasktracking.mappers.RewardMapper;

public class RewardModel implements Model<Reward, RewardResponseDto>{
    private final RewardMapper rewardMapper;
    private final Reward reward;

    public RewardModel(Reward reward, RewardMapper rewardMapper){
        this.reward = reward;
        this.rewardMapper = rewardMapper;
    }

    public RewardModel(RewardRequestDto dto, RewardMapper rewardMapper){
        this.rewardMapper = rewardMapper;
        this.reward = rewardMapper.mapRewardDtoToReward(dto);
    }

    @Override
    public RewardResponseDto toResponseDto(){
        return this.rewardMapper.mapRewardToRewardDto(this.reward);
    }

    @Override
    public Reward toEntity(){return this.reward;}
}
