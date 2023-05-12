import { PermissionType } from "./permission-type";

export interface ProfileRequest {
  name?: string;
  points?: number;
  permissionType?: PermissionType;
}

export interface ProfileResponse {
  uuid?: string;
  sessionId?: string;
  name?: string;
  points?: number;
  permissionType?: PermissionType;
  passwordProtected?: boolean;
}

export interface ProfileAuthRequest {
  uuid?: string;
  password?: string;
}

export interface ProfileAuthResponse {
  sessionId?: string;
  profileId?: string;
  expiresAt?: Date;
}
