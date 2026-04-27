import { roleService } from "@/app/services/role.service";
import { authenticate } from "@/middlewares/auth.middleware";
import { handleError } from "@/middlewares/error.middleware";
import { authorize } from "@/middlewares/role.middleware";
import { success } from "@/utils/response";
import { NextRequest } from "next/server";

//getbbyid
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user: any = authenticate(req)
        authorize(user, ["Admin"])

        const { id } = await params

        const role = await roleService.getRoleById(Number(id))
        return success(role)
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
        authorize(user, ["Admin"])

        const { id } = await params

        const body = req.json()

        const updated = await roleService.updateRole(Number(id), body)

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

        await roleService.deleteRole(Number(id))

        return success({ message: "Deleted sucessfully" })
    }
    catch (error) {
        return handleError(error)
    }
}