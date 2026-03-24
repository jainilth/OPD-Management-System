"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GetDiagnosisTypeById } from "@/app/service/master.service";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ArrowLeft, Stethoscope, FileText } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function DiagnosisTypeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [diagnosis, setDiagnosis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDiagnosis();
  }, [id]);

  const fetchDiagnosis = async () => {
    try {
      const data = await GetDiagnosisTypeById(Number(id));
      if (data.error) throw new Error(data.error);
      setDiagnosis(data);
    } catch (err: any) {
      setError(err.message || "Failed to load diagnosis details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>;
  if (error) return <div className="text-center p-20 text-red-500 font-bold">{error}</div>;
  if (!diagnosis) return <div className="text-center p-20 text-slate-500">Diagnosis Type not found.</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-black text-slate-900">{diagnosis.DiagnosisName}</h1>
          <p className="text-sm font-medium text-slate-500 tracking-wide uppercase">Diagnosis Type • ID: {diagnosis.DiagnosisID}</p>
        </div>
      </div>

      <Card className="border-none shadow-lg shadow-slate-200/50 overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <Stethoscope className="w-48 h-48" />
        </div>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-700 flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-indigo-500" /> Diagnosis Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Diagnosis Name</p>
              <p className="text-xl font-black text-slate-800 mt-1 pl-1 border-l-2 border-indigo-500">{diagnosis.DiagnosisName}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">ICD Code</p>
              <div className="flex items-center gap-2 mt-1">
                <FileText className="h-4 w-4 text-emerald-500" />
                <p className="text-xl font-black text-emerald-600 font-mono tracking-widest bg-emerald-50 px-3 py-1 rounded-lg">
                  {diagnosis.ICDCode || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
