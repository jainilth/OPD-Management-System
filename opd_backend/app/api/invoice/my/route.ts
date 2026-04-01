import { invoiceService } from "@/app/services/invoice.service";
import { authenticate } from "@/middlewares/auth.middleware";
import { handleError } from "@/middlewares/error.middleware";
import { authorize } from "@/middlewares/role.middleware";
import { success } from "@/utils/response";
import { NextRequest } from "next/server";

//my-receipts
export async function GET(req: NextRequest) {
    try {
        const user: any = authenticate(req);
        authorize(user, ["Admin", "Patient", "User"]);

        const invoice = await invoiceService.getInvoiceForUser(Number(user.userId));
        return success(invoice);
    } catch (error) {
        return handleError(error);
    }
}
