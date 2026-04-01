"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Hospital,
  Building2,
  BadgePlus,
  UserRound,
  ShieldCheck,
  WalletCards,
  Stethoscope,
  Layers,
  ListTree,
  UserPlus,
  ClipboardList,
  CalendarCheck,
  ReceiptIndianRupee,
  LayoutDashboard,
  Users,
  ChevronRight,
  ChevronDown,
  LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Hospital,
  Building2,
  BadgePlus,
  UserRound,
  ShieldCheck,
  WalletCards,
  Stethoscope,
  Layers,
  ListTree,
  UserPlus,
  ClipboardList,
  CalendarCheck,
  ReceiptIndianRupee,
  Users,
};

interface MenuItem {
  name: string;
  icon: string;
  href: string;
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
}

export default function SidebarNav({ groups }: { groups: MenuGroup[] }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleGroup = (label: string) => {
    setCollapsed(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="space-y-6">
      {groups.map((group) => {
        const isCollapsed = collapsed[group.label] ?? false;
        const hasActiveItem = group.items.some(item => pathname === item.href);

        return (
          <div key={group.label}>
            <button
              onClick={() => toggleGroup(group.label)}
              className="flex items-center justify-between w-full px-4 mb-3 group cursor-pointer"
            >
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] group-hover:text-slate-400 transition-colors">
                {group.label}
              </p>
              <ChevronDown className={cn(
                "h-3.5 w-3.5 text-slate-600 transition-transform duration-200",
                isCollapsed && "-rotate-90"
              )} />
            </button>

            {!isCollapsed && (
              <nav className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = iconMap[item.icon] || LayoutDashboard;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "group flex items-center justify-between rounded-2xl px-4 py-2.5 text-sm font-bold transition-all duration-200",
                        isActive
                          ? "bg-blue-600/10 text-blue-400 ring-1 ring-blue-500/20 shadow-lg shadow-blue-900/10"
                          : "text-slate-400 hover:bg-slate-900 hover:text-white"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={cn(
                          "h-4.5 w-4.5 transition-colors",
                          isActive ? "text-blue-400" : "text-slate-500 group-hover:text-white"
                        )} />
                        {item.name}
                      </div>
                      {isActive && <ChevronRight className="h-4 w-4" />}
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>
        );
      })}
    </div>
  );
}
