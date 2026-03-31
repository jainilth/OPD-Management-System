import { userService } from "@/app/services/user.service";
import { authenticate } from "@/middlewares/auth.middleware";
import { handleError } from "@/middlewares/error.middleware";
import { authorize } from "@/middlewares/role.middleware";
import { success } from "@/utils/response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user: any = authenticate(req);
    authorize(user, ["Admin", "Receptionist"]);

    const mobile = req.nextUrl.searchParams.get("mobile") || "";
    const status = await userService.checkMobile(mobile);

    return success(status);
  } catch (error) {
    return handleError(error);
  }
}
