import { prisma } from "../lib/prisma";

const serviceInclude = {
    treatmenttype: true,
};

export const serviceRepo = {
    create: (data: any) => prisma.service.create({ data }),
    findAll: () => prisma.service.findMany({ include: serviceInclude }),
    findById: (id: number) =>
        prisma.service.findUnique({ where: { ServiceID: id }, include: serviceInclude }),
    update: (id: number, data: any) =>
        prisma.service.update({ where: { ServiceID: id }, data }),
    delete: (id: number) =>
        prisma.service.delete({ where: { ServiceID: id } }),
}
