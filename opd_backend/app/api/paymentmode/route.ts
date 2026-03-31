import { paymentmodeService } from "@/app/services/paymentmode.service";
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

        const paymentmode = await paymentmodeService.getPaymentmode()
        return success(paymentmode)
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
        const paymentmode = await paymentmodeService.createPaymentmode(body)

        return success(paymentmode, 201)
    }
    catch (error) {
        return handleError(error)
    }
}
