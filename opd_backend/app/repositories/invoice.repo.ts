import { prisma } from "../lib/prisma";

const invoiceInclude = {
    opdvisit: {
        include: {
            patient: true,
            doctor: {
                include: {
                    department: true,
                },
            },
        },
    },
    paymentmode: true,
    invoiceitems: {
        include: {
            service: {
                include: {
                    treatmenttype: true,
                },
            },
        },
    },
};

export const invoiceRepo = {
    create: (data: any) => prisma.invoice.create({ data }),
    findAll: () => prisma.invoice.findMany({ include: invoiceInclude }),
    findById: (id: number) =>
        prisma.invoice.findUnique({ where: { InvoiceID: id }, include: invoiceInclude }),
    update: (id: number, data: any) =>
        prisma.invoice.update({ where: { InvoiceID: id }, data }),
    delete: (id: number) =>
        prisma.invoice.delete({ where: { InvoiceID: id } }),
}
