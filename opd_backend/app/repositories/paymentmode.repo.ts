import { prisma } from "../lib/prisma";

export const paymentmodeRepo = {
    create: (data: any) => prisma.paymentmode.create({ data }),
    findAll: () => prisma.paymentmode.findMany(),
    findById: (id: number) =>
        prisma.paymentmode.findUnique({ where: { PaymentModeID: id } }),
    update: (id: number, data: any) =>
        prisma.paymentmode.update({ where: { PaymentModeID: id }, data }),
    delete: (id: number) =>
        prisma.paymentmode.delete({ where: { PaymentModeID: id } }),
}
