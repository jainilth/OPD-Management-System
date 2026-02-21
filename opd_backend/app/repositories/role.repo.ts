import { prisma } from "../lib/prisma";

export const roleRepo = {
    create: (data: any) => prisma.role.create({ data }),
    findAll: () => prisma.role.findMany(),
    findById: (id: number) =>
        prisma.role.findUnique({ where: { RoleID: id } }),
    update: (id: number, data: any) =>
        prisma.role.update({ where: { RoleID: id }, data }),
    delete: (id: number) =>
        prisma.role.delete({ where: { RoleID: id } })
}