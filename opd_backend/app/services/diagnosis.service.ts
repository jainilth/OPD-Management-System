import { diagnosisRepo } from "../repositories/diagnosis.repo";

export const diagnosisService = {
    createDiagnosis: (data: any) => diagnosisRepo.create(data),
    getDiagnosis: () => diagnosisRepo.findAll(),
    getDiagnosisById: (id: number) => diagnosisRepo.findById(id),
    updateDiagnosis: (id: number, data: any) => diagnosisRepo.update(id, data),
    deleteDiagnosis: (id: number) => diagnosisRepo.delete(id),
}
