import { prisma } from "../lib/prisma";

export const doctorspecializationRepo = {
    create: (data: any) => prisma.doctorspecialization.create({ data }),
    findAll: () => prisma.doctorspecialization.findMany(),
    findById: (id: number) =>
        prisma.doctorspecialization.findUnique({ where: { DoctorSpecializationID: id } }),
    update: (id: number, data: any) =>
        prisma.doctorspecialization.update({ where: { DoctorSpecializationID: id }, data }),
    delete: (id: number) =>
        prisma.doctorspecialization.delete({ where: { DoctorSpecializationID: id } }),
}
