import { appointmentRepo } from "../repositories/appointment.repo";

export const appointmentService = {
    createAppointment: (data: any) => appointmentRepo.create(data),
    getAppointment: () => appointmentRepo.findAll(),
    getAppointmentById: (id: number) => appointmentRepo.findById(id),
    updateAppointment: (id: number, data: any) => appointmentRepo.update(id, data),
    deleteAppointment: (id: number) => appointmentRepo.delete(id),
}
