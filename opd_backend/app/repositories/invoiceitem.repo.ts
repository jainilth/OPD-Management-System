import { prisma } from "../lib/prisma";

const invoiceItemInclude = {
    invoice: {
        include: {
            opdvisit: true,
            paymentmode: true,
        },
    },
    service: {
        include: {
            treatmenttype: true,
        },
    },
};

export const invoiceitemRepo = {
    create: (data: any) => prisma.invoiceitem.create({ data }),
    findAll: () => prisma.invoiceitem.findMany({ include: invoiceItemInclude }),
    findById: (id: number) =>
        prisma.invoiceitem.findUnique({ where: { InvoiceItemID: id }, include: invoiceItemInclude }),
    update: (id: number, data: any) =>
        prisma.invoiceitem.update({ where: { InvoiceItemID: id }, data }),
    delete: (id: number) =>
        prisma.invoiceitem.delete({ where: { InvoiceItemID: id } }),
}
