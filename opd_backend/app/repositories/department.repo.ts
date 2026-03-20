import { prisma } from "../lib/prisma";

export const departmentRepo = {
    create: (data: any) => prisma.department.create({ data }),
    findAll: () => prisma.department.findMany(),
    findById: (id: number) =>
        prisma.department.findUnique({ where: { DepartmentID: id } }),
    update: (id: number, data: any) =>
        prisma.department.update({ where: { DepartmentID: id }, data }),
    delete: (id: number) =>
        prisma.department.delete({ where: { DepartmentID: id } }),
}
