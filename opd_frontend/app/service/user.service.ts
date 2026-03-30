'use server'

import { revalidatePath } from 'next/cache'
import { authFetch } from '@/app/service/base.service'

/**
 * Fetch all users from the backend
 */
export async function GetAllUsers() {
    return await authFetch('/api/user')
}

/**
 * Fetch a single user by ID
 */
export async function GetUserById(id: number) {
    return await authFetch(`/api/user/${id}`)
}

/**
 * Create a new user
 */
export async function CreateUser(data: any) {
    const result = await authFetch('/api/user', {
        method: 'POST',
        body: JSON.stringify(data),
    })
    revalidatePath('/user')
    return result
}

/**
 * Update an existing user
 */
export async function UpdateUser(id: number, data: any) {
    const result = await authFetch(`/api/user/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    })
    revalidatePath('/user')
    return result
}

/**
 * Delete a user
 */
export async function DeleteUser(id: number) {
    const result = await authFetch(`/api/user/${id}`, {
        method: 'DELETE',
    })
    revalidatePath('/user')
    return result
}

/**
 * Fetch all available roles
 */
export async function GetAllRoles() {
    return await authFetch('/api/role')
}
