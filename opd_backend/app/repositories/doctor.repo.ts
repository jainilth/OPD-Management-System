import { prisma } from "../lib/prisma";

export const doctorRepo = {
    create: (data: any) => prisma.doctor.create({ data }),
    findAll: () => prisma.doctor.findMany(),
    findById: (id: number) =>
        prisma.doctor.findUnique({ where: { DoctorID: id } }),
    update: (id: number, data: any) =>
        prisma.doctor.update({ where: { DoctorID: id }, data }),
    delete: (id: number) =>
        prisma.doctor.delete({ where: { DoctorID: id } }),
}
