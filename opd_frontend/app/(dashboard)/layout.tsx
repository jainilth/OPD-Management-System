import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { getSession } from "@/lib/auth";
import { RoleProvider } from "@/context/RoleContext";
import { AppRole } from "@/lib/rbac";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const role = (session?.role as AppRole) || "User";
  const username = session?.username || "User";

  return (
    <RoleProvider role={role} username={username}>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6 md:p-10">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </RoleProvider>
  );
}
