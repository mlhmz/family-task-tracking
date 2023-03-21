export interface HouseholdRequest {
  householdName: string;
}

export interface HouseholdResponse {
  createdAt: Date;
  householdName: string;
  updatedAt: Date;
  uuid: string;
}
