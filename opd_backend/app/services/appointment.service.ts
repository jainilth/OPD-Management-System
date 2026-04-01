import { appointmentRepo } from "../repositories/appointment.repo";
import { prisma } from "../lib/prisma";

async function getPatientIdForUser(userId: number): Promise<number> {
    const patient = await prisma.patient.findFirst({ where: { UserID: userId } });
    if (!patient) {
        throw new Error("Patient profile not found for this user");
    }
    return patient.PatientID;
}

export const appointmentService = {
    createAppointment: (data: any) => appointmentRepo.create(data),
    getAppointment: () => appointmentRepo.findAll(),
    getAppointmentForPatientUser: async (userId: number) => {
        const patientId = await getPatientIdForUser(userId);
        return appointmentRepo.findAllByPatientId(patientId);
    },
    getAppointmentById: (id: number) => appointmentRepo.findById(id),
    getAppointmentByIdForPatientUser: async (id: number, userId: number) => {
        const patientId = await getPatientIdForUser(userId);
        const appointment = await appointmentRepo.findByIdAndPatientId(id, patientId);
        if (!appointment) {
            throw new Error("Appointment not found");
        }
        return appointment;
    },
    updateAppointment: (id: number, data: any) => appointmentRepo.update(id, data),
    updateAppointmentForPatientUser: async (id: number, userId: number, data: any) => {
        const patientId = await getPatientIdForUser(userId);
        const existing = await appointmentRepo.findByIdAndPatientId(id, patientId);
        if (!existing) {
            throw new Error("Appointment not found");
        }

        const updatePayload = { ...data, PatientID: patientId };
        delete updatePayload.Status;
        return appointmentRepo.update(id, updatePayload);
    },
    createAppointmentForPatientUser: async (userId: number, data: any) => {
        const patientId = await getPatientIdForUser(userId);
        const createPayload = { ...data, PatientID: patientId, Status: "Scheduled" };
        return appointmentRepo.create(createPayload);
    },
    deleteAppointment: (id: number) => appointmentRepo.delete(id),
}
