'use server'

import { revalidatePath } from 'next/cache'
import { authFetch } from '@/app/service/base.service'

// ====== Patient ======
export async function GetAllPatients() {
    return await authFetch('/api/patient')
}
export async function GetPatientById(id: number) {
    return await authFetch(`/api/patient/${id}`)
}
export async function CreatePatient(data: any) {
    const result = await authFetch('/api/patient', {
        method: 'POST',
        body: JSON.stringify(data),
    })
    revalidatePath('/patient')
    return result
}
export async function UpdatePatient(id: number, data: any) {
    const result = await authFetch(`/api/patient/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    })
    revalidatePath('/patient')
    return result
}
export async function DeletePatient(id: number) {
    const result = await authFetch(`/api/patient/${id}`, {
        method: 'DELETE',
    })
    revalidatePath('/patient')
    return result
}
