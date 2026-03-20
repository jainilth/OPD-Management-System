import { prisma } from "../lib/prisma";

export const invoiceRepo = {
    create: (data: any) => prisma.invoice.create({ data }),
    findAll: () => prisma.invoice.findMany(),
    findById: (id: number) =>
        prisma.invoice.findUnique({ where: { InvoiceID: id } }),
    update: (id: number, data: any) =>
        prisma.invoice.update({ where: { InvoiceID: id }, data }),
    delete: (id: number) =>
        prisma.invoice.delete({ where: { InvoiceID: id } }),
}
