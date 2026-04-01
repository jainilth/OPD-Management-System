"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Users,
    Stethoscope,
    CalendarCheck,
    TrendingUp,
    ReceiptIndianRupee,
    Hospital,
    UserRound,
    Layers,
    ListTree,
    ArrowRight,
    Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { GetAllPatients } from "@/app/service/patient.service";
import { GetAllDoctors } from "@/app/service/doctor.service";
import { GetAllOPDVisits } from "@/app/service/opdvisit.service";
import { GetAllInvoices } from "@/app/service/invoice.service";

type Role = "Admin" | "Doctor" | "Patient" | "Receptionist" | "User";

interface DashboardHomeProps {
    role: Role;
    username: string;
}

interface MasterScreen {
    name: string;
    description: string;
    href: string;
    icon: any;
    color: string;
    roles: Role[];
}

const masterScreens: MasterScreen[] = [
    {
        name: "Hospital",
        description: "Manage hospital profiles & charges",
        href: "/hospital",
        icon: Hospital,
        color: "from-blue-500 to-blue-600",
        roles: ["Admin"],
    },
    {
        name: "Doctor",
        description: "Manage doctor profiles & fees",
        href: "/doctor",
        icon: UserRound,
        color: "from-indigo-500 to-indigo-600",
        roles: ["Admin", "Doctor", "Receptionist", "Patient", "User"],
    },
    {
        name: "Diagnosis Type",
        description: "Manage diagnosis & ICD codes",
        href: "/diagnosis-type",
        icon: Stethoscope,
        color: "from-purple-500 to-purple-600",
        roles: ["Admin", "Doctor", "Receptionist", "User"],
    },
    {
        name: "Treatment Type",
        description: "Manage treatment categories",
        href: "/treatment-type",
        icon: Layers,
        color: "from-teal-500 to-teal-600",
        roles: ["Admin", "Doctor", "Receptionist"],
    },
    {
        name: "Sub Treatment",
        description: "Manage billable services & rates",
        href: "/sub-treatment-type",
        icon: ListTree,
        color: "from-cyan-500 to-cyan-600",
        roles: ["Admin", "Doctor", "Receptionist"],
    },
];

const quickActionsByRole: Record<Role, Array<{ label: string; href: string; icon: any; tone: string }>> = {
    Admin: [
        { label: "Book Appointment", href: "/appointment", icon: CalendarCheck, tone: "bg-teal-500/20 text-teal-400" },
        { label: "Register New Patient", href: "/patient", icon: Users, tone: "bg-blue-500/20 text-blue-400" },
        { label: "New OPD Entry", href: "/opd", icon: CalendarCheck, tone: "bg-green-500/20 text-green-400" },
        { label: "Generate Bill", href: "/receipt", icon: ReceiptIndianRupee, tone: "bg-amber-500/20 text-amber-400" },
    ],
    Doctor: [
        { label: "Open OPD Queue", href: "/opd", icon: CalendarCheck, tone: "bg-green-500/20 text-green-400" },
        { label: "View Patients", href: "/patient", icon: Users, tone: "bg-blue-500/20 text-blue-400" },
    ],
    Receptionist: [
        { label: "Book Appointment", href: "/appointment", icon: CalendarCheck, tone: "bg-teal-500/20 text-teal-400" },
        { label: "Register New Patient", href: "/patient", icon: Users, tone: "bg-blue-500/20 text-blue-400" },
        { label: "Create OPD Entry", href: "/opd", icon: CalendarCheck, tone: "bg-green-500/20 text-green-400" },
        { label: "Receipt Entry", href: "/receipt", icon: ReceiptIndianRupee, tone: "bg-amber-500/20 text-amber-400" },
    ],
    Patient: [
        { label: "Book Appointment", href: "/appointment", icon: CalendarCheck, tone: "bg-teal-500/20 text-teal-400" },
        { label: "My Receipts", href: "/receipt", icon: ReceiptIndianRupee, tone: "bg-amber-500/20 text-amber-400" },
        { label: "Find Doctors", href: "/doctor", icon: Stethoscope, tone: "bg-indigo-500/20 text-indigo-400" },
    ],
    User: [
        { label: "My Receipts", href: "/receipt", icon: ReceiptIndianRupee, tone: "bg-amber-500/20 text-amber-400" },
        { label: "Browse Doctors", href: "/doctor", icon: Stethoscope, tone: "bg-indigo-500/20 text-indigo-400" },
    ],
};

