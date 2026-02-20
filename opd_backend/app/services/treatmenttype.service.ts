import { treatmenttypeRepo } from "../repositories/treatmenttype.repo"
export const treatmenttypeService={
    createTreatmenttype:(data:any)=>treatmenttypeRepo.create(data),
    getTreatmenttype:()=>treatmenttypeRepo.findAll(),
    getTreatmenttypeById:(id:number)=>treatmenttypeRepo.findById(id),
    updateTreatmenttype:(id:number,data:any)=>treatmenttypeRepo.update(id,data),
    deleteTreatmenttype:(id:number)=>treatmenttypeRepo.delete(id),
}