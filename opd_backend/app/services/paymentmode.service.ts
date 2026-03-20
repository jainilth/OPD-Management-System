import { paymentmodeRepo } from "../repositories/paymentmode.repo";

export const paymentmodeService = {
    createPaymentmode: (data: any) => paymentmodeRepo.create(data),
    getPaymentmode: () => paymentmodeRepo.findAll(),
    getPaymentmodeById: (id: number) => paymentmodeRepo.findById(id),
    updatePaymentmode: (id: number, data: any) => paymentmodeRepo.update(id, data),
    deletePaymentmode: (id: number) => paymentmodeRepo.delete(id),
}
