import { invoiceitemService } from "@/app/services/invoiceitem.service";
import { authenticate } from "@/middlewares/auth.middleware";
import { handleError } from "@/middlewares/error.middleware";
import { authorize } from "@/middlewares/role.middleware";
import { success } from "@/utils/response";
import { NextRequest } from "next/server";

//getall
export async function GET(req: NextRequest) {
    try {
        const user: any = authenticate(req)
        authorize(user, ["Admin", "Doctor"])

        const invoiceitem = await invoiceitemService.getInvoiceitem()
        return success(invoiceitem)
    }
    catch (error) {
        return handleError(error)
    }
}

//add
export async function POST(req: NextRequest) {
    try {
        const user: any = authenticate(req)
        authorize(user, ["Admin", "Doctor"])

        const body = await req.json()
        const invoiceitem = await invoiceitemService.createInvoiceitem(body)

        return success(invoiceitem, 201)
    }
    catch (error) {
        return handleError(error)
    }
}
