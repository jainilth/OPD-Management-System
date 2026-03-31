import { prisma } from "../lib/prisma";

const userInclude = {
    role: true,
    doctor: {
        include: {
            department: true,
            hospital: true,
        },
    },
    patient: true,
};

export const userRepo = {
    create: (data: any) => prisma.user.create({ data }),
    findAll: () => prisma.user.findMany({ include: userInclude }),
    findByMobile: (mobile: string) =>
        prisma.user.findFirst({ where: { Mobile: mobile } }),
    findById: (id: number) =>
        prisma.user.findUnique({ where: { UserID: id }, include: userInclude }),
    update: (id: number, data: any) =>
        prisma.user.update({ where: { UserID: id }, data }),
    delete: (id: number) =>
        prisma.user.delete({ where: { UserID: id } }),
}
