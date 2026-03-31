import { prisma } from "../lib/prisma";

const appointmentInclude = {
    patient: true,
    doctor: {
        include: {
            department: true,
            hospital: true,
        },
    },
};

export const appointmentRepo = {
    create: (data: any) => prisma.appointment.create({ data }),
    findAll: () => prisma.appointment.findMany({ include: appointmentInclude }),
    findById: (id: number) =>
        prisma.appointment.findUnique({ where: { AppointmentID: id }, include: appointmentInclude }),
    update: (id: number, data: any) =>
        prisma.appointment.update({ where: { AppointmentID: id }, data }),
    delete: (id: number) =>
        prisma.appointment.delete({ where: { AppointmentID: id } }),
}
