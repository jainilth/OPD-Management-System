import { prisma } from "../lib/prisma";

export const diagnosisRepo = {
    create: (data: any) => prisma.diagnosis.create({ data }),
    findAll: () => prisma.diagnosis.findMany(),
    findById: (id: number) =>
        prisma.diagnosis.findUnique({ where: { DiagnosisID: id } }),
    update: (id: number, data: any) =>
        prisma.diagnosis.update({ where: { DiagnosisID: id }, data }),
    delete: (id: number) =>
        prisma.diagnosis.delete({ where: { DiagnosisID: id } }),
}
