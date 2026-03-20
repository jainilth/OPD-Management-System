import { prisma } from "../lib/prisma";

export const opddiagnosisRepo = {
    create: (data: any) => prisma.opddiagnosis.create({ data }),
    findAll: () => prisma.opddiagnosis.findMany(),
    findById: (id: number) =>
        prisma.opddiagnosis.findUnique({ where: { OPDDiagnosisID: id } }),
    update: (id: number, data: any) =>
        prisma.opddiagnosis.update({ where: { OPDDiagnosisID: id }, data }),
    delete: (id: number) =>
        prisma.opddiagnosis.delete({ where: { OPDDiagnosisID: id } }),
}
