import { patientRepo } from "../repositories/patient.repo";
import { prisma } from "../lib/prisma";
import { AppError } from "@/utils/app-error";

export const patientService = {
    createPatient: async (data: any) => {
        const mobile = String(data.Mobile || "").trim();
        if (!mobile) {
            throw new AppError("Mobile number is required", 400);
        }

        return prisma.$transaction(async (tx) => {
            const role = await tx.role.findUnique({ where: { RoleName: "Patient" } });
            if (!role) {
                throw new AppError("Role 'Patient' not found in database.", 500);
            }

            const [existingPatientByMobile, existingDoctorByMobile, existingUserByMobile] = await Promise.all([
                tx.patient.findFirst({ where: { Mobile: mobile } }),
                tx.doctor.findFirst({ where: { Mobile: mobile } }),
                tx.user.findFirst({ where: { Mobile: mobile } }),
            ]);

            if (existingPatientByMobile) {
                throw new AppError("Mobile number already exists as Patient", 409);
            }

            if (existingDoctorByMobile) {
                throw new AppError("Mobile number already exists as Doctor", 409);
            }

            let user = existingUserByMobile;
            let userAction = "reused";
            let roleUpdated = false;

            if (!user) {
                if (!data.Username || !data.Password) {
                    throw new AppError("User not found by mobile. Provide Username and Password to create a new User.", 400);
                }

                user = await tx.user.create({
                    data: {
                        Username: data.Username,
                        Password: data.Password,
                        Mobile: mobile,
                        RoleID: role.RoleID,
                    },
                });
                userAction = "created";
            } else if (user.RoleID !== role.RoleID) {
                user = await tx.user.update({
                    where: { UserID: user.UserID },
                    data: { RoleID: role.RoleID },
                });
                roleUpdated = true;
            }

            const existingPatientByUser = await tx.patient.findFirst({ where: { UserID: user.UserID } });
            if (existingPatientByUser) {
                throw new AppError("Patient already exists for this user", 409);
            }

            const patientPayload = {
                ...data,
                Mobile: mobile,
                UserID: user.UserID,
            };

            delete patientPayload.Username;
            delete patientPayload.Password;

            const patient = await tx.patient.create({ data: patientPayload });

            return {
                message: `Patient created successfully. User ${userAction}.`,
                patient,
                user: {
                    UserID: user.UserID,
                    action: userAction,
                    role: "Patient",
                    roleUpdated,
                },
            };
        });
    },
    getPatient: () => patientRepo.findAll(),
    getPatientById: (id: number) => patientRepo.findById(id),
    updatePatient: async (id: number, data: any) => {
        const existingPatient = await prisma.patient.findUnique({ where: { PatientID: id } });
        if (!existingPatient) {
            throw new AppError("Patient not found", 404);
        }

        const mobile = typeof data.Mobile === "string" ? data.Mobile.trim() : undefined;
        if (!mobile) {
            return patientRepo.update(id, data);
        }

        return prisma.$transaction(async (tx) => {
            const [patientWithMobile, doctorWithMobile, userWithMobile] = await Promise.all([
                tx.patient.findFirst({ where: { Mobile: mobile } }),
                tx.doctor.findFirst({ where: { Mobile: mobile } }),
                tx.user.findFirst({ where: { Mobile: mobile } }),
            ]);

            if (patientWithMobile && patientWithMobile.PatientID !== id) {
                throw new AppError("Mobile number already exists as Patient", 409);
            }

            if (doctorWithMobile) {
                throw new AppError("Mobile number already exists as Doctor", 409);
            }

            if (existingPatient.UserID) {
                if (userWithMobile && userWithMobile.UserID !== existingPatient.UserID) {
                    throw new AppError("Mobile number already exists as User", 409);
                }

                await tx.user.update({
                    where: { UserID: existingPatient.UserID },
                    data: { Mobile: mobile },
                });
            }

            return tx.patient.update({
                where: { PatientID: id },
                data: { ...data, Mobile: mobile },
            });
        });
    },
    deletePatient: (id: number) => patientRepo.delete(id),
}
