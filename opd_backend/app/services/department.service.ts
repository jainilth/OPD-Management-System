import { departmentRepo } from "../repositories/department.repo";

export const departmentService = {
    createDepartment: (data: any) => departmentRepo.create(data),
    getDepartment: () => departmentRepo.findAll(),
    getDepartmentById: (id: number) => departmentRepo.findById(id),
    updateDepartment: (id: number, data: any) => departmentRepo.update(id, data),
    deleteDepartment: (id: number) => departmentRepo.delete(id),
}
