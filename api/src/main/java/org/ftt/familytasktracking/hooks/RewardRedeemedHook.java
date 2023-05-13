package org.ftt.familytasktracking.hooks;

import org.ftt.familytasktracking.entities.Profile;
import org.ftt.familytasktracking.entities.Reward;
import org.ftt.familytasktracking.exceptions.WebRtException;
import org.ftt.familytasktracking.repositories.ProfileRepository;
import org.springframework.http.HttpStatus;

public class RewardRedeemedHook implements RewardUpdateHook{
    @Override
    public void executeUpdateHook(Reward targetReward, Profile profile, Boolean safe, ProfileRepository profileRepository) {
        if(targetReward.getRedeemed() && profile.getPoints() >= targetReward.getCost()){
                profile.setPoints(profile.getPoints() - targetReward.getCost());
                profileRepository.save(profile);
            }else if(!safe){
            /*
             * nothing to do here
             * not safe -> priviliged user: can redeem a reward without needing/using points
             */
        }else {
                targetReward.setRedeemed(false);
                throw new WebRtException(HttpStatus.FORBIDDEN,
                        String.format("The profile '%s' has not enough points for '%s'.", profile.getName(), targetReward.getName()));
            }
        }

    }

