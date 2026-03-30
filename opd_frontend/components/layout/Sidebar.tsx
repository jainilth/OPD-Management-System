import Link from "next/link";
import { Hospital } from "lucide-react";
import { getSession } from "@/lib/auth";
import LogoutButton from "@/app/component/LogoutButton";
import SidebarNav from "./SidebarNav";

export interface MenuItem {
  name: string;
  icon: string;
  href: string;
  roles?: string[];
}

export interface MenuGroup {
  label: string;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", icon: "LayoutDashboard", href: "/" },
    ],
  },
  {
    label: "Masters",
    items: [
      { name: "Hospital", icon: "Hospital", href: "/hospital", roles: ["Admin"] },
      { name: "Doctor", icon: "UserRound", href: "/doctor", roles: ["Admin"] },
      { name: "Diagnosis Type", icon: "Stethoscope", href: "/diagnosis-type", roles: ["Admin", "Doctor"] },
      { name: "Treatment Type", icon: "Layers", href: "/treatment-type", roles: ["Admin"] },
      { name: "Sub Treatment", icon: "ListTree", href: "/sub-treatment-type", roles: ["Admin"] },
      { name: "User Master", icon: "Users", href: "/user", roles: ["Admin"] },
    ],
  },
  {
    label: "Operations",
    items: [
      { name: "Patient Reg", icon: "UserPlus", href: "/patient", roles: ["Admin", "Doctor", "Receptionist"] },
      { name: "OPD Entry", icon: "ClipboardList", href: "/opd", roles: ["Admin", "Doctor", "Receptionist"] },
      { name: "Receipt Entry", icon: "ReceiptIndianRupee", href: "/receipt", roles: ["Admin", "Receptionist", "Billing"] },
    ],
  },
];

export async function Sidebar() {
  const session = await getSession();

  const filteredGroups = menuGroups
    .map(group => ({
      ...group,
      items: group.items.filter(item => 
        !item.roles || (session?.role && item.roles.includes(session.role))
      ),
    }))
    .filter(group => group.items.length > 0);

  return (
    <div className="flex h-full flex-col bg-slate-950 text-white w-72 shadow-2xl relative z-40">
      <div className="flex h-20 items-center px-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900 group-hover:scale-110 transition-transform">
            <Hospital className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="font-black text-xl tracking-tighter">OPD PRO</span>
            <div className="h-1 w-8 bg-blue-600 rounded-full mt-[-2px]" />
          </div>
        </Link>
      </div>

      <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        <SidebarNav groups={filteredGroups} />
      </div>

      <div className="p-4 bg-slate-900/50 m-4 rounded-3xl border border-slate-800">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white shadow-lg">
            {session?.username?.[0]?.toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-black truncate">{session?.username}</span>
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{session?.role}</span>
          </div>
        </div>
        <LogoutButton />
      </div>
    </div>
  );
}
