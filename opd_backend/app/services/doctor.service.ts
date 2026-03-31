import { doctorRepo } from "../repositories/doctor.repo";
import { prisma } from "../lib/prisma";
import { AppError } from "@/utils/app-error";

export const doctorService = {
    createDoctor: async (data: any) => {
        const mobile = String(data.Mobile || "").trim();
        if (!mobile) {
            throw new AppError("Mobile number is required", 400);
        }

        return prisma.$transaction(async (tx) => {
            const role = await tx.role.findUnique({ where: { RoleName: "Doctor" } });
            if (!role) {
                throw new AppError("Role 'Doctor' not found in database.", 500);
            }

            const [existingDoctorByMobile, existingPatientByMobile, existingUserByMobile] = await Promise.all([
                tx.doctor.findFirst({ where: { Mobile: mobile } }),
                tx.patient.findFirst({ where: { Mobile: mobile } }),
                tx.user.findFirst({ where: { Mobile: mobile } }),
            ]);

            if (existingDoctorByMobile) {
                throw new AppError("Mobile number already exists as Doctor", 409);
            }
            if (existingPatientByMobile) {
                throw new AppError("Mobile number already exists as Patient", 409);
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

            const existingDoctorByUser = await tx.doctor.findFirst({ where: { UserID: user.UserID } });
            if (existingDoctorByUser) {
                throw new AppError("Doctor already exists for this user", 409);
            }

            const doctorPayload = {
                ...data,
                Mobile: mobile,
                UserID: user.UserID,
            };

            delete doctorPayload.Username;
            delete doctorPayload.Password;

            const doctor = await tx.doctor.create({ data: doctorPayload });

            return {
                message: `Doctor created successfully. User ${userAction}.`,
                doctor,
                user: {
                    UserID: user.UserID,
                    action: userAction,
                    role: "Doctor",
                    roleUpdated,
                },
            };
        });
    },
    getDoctor: () => doctorRepo.findAll(),
    getDoctorById: (id: number) => doctorRepo.findById(id),
    updateDoctor: async (id: number, data: any) => {
        const existingDoctor = await prisma.doctor.findUnique({ where: { DoctorID: id } });
        if (!existingDoctor) {
            throw new AppError("Doctor not found", 404);
        }

        const mobile = typeof data.Mobile === "string" ? data.Mobile.trim() : undefined;
        if (!mobile) {
            return doctorRepo.update(id, data);
        }

        return prisma.$transaction(async (tx) => {
            const [doctorWithMobile, patientWithMobile, userWithMobile] = await Promise.all([
                tx.doctor.findFirst({ where: { Mobile: mobile } }),
                tx.patient.findFirst({ where: { Mobile: mobile } }),
                tx.user.findFirst({ where: { Mobile: mobile } }),
            ]);

            if (doctorWithMobile && doctorWithMobile.DoctorID !== id) {
                throw new AppError("Mobile number already exists as Doctor", 409);
            }

            if (patientWithMobile) {
                throw new AppError("Mobile number already exists as Patient", 409);
            }

            if (existingDoctor.UserID) {
                if (userWithMobile && userWithMobile.UserID !== existingDoctor.UserID) {
                    throw new AppError("Mobile number already exists as User", 409);
                }

                await tx.user.update({
                    where: { UserID: existingDoctor.UserID },
                    data: { Mobile: mobile },
                });
            }

            return tx.doctor.update({
                where: { DoctorID: id },
                data: { ...data, Mobile: mobile },
            });
        });
    },
    deleteDoctor: (id: number) => doctorRepo.delete(id),
}
