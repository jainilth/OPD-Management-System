import { prisma } from "../lib/prisma";

const departmentInclude = {
    hospital: true,
};

export const departmentRepo = {
    create: (data: any) => prisma.department.create({ data }),
    findAll: () => prisma.department.findMany({ include: departmentInclude }),
    findById: (id: number) =>
        prisma.department.findUnique({ where: { DepartmentID: id }, include: departmentInclude }),
    update: (id: number, data: any) =>
        prisma.department.update({ where: { DepartmentID: id }, data }),
    delete: (id: number) =>
        prisma.department.delete({ where: { DepartmentID: id } }),
}
