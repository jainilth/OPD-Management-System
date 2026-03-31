'use server'

import { GetAllPatients } from '@/app/service/patient.service'
import { GetAllDoctors } from '@/app/service/doctor.service'
import { GetAllOPDVisits } from '@/app/service/opdvisit.service'
import { GetAllHospitals } from '@/app/service/hospital.service'
import { GetAllDiagnosisTypes, GetAllTreatmentTypes, GetAllServices, GetAllDepartments, GetAllSpecializations, GetAllPaymentModes } from '@/app/service/master.service'
import { GetAllInvoices } from '@/app/service/invoice.service'
import { GetAllUsers, GetAllRoles } from '@/app/service/user.service'

// ====== Global Search ======
export async function GlobalSearch(query: string) {
    if (!query || query.length < 2) return null;

    const [patients, doctors, visits, hospitals, diagnoses, treatments, services, receipts, departments, specializations, paymentModes, users, roles] = await Promise.all([
        GetAllPatients().catch(() => []),
        GetAllDoctors().catch(() => []),
        GetAllOPDVisits().catch(() => []),
        GetAllHospitals().catch(() => []),
        GetAllDiagnosisTypes().catch(() => []),
        GetAllTreatmentTypes().catch(() => []),
        GetAllServices().catch(() => []),
        GetAllInvoices().catch(() => []),
        GetAllDepartments().catch(() => []),
        GetAllSpecializations().catch(() => []),
        GetAllPaymentModes().catch(() => []),
        GetAllUsers().catch(() => []),
        GetAllRoles().catch(() => []),
    ])

    const q = query.toLowerCase()

    const filteredPatients = (Array.isArray(patients) ? patients : []).filter((p: any) => 
        p.FullName?.toLowerCase().includes(q) || p.Mobile?.includes(q) || p.PatientNo?.toString().includes(q) ||
        p.user?.Username?.toLowerCase().includes(q)
    ).slice(0, 5)

    const filteredDoctors = (Array.isArray(doctors) ? doctors : []).filter((d: any) => 
        d.DoctorName?.toLowerCase().includes(q) || d.Mobile?.includes(q) ||
        d.department?.DepartmentName?.toLowerCase().includes(q) ||
        d.hospital?.HospitalName?.toLowerCase().includes(q) ||
        d.user?.Username?.toLowerCase().includes(q)
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
        s.ServiceName?.toLowerCase().includes(q) ||
        s.treatmenttype?.TreatmentTypeName?.toLowerCase().includes(q) ||
        s.Rate?.toString().includes(q)
    ).slice(0, 5)

    const filteredReceipts = (Array.isArray(receipts) ? receipts : []).filter((r: any) => 
        r.InvoiceNo?.toLowerCase().includes(q) || r.InvoiceID?.toString().includes(q) ||
        r.opdvisit?.patient?.FullName?.toLowerCase().includes(q) ||
        r.opdvisit?.doctor?.DoctorName?.toLowerCase().includes(q) ||
        r.paymentmode?.PaymentModeName?.toLowerCase().includes(q)
    ).slice(0, 5)

    const filteredDepartments = (Array.isArray(departments) ? departments : []).filter((d: any) =>
        d.DepartmentName?.toLowerCase().includes(q) ||
        d.hospital?.HospitalName?.toLowerCase().includes(q)
    ).slice(0, 5)

    const filteredSpecializations = (Array.isArray(specializations) ? specializations : []).filter((s: any) =>
        s.SpecializationName?.toLowerCase().includes(q) || s.Description?.toLowerCase().includes(q)
    ).slice(0, 5)

    const filteredPaymentModes = (Array.isArray(paymentModes) ? paymentModes : []).filter((p: any) =>
        p.PaymentModeName?.toLowerCase().includes(q)
    ).slice(0, 5)

    const filteredUsers = (Array.isArray(users) ? users : []).filter((u: any) =>
        u.Username?.toLowerCase().includes(q) ||
        u.Mobile?.includes(q) ||
        u.role?.RoleName?.toLowerCase().includes(q)
    ).slice(0, 5)

    const filteredRoles = (Array.isArray(roles) ? roles : []).filter((r: any) =>
        r.RoleName?.toLowerCase().includes(q)
    ).slice(0, 5)

    return {
        patients: filteredPatients,
        doctors: filteredDoctors,
        visits: filteredVisits,
        hospitals: filteredHospitals,
        diagnoses: filteredDiagnoses,
        treatments: filteredTreatments,
        services: filteredServices,
        receipts: filteredReceipts,
        departments: filteredDepartments,
        specializations: filteredSpecializations,
        paymentModes: filteredPaymentModes,
        users: filteredUsers,
        roles: filteredRoles,
    }
}
