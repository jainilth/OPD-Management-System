'use server'

import { revalidatePath } from 'next/cache'
import { authFetch } from '@/app/service/base.service'

// ====== Doctor ======
export async function GetAllDoctors() {
    return await authFetch('/api/doctor')
}
export async function GetDoctorById(id: number) {
    return await authFetch(`/api/doctor/${id}`)
}
export async function CreateDoctor(data: any) {
    const result = await authFetch('/api/doctor', {
        method: 'POST',
        body: JSON.stringify(data),
    })
    revalidatePath('/doctor')
    return result
}
export async function UpdateDoctor(id: number, data: any) {
    const result = await authFetch(`/api/doctor/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    })
    revalidatePath('/doctor')
    return result
}
export async function DeleteDoctor(id: number) {
    const result = await authFetch(`/api/doctor/${id}`, {
        method: 'DELETE',
    })
    revalidatePath('/doctor')
    return result
}
