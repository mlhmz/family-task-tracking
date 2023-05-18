export interface HouseholdResponse {
  uuid?: string;
  householdName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface HouseholdRequest {
  householdName?: string;
}
