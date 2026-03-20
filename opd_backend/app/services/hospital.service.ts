import { hospitalRepo } from "../repositories/hospital.repo";

export const hospitalService = {
    createHospital: (data: any) => hospitalRepo.create(data),
    getHospital: () => hospitalRepo.findAll(),
    getHospitalById: (id: number) => hospitalRepo.findById(id),
    updateHospital: (id: number, data: any) => hospitalRepo.update(id, data),
    deleteHospital: (id: number) => hospitalRepo.delete(id),
}
