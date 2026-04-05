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
    updateOpdvisit: async (id: number, data: any) => {
        const existingVisit = await opdvisitRepo.findById(id);
        if (!existingVisit) {
            throw new AppError("OPD visit not found", 404);
        }

        const existingVisitDateTime = existingVisit.VisitDateTime;
        if (!existingVisitDateTime) {
            throw new AppError("Only future OPD visits can be updated", 400);
        }

        const existingVisitTime = new Date(existingVisitDateTime);
        if (Number.isNaN(existingVisitTime.getTime()) || existingVisitTime.getTime() <= Date.now()) {
            throw new AppError("Only future OPD visits can be updated", 400);
        }

        if (data?.VisitDateTime) {
            ensureFutureVisitDateTime(data.VisitDateTime);
        }

        return opdvisitRepo.update(id, data);
    },
    deleteOpdvisit: (id: number) => opdvisitRepo.delete(id),
}
