'use server'

import { revalidatePath } from 'next/cache'
import { authFetch } from '@/app/service/base.service'

// ====== Department ======
export async function GetAllDepartments() {
    return await authFetch('/api/department')
}

// ====== Diagnosis Type ======
export async function GetAllDiagnosisTypes() {
    return await authFetch('/api/diagnosis')
}
export async function GetDiagnosisTypeById(id: number) {
    return await authFetch(`/api/diagnosis/${id}`)
}
export async function CreateDiagnosisType(data: any) {
    const result = await authFetch('/api/diagnosis', {
        method: 'POST',
        body: JSON.stringify(data),
    })
    revalidatePath('/diagnosis-type')
    return result
}
export async function UpdateDiagnosisType(id: number, data: any) {
    const result = await authFetch(`/api/diagnosis/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    })
    revalidatePath('/diagnosis-type')
    return result
}
export async function DeleteDiagnosisType(id: number) {
    const result = await authFetch(`/api/diagnosis/${id}`, {
        method: 'DELETE',
    })
    revalidatePath('/diagnosis-type')
    return result
}

// ====== Treatment Type ======
export async function GetAllTreatmentTypes() {
    return await authFetch('/api/treatmenttype')
}
export async function GetTreatmentTypeById(id: number) {
    return await authFetch(`/api/treatmenttype/${id}`)
}
export async function CreateTreatmentType(data: any) {
    const result = await authFetch('/api/treatmenttype', {
        method: 'POST',
        body: JSON.stringify(data),
    })
    revalidatePath('/treatment-type')
    return result
}
export async function UpdateTreatmentType(id: number, data: any) {
    const result = await authFetch(`/api/treatmenttype/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    })
    revalidatePath('/treatment-type')
    return result
}
export async function DeleteTreatmentType(id: number) {
    const result = await authFetch(`/api/treatmenttype/${id}`, {
        method: 'DELETE',
    })
    revalidatePath('/treatment-type')
    return result
}

// ====== Sub Treatment / Service ======
export async function GetAllServices() {
    return await authFetch('/api/service')
}
export async function GetServiceById(id: number) {
    return await authFetch(`/api/service/${id}`)
}
export async function CreateService(data: any) {
    const result = await authFetch('/api/service', {
        method: 'POST',
        body: JSON.stringify(data),
    })
    revalidatePath('/sub-treatment-type')
    return result
}
export async function UpdateService(id: number, data: any) {
    const result = await authFetch(`/api/service/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    })
    revalidatePath('/sub-treatment-type')
    return result
}
export async function DeleteService(id: number) {
    const result = await authFetch(`/api/service/${id}`, {
        method: 'DELETE',
    })
    revalidatePath('/sub-treatment-type')
    return result
}

// ====== Payment Mode ======
export async function GetAllPaymentModes() {
    return await authFetch('/api/paymentmode')
}
