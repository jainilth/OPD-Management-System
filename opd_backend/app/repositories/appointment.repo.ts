import { prisma } from "../lib/prisma";

export const appointmentRepo = {
    create: (data: any) => prisma.appointment.create({ data }),
    findAll: () => prisma.appointment.findMany(),
    findById: (id: number) =>
        prisma.appointment.findUnique({ where: { AppointmentID: id } }),
    update: (id: number, data: any) =>
        prisma.appointment.update({ where: { AppointmentID: id }, data }),
    delete: (id: number) =>
        prisma.appointment.delete({ where: { AppointmentID: id } }),
}
