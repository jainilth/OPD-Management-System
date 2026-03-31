import { userRepo } from "../repositories/user.repo";
import { prisma } from "../lib/prisma";

export const userService = {
    createUser: (data: any) => userRepo.create(data),
    getUser: () => userRepo.findAll(),
    checkMobile: async (mobile: string) => {
        const normalizedMobile = String(mobile || "").trim();
        if (!normalizedMobile) {
            return {
                existsInUsers: false,
                userId: null,
                existsInDoctor: false,
                existsInPatient: false,
            };
        }

        const [user, doctor, patient] = await Promise.all([
            userRepo.findByMobile(normalizedMobile),
            prisma.doctor.findFirst({ where: { Mobile: normalizedMobile }, select: { DoctorID: true } }),
            prisma.patient.findFirst({ where: { Mobile: normalizedMobile }, select: { PatientID: true } }),
        ]);

        return {
            existsInUsers: Boolean(user),
            userId: user?.UserID ?? null,
            existsInDoctor: Boolean(doctor),
            existsInPatient: Boolean(patient),
        };
    },
    getUserById: (id: number) => userRepo.findById(id),
    updateUser: (id: number, data: any) => userRepo.update(id, data),
    deleteUser: (id: number) => userRepo.delete(id),
}
