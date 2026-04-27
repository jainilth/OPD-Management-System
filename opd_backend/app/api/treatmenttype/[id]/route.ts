import { treatmenttypeService } from "@/app/services/treatmenttype.service";
import { authenticate } from "@/middlewares/auth.middleware";
import { handleError } from "@/middlewares/error.middleware";
import { authorize } from "@/middlewares/role.middleware";
import { success } from "@/utils/response";
import { NextRequest } from "next/server";

//getbyid
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user: any = authenticate(req)
        authorize(user, ["Admin", "Doctor", "Receptionist"])

        const { id } = await params

        const treatmenttype = await treatmenttypeService.getTreatmenttypeById(
            Number(id)
        )

        return success(treatmenttype)
    }
    catch (error) {
        handleError(error)
    }
}

//update
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user: any = authenticate(req)
        authorize(user, ["Admin", "Doctor", "Receptionist"])

        const { id } = await params

        const body = await req.json()

        const updated = await treatmenttypeService.updateTreatmenttype(
            Number(id),
            body
        )

        return success(updated)
    }
    catch (error) {
        return handleError(error)
    }
}

//delete
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user: any = authenticate(req);
        authorize(user, ["Admin"]);

        const { id } = await params

        await treatmenttypeService.deleteTreatmenttype(
            Number(id)
        )
        return success({ message: "Deleted sucessfully" })
    }
    catch (error) {
        return handleError(error)
    }
}