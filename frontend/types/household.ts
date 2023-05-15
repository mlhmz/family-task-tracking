export interface HouseholdResponse {
  uuid?: string;
  householdName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface HouseholdRequest {
  householdName?: string;
}
