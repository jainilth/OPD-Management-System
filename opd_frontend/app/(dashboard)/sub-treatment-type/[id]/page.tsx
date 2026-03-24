"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GetServiceById } from "@/app/service/opd.service";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ArrowLeft, Stethoscope, IndianRupee, Tag } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function SubTreatmentTypeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [serviceData, setServiceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      const data = await GetServiceById(Number(id));
      if (data.error) throw new Error(data.error);
      setServiceData(data);
    } catch (err: any) {
      setError(err.message || "Failed to load service details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>;
  if (error) return <div className="text-center p-20 text-red-500 font-bold">{error}</div>;
  if (!serviceData) return <div className="text-center p-20 text-slate-500">Service not found.</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-black text-slate-900">{serviceData.ServiceName}</h1>
          <p className="text-sm font-medium text-slate-500 tracking-wide uppercase">Sub Treatment (Service) • ID: {serviceData.ServiceID}</p>
        </div>
      </div>

      <Card className="border-none shadow-lg shadow-slate-200/50 overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <Stethoscope className="w-48 h-48" />
        </div>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-700 flex items-center gap-2">
            <Tag className="h-5 w-5 text-teal-500" /> Service Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Service Name</p>
              <p className="text-xl font-black text-slate-800 mt-1 pl-1 border-l-2 border-teal-500">{serviceData.ServiceName}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Parent Treatment Category</p>
              <p className="text-lg font-bold text-slate-700 mt-1 pl-1 border-l-2 border-slate-300">
                {serviceData.treatmenttype?.TreatmentTypeName || "Uncategorized"}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Rate / Cost</p>
              <div className="flex items-center gap-2 mt-1">
                <IndianRupee className="h-4 w-4 text-emerald-500" />
                <p className="text-3xl font-black text-emerald-600 tracking-tighter">{serviceData.Rate}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
