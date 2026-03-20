import { doctorspecializationRepo } from "../repositories/doctorspecialization.repo";

export const doctorspecializationService = {
    createDoctorspecialization: (data: any) => doctorspecializationRepo.create(data),
    getDoctorspecialization: () => doctorspecializationRepo.findAll(),
    getDoctorspecializationById: (id: number) => doctorspecializationRepo.findById(id),
    updateDoctorspecialization: (id: number, data: any) => doctorspecializationRepo.update(id, data),
    deleteDoctorspecialization: (id: number) => doctorspecializationRepo.delete(id),
}
