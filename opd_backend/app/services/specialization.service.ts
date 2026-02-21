import { specializationRepo } from "../repositories/specialization.repo";

export const specializationService = {
    createSpecialization: (data: any) => specializationRepo.create(data),
    getSpecialization: () => specializationRepo.findAll(),
    getSpecializationById: (id: number) => specializationRepo.findById(id),
    updateSpecialization: (id: number, data: any) => specializationRepo.update(id, data),
    deleteSpecialization: (id: number) => specializationRepo.delete(id),
}