import { patientRepo } from "../repositories/patient.repo";
import { prisma } from "../lib/prisma";

export const patientService = {
    createPatient: async (data: any) => {
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

            const role = await prisma.role.findUnique({ where: { RoleName: 'Patient' } });
            if (!role) {
                throw new Error("Role 'Patient' not found in database.");
            }

            const newUser = await prisma.user.create({
                data: {
                    Username: data.Username,
                    Password: data.Password,
                    Mobile: data.Mobile,
                    RoleID: role.RoleID
                }
            });
            userId = newUser.UserID;
        }

        // Remove auth fields from data before saving to Patient to match schema
        delete data.Username;
        delete data.Password;

        data.UserID = userId;

        // Ensure PatientNo logic if needed. Usually it's handled properly by the schema or frontend.
        // Assuming data has all other required patient fields.
        return patientRepo.create(data);
    },
    getPatient: () => patientRepo.findAll(),
    getPatientById: (id: number) => patientRepo.findById(id),
    updatePatient: (id: number, data: any) => patientRepo.update(id, data),
    deletePatient: (id: number) => patientRepo.delete(id),
}
