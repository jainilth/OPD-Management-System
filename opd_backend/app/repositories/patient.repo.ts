import { prisma } from "../lib/prisma";

const patientInclude = {
    user: {
        include: {
            role: true,
        },
    },
};

export const patientRepo = {
    create: (data: any) => prisma.patient.create({ data }),
    findAll: () => prisma.patient.findMany({ include: patientInclude }),
    findById: (id: number) =>
        prisma.patient.findUnique({ where: { PatientID: id }, include: patientInclude }),
    update: (id: number, data: any) =>
        prisma.patient.update({ where: { PatientID: id }, data }),
    delete: (id: number) =>
        prisma.patient.delete({ where: { PatientID: id } }),
}
