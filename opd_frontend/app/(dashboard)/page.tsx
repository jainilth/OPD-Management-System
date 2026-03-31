import DashboardHome from "@/components/dashboard/DashboardHome";
import { getSession } from "@/lib/auth";

export default async function DashboardPage() {
    const session = await getSession();

    const role = (session?.role as "Admin" | "Doctor" | "Patient" | "Receptionist" | "User") || "User";
    const username = session?.username || "User";

    return <DashboardHome role={role} username={username} />;
}