export default function DashboardHome({ role, username }: DashboardHomeProps) {
    const [loading, setLoading] = useState(true);
    const [totalPatients, setTotalPatients] = useState(0);
    const [totalDoctors, setTotalDoctors] = useState(0);
    const [todayVisits, setTodayVisits] = useState(0);
    const [dailyRevenue, setDailyRevenue] = useState(0);
    const [recentVisits, setRecentVisits] = useState<any[]>([]);

    const showOperationalStats = role === "Admin" || role === "Doctor" || role === "Receptionist";

    const visibleMasterScreens = useMemo(
        () => masterScreens.filter((screen) => screen.roles.includes(role)),
        [role]
    );

    useEffect(() => {
        async function fetchDashboardData() {
            if (!showOperationalStats) {
                setLoading(false);
                return;
            }

            setLoading(true);
            const [patientsRes, doctorsRes, visitsRes, invoicesRes] = await Promise.all([
                GetAllPatients(),
                GetAllDoctors(),
                GetAllOPDVisits(),
                GetAllInvoices(),
            ]);

            const patients = Array.isArray(patientsRes) ? patientsRes : [];
            const doctors = Array.isArray(doctorsRes) ? doctorsRes : [];
            const visits = Array.isArray(visitsRes) ? visitsRes : [];
            const invoices = Array.isArray(invoicesRes) ? invoicesRes : [];

            setTotalPatients(patients.length);
            setTotalDoctors(doctors.length);

            const today = new Date().toISOString().split("T")[0];
            const todayV = visits.filter((v: any) => v.VisitDateTime?.startsWith(today));
            setTodayVisits(todayV.length);

            const todayInv = invoices.filter((inv: any) => inv.InvoiceDate?.startsWith(today));
            const rev = todayInv.reduce((sum: number, inv: any) => sum + (inv.TotalAmount || 0), 0);
            setDailyRevenue(rev);

            const sorted = [...visits].sort(
                (a, b) => new Date(b.VisitDateTime).getTime() - new Date(a.VisitDateTime).getTime()
            );
            setRecentVisits(sorted.slice(0, 5));

            setLoading(false);
        }

        fetchDashboardData();
    }, [showOperationalStats]);

    const stats = [
        {
            name: "Total Patients",
            value: loading ? "..." : totalPatients.toLocaleString(),
            icon: Users,
            iconColor: "text-blue-600",
            bg: "bg-blue-100",
        },
        {
            name: "Today's Visits",
            value: loading ? "..." : String(todayVisits),
            icon: CalendarCheck,
            iconColor: "text-green-600",
            bg: "bg-green-100",
        },
        {
            name: "Active Doctors",
            value: loading ? "..." : String(totalDoctors),
            icon: Stethoscope,
            iconColor: "text-purple-600",
            bg: "bg-purple-100",
        },
        {
            name: "Today's Revenue",
            value: loading ? "..." : formatCurrency(dailyRevenue),
            icon: TrendingUp,
            iconColor: "text-orange-600",
            bg: "bg-orange-100",
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">{role} Dashboard</h1>
                <p className="text-slate-500 text-lg">Welcome back, {username}.</p>
            </div>

            {showOperationalStats && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <Card key={stat.name} className="hover:shadow-lg transition-all cursor-default group border-none bg-white shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.name}</p>
                                        <p className="mt-1 text-3xl font-black text-slate-900">{stat.value}</p>
                                    </div>
                                    <div className={cn("p-4 rounded-2xl group-hover:rotate-6 transition-transform", stat.bg)}>
                                        <stat.icon className={cn("h-6 w-6", stat.iconColor)} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {visibleMasterScreens.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Master Data</h2>
                            <p className="text-sm text-slate-400">Role-allowed reference modules</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {visibleMasterScreens.map((screen) => (
                            <Link key={screen.href} href={screen.href} className="group block">
                                <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 overflow-hidden h-full">
                                    <CardContent className="p-5">
                                        <div className={cn("h-11 w-11 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg", screen.color)}>
                                            <screen.icon className="h-5 w-5 text-white" />
                                        </div>
                                        <h3 className="font-bold text-slate-800 text-sm">{screen.name}</h3>
                                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{screen.description}</p>
                                        <div className="mt-3 flex items-center gap-1 text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                            Open <ArrowRight className="h-3 w-3" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {showOperationalStats && (
                    <Card className="lg:col-span-2 border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Recent OPD Visits</CardTitle>
                                <p className="text-sm text-slate-400 mt-1">Latest patient visits</p>
                            </div>
                            <Link href="/opd">
                                <Button variant="outline" size="sm" className="rounded-full px-4">View All</Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {loading ? (
                                    <div className="flex items-center justify-center py-10 text-slate-400">
                                        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading...
                                    </div>
                                ) : recentVisits.length === 0 ? (
                                    <p className="text-center py-10 text-slate-400">No visits recorded yet.</p>
                                ) : (
                                    recentVisits.map((v) => (
                                        <div key={v.OPDID} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:bg-slate-50/50 transition-all hover:translate-x-1">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-xl">
                                                    {v.patient?.FullName?.[0]?.toUpperCase() || "?"}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{v.patient?.FullName || "Unknown"}</p>
                                                    <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">
                                                        OPD-{v.OPDNo || v.OPDID} • {v.doctor?.DoctorName || "Unassigned"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-black text-slate-700">{formatDate(v.VisitDateTime)}</p>
                                                <span
                                                    className={cn(
                                                        "text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter",
                                                        v.VisitType === "New" ? "text-green-600 bg-green-50" : "text-blue-600 bg-blue-50"
                                                    )}
                                                >
                                                    {v.VisitType}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card className="border-none shadow-sm bg-slate-900 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 -m-8 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />
                    <CardHeader>
                        <CardTitle className="text-white">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 relative z-10">
                        {quickActionsByRole[role].map((action) => (
                            <Link key={action.href + action.label} href={action.href} className="block">
                                <Button className="w-full justify-start gap-4 h-14 bg-white/10 hover:bg-white/20 border-white/5 backdrop-blur-md rounded-2xl transition-all hover:scale-[1.02]">
                                    <div className={cn("p-2 rounded-xl", action.tone)}>
                                        <action.icon className="h-5 w-5" />
                                    </div>
                                    <span className="font-bold">{action.label}</span>
                                </Button>
                            </Link>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
