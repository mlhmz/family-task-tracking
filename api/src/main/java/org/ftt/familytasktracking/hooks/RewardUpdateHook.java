package org.ftt.familytasktracking.hooks;

import org.ftt.familytasktracking.entities.Profile;
import org.ftt.familytasktracking.entities.Reward;
import org.ftt.familytasktracking.repositories.ProfileRepository;

public interface RewardUpdateHook {
    void executeUpdateHook(Reward targetReward, Profile profile, Boolean safe, ProfileRepository profileRepository);
}
