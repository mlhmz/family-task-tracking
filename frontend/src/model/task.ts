export interface TaskRequest {
  assigneeUuid?: string;
  description?: string;
  done?: boolean;
  name?: string;
}

export interface TaskResponse {
  assigneeUuid: string;
  createdAt: Date;
  description: string;
  done: boolean;
  doneAt?: Date;
  expirationAt?: Date;
  name: string;
  updatedAt: Date;
  uuid: string;
}
