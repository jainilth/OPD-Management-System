import { departmentService } from "@/app/services/department.service";
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

        const department = await departmentService.getDepartment()
        return success(department)
    }
    catch (error) {
        return handleError(error)
    }
}

//add
export async function POST(req: NextRequest) {
    try {
        const user: any = authenticate(req)
        authorize(user, ["Admin","Receptionist",])

        const body = await req.json()
        const department = await departmentService.createDepartment(body)

        return success(department, 201)
    }
    catch (error) {
        return handleError(error)
    }
}
