import { invoiceitemRepo } from "../repositories/invoiceitem.repo";

export const invoiceitemService = {
    createInvoiceitem: (data: any) => invoiceitemRepo.create(data),
    getInvoiceitem: () => invoiceitemRepo.findAll(),
    getInvoiceitemById: (id: number) => invoiceitemRepo.findById(id),
    updateInvoiceitem: (id: number, data: any) => invoiceitemRepo.update(id, data),
    deleteInvoiceitem: (id: number) => invoiceitemRepo.delete(id),
}
