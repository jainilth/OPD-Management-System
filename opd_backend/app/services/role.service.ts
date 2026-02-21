import { roleRepo } from "../repositories/role.repo";

export const roleService = {
    createRole: (data: any) => roleRepo.create(data),
    getRole: () => roleRepo.findAll(),
    getRoleById: (id: number) => roleRepo.findById(id),
    updateRole: (id: number, data: any) => roleRepo.update(id, data),
    deleteRole: (id: number) => roleRepo.delete(id),
}