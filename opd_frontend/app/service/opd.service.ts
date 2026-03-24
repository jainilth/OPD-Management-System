'use server'

import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

const API_URL = process.env.API_URL

async function authFetch(endpoint: string, options: RequestInit = {}) {
    const session = await getSession()

    if (!session?.accessToken) {
        return { error: 'Unauthorized' }
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Cookie': `accessToken=${session.accessToken}`,
            'Content-Type': 'application/json',
            ...options.headers,
        },
    })

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        return { error: errorData.message || errorData.Message || 'Request failed' }
    }

    const data = await res.json()
    return data.data ?? data
}

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

// ====== Department ======
export async function GetAllDepartments() {
    return await authFetch('/api/department')
}

// ====== Diagnosis Type ======
export async function GetAllDiagnosisTypes() {
    return await authFetch('/api/diagnosistype')
}
export async function GetDiagnosisTypeById(id: number) {
    return await authFetch(`/api/diagnosistype/${id}`)
}
export async function CreateDiagnosisType(data: any) {
    const result = await authFetch('/api/diagnosistype', {
        method: 'POST',
        body: JSON.stringify(data),
    })
    revalidatePath('/diagnosis-type')
    return result
}
export async function UpdateDiagnosisType(id: number, data: any) {
    const result = await authFetch(`/api/diagnosistype/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    })
    revalidatePath('/diagnosis-type')
    return result
}
export async function DeleteDiagnosisType(id: number) {
    const result = await authFetch(`/api/diagnosistype/${id}`, {
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

// ====== Invoice / Receipt ======
export async function GetAllInvoices() {
    return await authFetch('/api/invoice')
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

// ====== Invoice Item ======
export async function CreateInvoiceItem(data: any) {
    const result = await authFetch('/api/invoceitem', {
        method: 'POST',
        body: JSON.stringify(data),
    })
    return result
}

// ====== Payment Mode ======
export async function GetAllPaymentModes() {
    return await authFetch('/api/paymentmode')
}

// ====== Global Search ======
export async function GlobalSearch(query: string) {
    if (!query || query.length < 2) return null;

    const [patients, doctors, visits, hospitals, diagnoses, treatments, services, receipts] = await Promise.all([
        GetAllPatients().catch(() => []),
        GetAllDoctors().catch(() => []),
        GetAllOPDVisits().catch(() => []),
        GetAllHospitals().catch(() => []),
        GetAllDiagnosisTypes().catch(() => []),
        GetAllTreatmentTypes().catch(() => []),
        GetAllServices().catch(() => []),
        GetAllInvoices().catch(() => [])
    ])

    const q = query.toLowerCase()

    const filteredPatients = (Array.isArray(patients) ? patients : []).filter((p: any) => 
        p.FullName?.toLowerCase().includes(q) || p.Mobile?.includes(q) || p.PatientNo?.toString().includes(q)
    ).slice(0, 5)

    const filteredDoctors = (Array.isArray(doctors) ? doctors : []).filter((d: any) => 
        d.DoctorName?.toLowerCase().includes(q) || d.Mobile?.includes(q)
    ).slice(0, 5)

    const filteredVisits = (Array.isArray(visits) ? visits : []).filter((v: any) => 
        v.OPDNo?.toLowerCase().includes(q) || v.patient?.FullName?.toLowerCase().includes(q) || v.doctor?.DoctorName?.toLowerCase().includes(q)
    ).slice(0, 5)

    const filteredHospitals = (Array.isArray(hospitals) ? hospitals : []).filter((h: any) => 
        h.HospitalName?.toLowerCase().includes(q) || h.ContactInfo?.toLowerCase().includes(q)
    ).slice(0, 5)

    const filteredDiagnoses = (Array.isArray(diagnoses) ? diagnoses : []).filter((d: any) => 
        d.DiagnosisName?.toLowerCase().includes(q) || d.ICDCode?.toLowerCase().includes(q)
    ).slice(0, 5)

    const filteredTreatments = (Array.isArray(treatments) ? treatments : []).filter((t: any) => 
        t.TreatmentTypeName?.toLowerCase().includes(q)
    ).slice(0, 5)

    const filteredServices = (Array.isArray(services) ? services : []).filter((s: any) => 
        s.ServiceName?.toLowerCase().includes(q)
    ).slice(0, 5)

    const filteredReceipts = (Array.isArray(receipts) ? receipts : []).filter((r: any) => 
        r.InvoiceNo?.toLowerCase().includes(q) || r.InvoiceID?.toString().includes(q)
    ).slice(0, 5)

    return {
        patients: filteredPatients,
        doctors: filteredDoctors,
        visits: filteredVisits,
        hospitals: filteredHospitals,
        diagnoses: filteredDiagnoses,
        treatments: filteredTreatments,
        services: filteredServices,
        receipts: filteredReceipts
    }
}
