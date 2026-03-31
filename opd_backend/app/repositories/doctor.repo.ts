import { prisma } from "../lib/prisma";

const doctorInclude = {
    department: true,
    hospital: true,
    user: {
        include: {
            role: true,
        },
    },
};

export const doctorRepo = {
    create: (data: any) => prisma.doctor.create({ data }),
    findAll: () => prisma.doctor.findMany({ include: doctorInclude }),
    findById: (id: number) =>
        prisma.doctor.findUnique({ where: { DoctorID: id }, include: doctorInclude }),
    update: (id: number, data: any) =>
        prisma.doctor.update({ where: { DoctorID: id }, data }),
    delete: (id: number) =>
        prisma.doctor.delete({ where: { DoctorID: id } }),
}
