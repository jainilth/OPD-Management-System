import { prisma } from "../lib/prisma";

export const specializationRepo = {
    create: (data: any) => prisma.specialization.create({ data }),
    findAll: () => prisma.specialization.findMany(),
    findById: (id: number) =>
        prisma.specialization.findUnique({ where: { SpecializationID: id } }),
    update: (id: number, data: any) =>
        prisma.specialization.update({ where: { SpecializationID: id }, data }),
    delete: (id: number) =>
        prisma.specialization.delete({ where: { SpecializationID: id } }),
}