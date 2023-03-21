import { IntervalType } from './interval-type';

export interface TaskRoutineRequest {
  activated?: boolean;
  description?: string;
  interval?: number;
  intervalType?: IntervalType;
  name?: string;
}

export interface TaskRoutineResponse {
  activated: boolean;
  createdAt: Date;
  description: string;
  interval: number;
  intervalType: IntervalType;
  lastTaskCreationAt: Date;
  name: string;
  updatedAt: Date;
  uuid: string;
}
