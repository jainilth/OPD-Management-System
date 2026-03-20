import { opddiagnosisRepo } from "../repositories/opddiagnosis.repo";

export const opddiagnosisService = {
    createOpddiagnosis: (data: any) => opddiagnosisRepo.create(data),
    getOpddiagnosis: () => opddiagnosisRepo.findAll(),
    getOpddiagnosisById: (id: number) => opddiagnosisRepo.findById(id),
    updateOpddiagnosis: (id: number, data: any) => opddiagnosisRepo.update(id, data),
    deleteOpddiagnosis: (id: number) => opddiagnosisRepo.delete(id),
}
