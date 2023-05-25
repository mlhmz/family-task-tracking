export interface Reward {
  uuid?: string;
  cost?: number;
  name?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  redeemedAt?: string;
  /**
   * This is backend wise a bit confusing
   * redeemedBy is an uuid of the profile who
   * redeemed the reward.
   */
  redeemedBy?: string;
  redeemed?: boolean;
}

export interface RewardRequest {
  name?: string;
  description?: string;
  cost?: number;
  redeemed?: boolean;
}
