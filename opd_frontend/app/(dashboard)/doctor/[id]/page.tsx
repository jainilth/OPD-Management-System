"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GetDoctorById } from "@/app/service/doctor.service";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ArrowLeft, UserRound, Stethoscope, Phone, IndianRupee, Building2 } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function DoctorDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  const fetchDoctor = async () => {
    try {
      const data = await GetDoctorById(Number(id));
      if (data.error) throw new Error(data.error);
      setDoctor(data);
    } catch (err: any) {
      setError(err.message || "Failed to load doctor details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>;
  if (error) return <div className="text-center p-20 text-red-500 font-bold">{error}</div>;
  if (!doctor) return <div className="text-center p-20 text-slate-500">Doctor not found.</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-black text-slate-900">Dr. {doctor.DoctorName}</h1>
          <p className="text-sm font-medium text-slate-500 tracking-wide uppercase">Doctor Profile • ID: {doctor.DoctorID}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-none shadow-lg shadow-slate-200/50 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <UserRound className="w-32 h-32" />
          </div>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-700 flex items-center gap-2">
              <UserRound className="h-5 w-5 text-purple-500" /> Professional Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Doctor Name</p>
              <p className="text-xl font-black text-slate-800 mt-1 pl-1 border-l-2 border-purple-500">Dr. {doctor.DoctorName}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Department</p>
              <div className="flex items-center gap-2 mt-1">
                <Stethoscope className="h-4 w-4 text-slate-400" />
                <p className="text-md font-bold text-slate-700">{doctor.department?.DepartmentName || "N/A"}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Consultation Fee</p>
              <div className="flex items-center gap-2 mt-1">
                <IndianRupee className="h-4 w-4 text-emerald-500" />
                <p className="text-2xl font-black text-emerald-600">{doctor.ConsultationFee}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg shadow-slate-200/50">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-700 flex items-center gap-2">
              <Phone className="h-5 w-5 text-rose-500" /> Contact & Affiliation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mobile</p>
                <p className="text-lg font-bold text-slate-800 mt-1">{doctor.Mobile || "Not provided"}</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                <Building2 className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hospital Affiliation</p>
                <p className="text-md font-bold text-slate-700 mt-1">{doctor.hospital?.HospitalName || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
