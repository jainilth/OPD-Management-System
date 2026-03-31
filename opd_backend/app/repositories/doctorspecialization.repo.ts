import { prisma } from "../lib/prisma";

const doctorSpecializationInclude = {
    doctor: {
        include: {
            department: true,
            hospital: true,
        },
    },
    specialization: true,
};

export const doctorspecializationRepo = {
    create: (data: any) => prisma.doctorspecialization.create({ data }),
    findAll: () => prisma.doctorspecialization.findMany({ include: doctorSpecializationInclude }),
    findById: (id: number) =>
        prisma.doctorspecialization.findUnique({ where: { DoctorSpecializationID: id }, include: doctorSpecializationInclude }),
    update: (id: number, data: any) =>
        prisma.doctorspecialization.update({ where: { DoctorSpecializationID: id }, data }),
    delete: (id: number) =>
        prisma.doctorspecialization.delete({ where: { DoctorSpecializationID: id } }),
}
