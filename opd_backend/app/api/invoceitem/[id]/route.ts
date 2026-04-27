import { invoiceitemService } from "@/app/services/invoiceitem.service";
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

        const invoiceitem = await invoiceitemService.getInvoiceitemById(Number(id))
        return success(invoiceitem)
    }
    catch (error) {
        return handleError(error)
    }
}

//update
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user: any = authenticate(req)
        authorize(user, ["Admin", "Receptionist"])

        const { id } = await params

        const body = await req.json()

        const updated = await invoiceitemService.updateInvoiceitem(Number(id), body)

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
        const user: any = authenticate(req)
        authorize(user, ["Admin"])

        const { id } = await params

        await invoiceitemService.deleteInvoiceitem(Number(id))

        return success({ message: "Deleted successfully" })
    }
    catch (error) {
        return handleError(error)
    }
}
