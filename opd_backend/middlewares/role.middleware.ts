export function authorize(user: any, allowedRoles: string[]) {
    // console.log(user)
    if (!allowedRoles.includes(user.role)) {
        throw new Error("Forbidden");
    }
}