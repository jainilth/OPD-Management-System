"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Hospital,
  UserRound,
  Stethoscope,
  Layers,
  ListTree,
  LucideIcon
} from "lucide-react";

const masterTabs: { name: string; href: string; icon: LucideIcon }[] = [
  { name: "Hospital", href: "/hospital", icon: Hospital },
  { name: "Doctor", href: "/doctor", icon: UserRound },
  { name: "Diagnosis Type", href: "/diagnosis-type", icon: Stethoscope },
  { name: "Treatment Type", href: "/treatment-type", icon: Layers },
  { name: "Sub Treatment", href: "/sub-treatment-type", icon: ListTree },
];

export default function MasterNav() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl mb-6 overflow-x-auto">
      {masterTabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200",
              isActive
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
}
