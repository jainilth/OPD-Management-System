"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GetOPDVisitById } from "@/app/service/opd.service";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ArrowLeft, FileText, User, UserRound, Calendar, IndianRupee, Stethoscope } from "lucide-react";
import { Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function OPDDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [visit, setVisit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchVisit();
  }, [id]);

  const fetchVisit = async () => {
    try {
      const data = await GetOPDVisitById(Number(id));
      if (data.error) throw new Error(data.error);
      setVisit(data);
    } catch (err: any) {
      setError(err.message || "Failed to load OPD visit details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>;
  if (error) return <div className="text-center p-20 text-red-500 font-bold">{error}</div>;
  if (!visit) return <div className="text-center p-20 text-slate-500">OPD Visit not found.</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-black text-slate-900">OPD-{visit.OPDNo || visit.OPDID}</h1>
          <p className="text-sm font-medium text-slate-500 tracking-wide uppercase">OPD Visit Record</p>
        </div>
        <div className="ml-auto flex gap-2">
          <span className={`px-4 py-2 rounded-full text-sm font-bold ${visit.VisitType === "New" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
            {visit.VisitType} Visit
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-none shadow-lg shadow-slate-200/50">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-700 flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-500" /> Visit Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Date & Time</p>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-slate-400" />
                <p className="text-md font-bold text-slate-700">{formatDate(visit.VisitDateTime)}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Registration Fee</p>
              <div className="flex items-center gap-2 mt-1">
                <IndianRupee className="h-4 w-4 text-emerald-500" />
                <p className="text-2xl font-black text-emerald-600">{visit.RegistrationFee}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg shadow-slate-200/50 p-6 flex flex-col justify-center space-y-6 bg-gradient-to-br from-slate-50 to-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Patient</p>
              <p className="text-lg font-bold text-slate-800">{visit.patient?.FullName || "N/A"}</p>
              <p className="text-xs text-slate-500">Reg No: {visit.patient?.PatientNo}</p>
            </div>
          </div>
          <hr className="border-slate-200" />
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
              <UserRound className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Consulting Doctor</p>
              <p className="text-lg font-bold text-slate-800">Dr. {visit.doctor?.DoctorName || "N/A"}</p>
              <p className="text-xs text-slate-500">{visit.doctor?.department?.DepartmentName}</p>
            </div>
          </div>
        </Card>

        {visit.opddiagnosis && visit.opddiagnosis.length > 0 && (
          <Card className="border-none shadow-lg shadow-slate-200/50 md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-700 flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-rose-500" /> Diagnoses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {visit.opddiagnosis.map((od: any) => (
                  <span key={od.OPDDiagnosisID} className="px-3 py-1.5 bg-rose-50 border border-rose-100 text-rose-700 rounded-lg text-sm font-bold shadow-sm">
                    {od.diagnosis?.DiagnosisName} {od.diagnosis?.ICDCode ? `(${od.diagnosis.ICDCode})` : ""}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
