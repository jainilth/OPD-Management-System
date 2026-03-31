import { diagnosisService } from "@/app/services/diagnosis.service";
import { authenticate } from "@/middlewares/auth.middleware";
import { handleError } from "@/middlewares/error.middleware";
import { authorize } from "@/middlewares/role.middleware";
import { success } from "@/utils/response";
import { NextRequest } from "next/server";

//getall
export async function GET(req: NextRequest) {
    try {
        const user: any = authenticate(req)
        authorize(user, ["Admin","Doctor","Patient","Receptionist","User"])

        const diagnosis = await diagnosisService.getDiagnosis()
        return success(diagnosis)
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
        const diagnosis = await diagnosisService.createDiagnosis(body)

        return success(diagnosis, 201)
    }
    catch (error) {
        return handleError(error)
    }
}
