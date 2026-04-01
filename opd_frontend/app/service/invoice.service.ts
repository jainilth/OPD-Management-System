'use server'

import { revalidatePath } from 'next/cache'
import { authFetch } from '@/app/service/base.service'

// ====== Invoice / Receipt ======
export async function GetAllInvoices() {
    return await authFetch('/api/invoice')
}
export async function GetMyInvoices() {
    return await authFetch('/api/invoice/my')
}
export async function GetInvoiceById(id: number) {
    return await authFetch(`/api/invoice/${id}`)
}
export async function CreateInvoice(data: any) {
    const result = await authFetch('/api/invoice', {
        method: 'POST',
        body: JSON.stringify(data),
    })
    revalidatePath('/receipt')
    return result
}

export async function UpdateInvoice(id: number, data: any) {
    const result = await authFetch(`/api/invoice/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    })
    revalidatePath('/receipt')
    return result
}

export async function DeleteInvoice(id: number) {
    const result = await authFetch(`/api/invoice/${id}`, {
        method: 'DELETE',
    })
    revalidatePath('/receipt')
    return result
}

// ====== Invoice Item ======
export async function CreateInvoiceItem(data: any) {
    const result = await authFetch('/api/invoceitem', {
        method: 'POST',
        body: JSON.stringify(data),
    })
    return result
}
