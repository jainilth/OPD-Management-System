import { paymentmodeService } from "@/app/services/paymentmode.service";
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
        authorize(user, ["Admin", "Doctor"])

        const { id } = await params

        const paymentmode = await paymentmodeService.getPaymentmodeById(Number(id))
        return success(paymentmode)
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
        authorize(user, ["Admin"])

        const { id } = await params

        const body = await req.json()

        const updated = await paymentmodeService.updatePaymentmode(Number(id), body)

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

        await paymentmodeService.deletePaymentmode(Number(id))

        return success({ message: "Deleted successfully" })
    }
    catch (error) {
        return handleError(error)
    }
}
