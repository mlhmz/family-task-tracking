import { PermissionType } from "./permission-type";

export interface ProfileRequest {
    name?: string,
    points?: number,
    permissionType?: PermissionType
}