export function authorize(user: any, allowedRoles: string[]) {
    if (!allowedRoles.includes(user.role)) {
        throw new Error("Forbidden");
    }
}