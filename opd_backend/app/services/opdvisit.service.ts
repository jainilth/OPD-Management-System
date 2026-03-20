import { opdvisitRepo } from "../repositories/opdvisit.repo";

export const opdvisitService = {
    createOpdvisit: (data: any) => opdvisitRepo.create(data),
    getOpdvisit: () => opdvisitRepo.findAll(),
    getOpdvisitById: (id: number) => opdvisitRepo.findById(id),
    updateOpdvisit: (id: number, data: any) => opdvisitRepo.update(id, data),
    deleteOpdvisit: (id: number) => opdvisitRepo.delete(id),
}
