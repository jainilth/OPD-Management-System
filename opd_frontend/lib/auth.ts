import { cookies } from "next/headers"
import { decrypt } from "./session"

export async function getSession() {
    const cookie = (await cookies()).get("session")?.value
    return await decrypt(cookie)
}

export async function logout() {
    (await cookies()).delete("session")
}
