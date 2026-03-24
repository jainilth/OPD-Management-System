'use server'

import { revalidatePath } from 'next/cache'
import { authFetch } from '@/app/service/base.service'

// ====== Hospital ======
export async function GetAllHospitals() {
    return await authFetch('/api/hospital')
}
export async function GetHospitalById(id: number) {
    return await authFetch(`/api/hospital/${id}`)
}
export async function CreateHospital(data: any) {
    const result = await authFetch('/api/hospital', {
        method: 'POST',
        body: JSON.stringify(data),
    })
    revalidatePath('/hospital')
    return result
}
export async function UpdateHospital(id: number, data: any) {
    const result = await authFetch(`/api/hospital/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    })
    revalidatePath('/hospital')
    return result
}
export async function DeleteHospital(id: number) {
    const result = await authFetch(`/api/hospital/${id}`, {
        method: 'DELETE',
    })
    revalidatePath('/hospital')
    return result
}
