import { opddiagnosisService } from "@/app/services/opddiagnosis.service";
import { authenticate } from "@/middlewares/auth.middleware";
import { handleError } from "@/middlewares/error.middleware";
import { authorize } from "@/middlewares/role.middleware";
import { success } from "@/utils/response";
import { NextRequest } from "next/server";

//getall
export async function GET(req: NextRequest) {
    try {
        const user: any = authenticate(req)
        authorize(user, ["Admin", "Doctor", "Receptionist"])

        const opddiagnosis = await opddiagnosisService.getOpddiagnosis()
        return success(opddiagnosis)
    }
    catch (error) {
        return handleError(error)
    }
}

//add
export async function POST(req: NextRequest) {
    try {
        const user: any = authenticate(req)
        authorize(user, ["Admin", "Doctor", "Receptionist"])

        const body = await req.json()
        const opddiagnosis = await opddiagnosisService.createOpddiagnosis(body)

        return success(opddiagnosis, 201)
    }
    catch (error) {
        return handleError(error)
    }
}
