import { invoiceRepo } from "../repositories/invoice.repo";

export const invoiceService = {
    createInvoice: (data: any) => invoiceRepo.create(data),
    getInvoice: () => invoiceRepo.findAll(),
    getInvoiceForUser: (userId: number) => invoiceRepo.findAllByUserId(userId),
    getInvoiceById: (id: number) => invoiceRepo.findById(id),
    updateInvoice: (id: number, data: any) => invoiceRepo.update(id, data),
    deleteInvoice: (id: number) => invoiceRepo.delete(id),
}
