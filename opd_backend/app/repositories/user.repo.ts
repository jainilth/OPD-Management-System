import { prisma } from "../lib/prisma";

export const userRepo = {
    create: (data: any) => prisma.user.create({ data }),
    findAll: () => prisma.user.findMany(),
    findById: (id: number) =>
        prisma.user.findUnique({ where: { UserID: id } }),
    update: (id: number, data: any) =>
        prisma.user.update({ where: { UserID: id }, data }),
    delete: (id: number) =>
        prisma.user.delete({ where: { UserID: id } }),
}
