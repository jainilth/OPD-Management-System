import { prisma } from "../lib/prisma";

export const hospitalRepo = {
    create: (data: any) => prisma.hospital.create({ data }),
    findAll: () => prisma.hospital.findMany(),
    findById: (id: number) =>
        prisma.hospital.findUnique({ where: { HospitalID: id } }),
    update: (id: number, data: any) =>
        prisma.hospital.update({ where: { HospitalID: id }, data }),
    delete: (id: number) =>
        prisma.hospital.delete({ where: { HospitalID: id } }),
}
