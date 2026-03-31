import { invoiceService } from "@/app/services/invoice.service";
import { authenticate } from "@/middlewares/auth.middleware";
import { handleError } from "@/middlewares/error.middleware";
import { authorize } from "@/middlewares/role.middleware";
import { success } from "@/utils/response";
import { NextRequest } from "next/server";

//getall
export async function GET(req: NextRequest) {
    try {
        const user: any = authenticate(req)
        authorize(user, ["Admin", "Doctor", "Patient", "Receptionist"])

        const invoice = await invoiceService.getInvoice()
        return success(invoice)
    }
    catch (error) {
        return handleError(error)
    }
}

//add
export async function POST(req: NextRequest) {
    try {
        const user: any = authenticate(req)
        authorize(user, ["Admin", "Receptionist"])

        const body = await req.json()
        const invoice = await invoiceService.createInvoice(body)

        return success(invoice, 201)
    }
    catch (error) {
        return handleError(error)
    }
}
