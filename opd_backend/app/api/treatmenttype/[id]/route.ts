import { treatmenttypeService } from "@/app/services/treatmenttype.service";
import { authenticate } from "@/middlewares/auth.middleware";
import { handleError } from "@/middlewares/error.middleware";
import { authorize } from "@/middlewares/role.middleware";
import { success } from "@/utils/response";
import { NextRequest } from "next/server";
import { use } from "react";

//getbtid
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: number }> }
) {
    try {
        const { id } = await params

        const user: any = authenticate(req)
        authorize(user, ["Admin", "Doctor"])

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
    { params }: { params: Promise<{ id: number }> }
) {
    try {
        const { id } = await params

        const user: any = authenticate(req)
        authorize(user, ["Admin"])

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
    { params }: { params: Promise<{ id: number }> }
) {
    try {
        const { id } = await params

        const user: any = authenticate(req);
        authorize(user, ["Admin"]);

        await treatmenttypeService.deleteTreatmenttype(
            Number(id)
        )
        return success({ message: "Deleted sucessfully" })
    }
    catch (error) {
        return handleError(error)
    }
}