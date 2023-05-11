interface HouseholdResponse {
  uuid?: string;
  householdName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface HouseholdRequest {
  householdName?: string;
}
