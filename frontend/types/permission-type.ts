export enum PermissionType {
  Admin = "ADMIN",
  Member = "MEMBER",
}

export function getTranslatedPTValue(permissionType: PermissionType) {
  if (permissionType == PermissionType.Admin) {
    return "Privileged";
  } else {
    return "Unprivileged"
  }
}
