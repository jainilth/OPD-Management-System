import { opdvisitRepo } from "../repositories/opdvisit.repo";
import { AppError } from "@/utils/app-error";

function ensureFutureVisitDateTime(value: any) {
    const visitDate = new Date(value);
    if (Number.isNaN(visitDate.getTime())) {
        throw new AppError("Invalid VisitDateTime", 400);
    }

    if (visitDate.getTime() <= Date.now()) {
        throw new AppError("Visit time must be after current time", 400);
    }
}

export const opdvisitService = {
    createOpdvisit: (data: any) => {
        ensureFutureVisitDateTime(data.VisitDateTime);
        return opdvisitRepo.create(data);
    },
    getOpdvisit: () => opdvisitRepo.findAll(),
    getOpdvisitById: (id: number) => opdvisitRepo.findById(id),
    updateOpdvisit: (id: number, data: any) => {
        if (data?.VisitDateTime) {
            ensureFutureVisitDateTime(data.VisitDateTime);
        }
        return opdvisitRepo.update(id, data);
    },
    deleteOpdvisit: (id: number) => opdvisitRepo.delete(id),
}
