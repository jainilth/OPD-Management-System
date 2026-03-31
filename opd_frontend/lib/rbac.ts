export type AppRole = "Admin" | "Doctor" | "Patient" | "Receptionist" | "User";

export function hasRole(role: string | undefined, allowedRoles: AppRole[]): boolean {
  if (!role) return false;
  return allowedRoles.includes(role as AppRole);
}
