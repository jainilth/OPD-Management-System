import { doctorRepo } from "../repositories/doctor.repo";
import { prisma } from "../lib/prisma";

export const doctorService = {
    createDoctor: async (data: any) => {
        if (!data.Mobile) {
            throw new Error("Mobile number is required");
        }

        // Check if Mobile exists in Patient table
        const existingPatient = await prisma.patient.findFirst({ where: { Mobile: data.Mobile } });
        if (existingPatient) {
            throw new Error("Mobile number already registered as a Patient");
        }

        // Check if Mobile exists in Doctor table
        const existingDoctor = await prisma.doctor.findFirst({ where: { Mobile: data.Mobile } });
        if (existingDoctor) {
            throw new Error("Mobile number already registered as a Doctor");
        }

        // Check if User exists
        let user = await prisma.user.findFirst({ where: { Mobile: data.Mobile } });
        let userId = user?.UserID;

        if (!userId) {
            if (!data.Username || !data.Password) {
                throw new Error("User does not exist. Please provide Username and Password.");
            }

            const role = await prisma.role.findUnique({ where: { RoleName: 'Doctor' } });
            if (!role) {
                throw new Error("Role 'Doctor' not found in database.");
            }

            const newUser = await prisma.user.create({
                data: {
                    Username: data.Username,
                    Password: data.Password, // Ensure hashing is handled globally or here if needed.
                    Mobile: data.Mobile,
                    RoleID: role.RoleID
                }
            });
            userId = newUser.UserID;
        }

        // Remove auth fields from data before saving to Doctor to match schema
        delete data.Username;
        delete data.Password;

        data.UserID = userId;

        return doctorRepo.create(data);
    },
    getDoctor: () => doctorRepo.findAll(),
    getDoctorById: (id: number) => doctorRepo.findById(id),
    updateDoctor: (id: number, data: any) => doctorRepo.update(id, data),
    deleteDoctor: (id: number) => doctorRepo.delete(id),
}
