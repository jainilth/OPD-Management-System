import { departmentService } from "@/app/services/department.service";
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
        authorize(user, ["Admin","Doctor","Patient","Receptionist","User"])

        const { id } = await params

        const department = await departmentService.getDepartmentById(Number(id))
        return success(department)
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
        authorize(user, ["Admin","Receptionist"])

        const { id } = await params

        const body = await req.json()

        const updated = await departmentService.updateDepartment(Number(id), body)

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
        authorize(user, ["Admin","Receptionist"])

        const { id } = await params

        await departmentService.deleteDepartment(Number(id))

        return success({ message: "Deleted successfully" })
    }
    catch (error) {
        return handleError(error)
    }
}
