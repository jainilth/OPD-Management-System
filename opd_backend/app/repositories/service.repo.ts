import { prisma } from "../lib/prisma";

export const serviceRepo = {
    create: (data: any) => prisma.service.create({ data }),
    findAll: () => prisma.service.findMany(),
    findById: (id: number) =>
        prisma.service.findUnique({ where: { ServiceID: id } }),
    update: (id: number, data: any) =>
        prisma.service.update({ where: { ServiceID: id }, data }),
    delete: (id: number) =>
        prisma.service.delete({ where: { ServiceID: id } }),
}
