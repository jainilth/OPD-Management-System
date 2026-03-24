'use server'

import { revalidatePath } from 'next/cache'
import { authFetch } from '@/app/service/base.service'

// ====== OPD Visit ======
export async function GetAllOPDVisits() {
    return await authFetch('/api/opdvisit')
}
export async function GetOPDVisitById(id: number) {
    return await authFetch(`/api/opdvisit/${id}`)
}
export async function CreateOPDVisit(data: any) {
    const result = await authFetch('/api/opdvisit', {
        method: 'POST',
        body: JSON.stringify(data),
    })
    revalidatePath('/opd')
    return result
}

// ====== OPD Diagnosis ======
export async function CreateOPDDiagnosis(data: any) {
    const result = await authFetch('/api/opddiagnosis', {
        method: 'POST',
        body: JSON.stringify(data),
    })
    return result
}
