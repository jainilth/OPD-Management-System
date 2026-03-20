import { prisma } from "../lib/prisma";

export const invoiceitemRepo = {
    create: (data: any) => prisma.invoiceitem.create({ data }),
    findAll: () => prisma.invoiceitem.findMany(),
    findById: (id: number) =>
        prisma.invoiceitem.findUnique({ where: { InvoiceItemID: id } }),
    update: (id: number, data: any) =>
        prisma.invoiceitem.update({ where: { InvoiceItemID: id }, data }),
    delete: (id: number) =>
        prisma.invoiceitem.delete({ where: { InvoiceItemID: id } }),
}
