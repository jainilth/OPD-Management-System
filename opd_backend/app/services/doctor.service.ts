import { doctorRepo } from "../repositories/doctor.repo";

export const doctorService = {
    createDoctor: (data: any) => doctorRepo.create(data),
    getDoctor: () => doctorRepo.findAll(),
    getDoctorById: (id: number) => doctorRepo.findById(id),
    updateDoctor: (id: number, data: any) => doctorRepo.update(id, data),
    deleteDoctor: (id: number) => doctorRepo.delete(id),
}
