import { PermissionType } from './permission-type';

export interface ProfileRequest {
  name?: string;
  permissionType?: PermissionType;
  points?: number;
}

export interface ProfileResponse {
  createdAt: Date;
  name: string;
  permissionType: PermissionType;
  points: number;
  updatedAt: Date;
  uuid: string;
}
