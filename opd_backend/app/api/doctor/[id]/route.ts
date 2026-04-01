import { doctorService } from "@/app/services/doctor.service";
import { authenticate } from "@/middlewares/auth.middleware";
import { handleError } from "@/middlewares/error.middleware";
import { authorize } from "@/middlewares/role.middleware";
import { success } from "@/utils/response";
import { NextRequest } from "next/server";

//getbyid
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: number }> }
) {
    try {
        const user: any = authenticate(req)
        authorize(user, ["Admin", "Doctor", "Patient", "Receptionist"])

        const { id } = await params

        const doctor = await doctorService.getDoctorById(Number(id))
        return success(doctor)
    }
    catch (error) {
        return handleError(error)
    }
}

//update
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: number }> }
) {
    try {
        const user: any = authenticate(req)
        authorize(user, ["Admin", "Receptionist"])

        const { id } = await params

        const body = await req.json()

        const updated = await doctorService.updateDoctor(Number(id), body)

        return success(updated)
    }
    catch (error) {
        return handleError(error)
    }
}

//delete
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: number }> }
) {
    try {
        const user: any = authenticate(req)
        authorize(user, ["Admin"])

        const { id } = await params

        await doctorService.deleteDoctor(Number(id))

        return success({ message: "Deleted successfully" })
    }
    catch (error) {
        return handleError(error)
    }
}
