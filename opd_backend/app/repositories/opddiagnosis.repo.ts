import { prisma } from "../lib/prisma";

const opdDiagnosisInclude = {
    opdvisit: {
        include: {
            patient: true,
            doctor: {
                include: {
                    department: true,
                },
            },
        },
    },
    diagnosis: true,
};

export const opddiagnosisRepo = {
    create: (data: any) => prisma.opddiagnosis.create({ data }),
    findAll: () => prisma.opddiagnosis.findMany({ include: opdDiagnosisInclude }),
    findById: (id: number) =>
        prisma.opddiagnosis.findUnique({ where: { OPDDiagnosisID: id }, include: opdDiagnosisInclude }),
    update: (id: number, data: any) =>
        prisma.opddiagnosis.update({ where: { OPDDiagnosisID: id }, data }),
    delete: (id: number) =>
        prisma.opddiagnosis.delete({ where: { OPDDiagnosisID: id } }),
}
