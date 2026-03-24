"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GetTreatmentTypeById } from "@/app/service/opd.service";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ArrowLeft, Activity } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function TreatmentTypeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [treatment, setTreatment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTreatment();
  }, [id]);

  const fetchTreatment = async () => {
    try {
      const data = await GetTreatmentTypeById(Number(id));
      if (data.error) throw new Error(data.error);
      setTreatment(data);
    } catch (err: any) {
      setError(err.message || "Failed to load treatment details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>;
  if (error) return <div className="text-center p-20 text-red-500 font-bold">{error}</div>;
  if (!treatment) return <div className="text-center p-20 text-slate-500">Treatment Type not found.</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-black text-slate-900">{treatment.TreatmentTypeName}</h1>
          <p className="text-sm font-medium text-slate-500 tracking-wide uppercase">Treatment Category • ID: {treatment.TreatmentTypeID}</p>
        </div>
      </div>

      <Card className="border-none shadow-lg shadow-slate-200/50 overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <Activity className="w-48 h-48" />
        </div>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-700 flex items-center gap-2">
            <Activity className="h-5 w-5 text-orange-500" /> Treatment Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 relative z-10">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Category Name</p>
            <p className="text-xl font-black text-slate-800 mt-1 pl-1 border-l-2 border-orange-500">{treatment.TreatmentTypeName}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
