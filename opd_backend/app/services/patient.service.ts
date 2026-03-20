import { patientRepo } from "../repositories/patient.repo";

export const patientService = {
    createPatient: (data: any) => patientRepo.create(data),
    getPatient: () => patientRepo.findAll(),
    getPatientById: (id: number) => patientRepo.findById(id),
    updatePatient: (id: number, data: any) => patientRepo.update(id, data),
    deletePatient: (id: number) => patientRepo.delete(id),
}
