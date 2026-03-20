import { serviceRepo } from "../repositories/service.repo";

export const serviceService = {
    createService: (data: any) => serviceRepo.create(data),
    getService: () => serviceRepo.findAll(),
    getServiceById: (id: number) => serviceRepo.findById(id),
    updateService: (id: number, data: any) => serviceRepo.update(id, data),
    deleteService: (id: number) => serviceRepo.delete(id),
}
