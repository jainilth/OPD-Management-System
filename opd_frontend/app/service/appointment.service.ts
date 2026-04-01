'use server'

import { revalidatePath } from 'next/cache'
import { authFetch } from '@/app/service/base.service'

export async function GetAllAppointments() {
    return await authFetch('/api/appointment')
}

export async function GetMyAppointments() {
    return await authFetch('/api/appointment/my')
}

export async function GetAppointmentById(id: number) {
    return await authFetch(`/api/appointment/${id}`)
}

export async function CreateAppointment(data: any) {
    const result = await authFetch('/api/appointment', {
        method: 'POST',
        body: JSON.stringify(data),
    })
    revalidatePath('/appointment')
    return result
}

export async function UpdateAppointment(id: number, data: any) {
    const result = await authFetch(`/api/appointment/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    })
    revalidatePath('/appointment')
    return result
}

export async function DeleteAppointment(id: number) {
    const result = await authFetch(`/api/appointment/${id}`, {
        method: 'DELETE',
    })
    revalidatePath('/appointment')
    return result
}
