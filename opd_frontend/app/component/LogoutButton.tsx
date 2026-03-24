"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LogoutButton() {
    const router = useRouter();

    async function handleLogout() {
        await fetch("/api/logout", {
            method: "POST",
        });

        router.push("/login");
        router.refresh();
    }

    return (
        <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full mt-4 justify-start gap-3 rounded-2xl text-red-400 hover:bg-red-500/10 hover:text-red-400 font-bold"
        >
            <LogOut className="h-5 w-5" /> Sign Out
        </Button>
    );
}
