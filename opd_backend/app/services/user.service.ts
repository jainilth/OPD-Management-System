import { userRepo } from "../repositories/user.repo";

export const userService = {
    createUser: (data: any) => userRepo.create(data),
    getUser: () => userRepo.findAll(),
    getUserById: (id: number) => userRepo.findById(id),
    updateUser: (id: number, data: any) => userRepo.update(id, data),
    deleteUser: (id: number) => userRepo.delete(id),
}
