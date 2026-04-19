import { invoiceRepo } from "../repositories/invoice.repo";
import { AppError } from "@/utils/app-error";

export const invoiceService = {
    createInvoice: (data: any) => invoiceRepo.create(data),
    getInvoice: () => invoiceRepo.findAll(),
    getInvoiceForUser: (userId: number) => invoiceRepo.findAllByUserId(userId),
    getInvoiceById: (id: number) => invoiceRepo.findById(id),
    updateInvoice: (_id: number, _data: any) => {
        throw new AppError("Receipt cannot be updated once created", 400);
    },
    deleteInvoice: (id: number) => invoiceRepo.delete(id),
}
