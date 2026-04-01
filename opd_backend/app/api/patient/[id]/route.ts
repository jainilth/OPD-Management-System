import { patientService } from "@/app/services/patient.service";
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
        authorize(user, ["Admin", "Doctor", "Receptionist"])

        const { id } = await params

        const patient = await patientService.getPatientById(Number(id))
        return success(patient)
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
        authorize(user, ["Admin", "Doctor", "Receptionist"])

        const { id } = await params

        const body = await req.json()

        const updated = await patientService.updatePatient(Number(id), body)

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

        await patientService.deletePatient(Number(id))

        return success({ message: "Deleted successfully" })
    }
    catch (error) {
        return handleError(error)
    }
}
