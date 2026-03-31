import { treatmenttypeService } from "@/app/services/treatmenttype.service";
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

        const treatmenttype = await treatmenttypeService.getTreatmenttype()
        return success(treatmenttype)
    }
    catch (error) {
        return handleError(error)
    }
}


//add
export async function POST(req: NextRequest) {
    try {
        const user: any = authenticate(req);
        authorize(user, ["Admin", "Doctor", "Receptionist"]);
        const body = await req.json();
        const treatmenttype = await treatmenttypeService.createTreatmenttype(body)
        return success(treatmenttype, 201)
    }
    catch (error) {
        return handleError(error)
    }
}