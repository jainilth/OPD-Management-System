import { prisma } from "../lib/prisma";

export const patientRepo = {
    create: (data: any) => prisma.patient.create({ data }),
    findAll: () => prisma.patient.findMany(),
    findById: (id: number) =>
        prisma.patient.findUnique({ where: { PatientID: id } }),
    update: (id: number, data: any) =>
        prisma.patient.update({ where: { PatientID: id }, data }),
    delete: (id: number) =>
        prisma.patient.delete({ where: { PatientID: id } }),
}
