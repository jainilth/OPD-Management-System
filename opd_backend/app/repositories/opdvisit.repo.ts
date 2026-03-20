import { prisma } from "../lib/prisma";

export const opdvisitRepo = {
    create: (data: any) => prisma.opdvisit.create({ data }),
    findAll: () => prisma.opdvisit.findMany(),
    findById: (id: number) =>
        prisma.opdvisit.findUnique({ where: { OPDID: id } }),
    update: (id: number, data: any) =>
        prisma.opdvisit.update({ where: { OPDID: id }, data }),
    delete: (id: number) =>
        prisma.opdvisit.delete({ where: { OPDID: id } }),
}
