import { prisma } from "../lib/prisma";

const opdVisitInclude = {
    patient: true,
    doctor: {
        include: {
            department: true,
            hospital: true,
        },
    },
    invoices: {
        include: {
            paymentmode: true,
            invoiceitems: {
                include: {
                    service: true,
                },
            },
        },
    },
    opddiagnoses: {
        include: {
            diagnosis: true,
        },
    },
};

export const opdvisitRepo = {
    create: (data: any) => prisma.opdvisit.create({ data }),
    findAll: () => prisma.opdvisit.findMany({ include: opdVisitInclude }),
    findById: (id: number) =>
        prisma.opdvisit.findUnique({ where: { OPDID: id }, include: opdVisitInclude }),
    update: (id: number, data: any) =>
        prisma.opdvisit.update({ where: { OPDID: id }, data }),
    delete: (id: number) =>
        prisma.opdvisit.delete({ where: { OPDID: id } }),
}
