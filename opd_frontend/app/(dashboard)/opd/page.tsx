"use client";

import { useEffect, useState } from "react";
import { Plus, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Modal } from "@/components/ui/Modal";
import { GetAllOPDVisits, CreateOPDVisit, CreateOPDDiagnosis, GetAllPatients, GetAllDoctors, GetAllDiagnosisTypes } from "@/app/service/opd.service";
import { formatDate } from "@/lib/utils";

export default function OPDPage() {
  const [visits, setVisits] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [diagnosisTypes, setDiagnosisTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ PatientID: "", DoctorID: "", VisitType: "New", RegistrationFee: "0", SelectedDiagnoses: [] as number[] });

  const fetchData = async () => {
    setLoading(true);
    const [vData, pData, dData, dtData] = await Promise.all([GetAllOPDVisits(), GetAllPatients(), GetAllDoctors(), GetAllDiagnosisTypes()]);
    if (!vData?.error) setVisits(Array.isArray(vData) ? vData : []);
    if (!pData?.error) setPatients(Array.isArray(pData) ? pData : []);
    if (!dData?.error) setDoctors(Array.isArray(dData) ? dData : []);
    if (!dtData?.error) setDiagnosisTypes(Array.isArray(dtData) ? dtData : []);
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);

  const toggleDiagnosis = (id: number) => {
    setFormData(prev => ({
      ...prev,
      SelectedDiagnoses: prev.SelectedDiagnoses.includes(id)
        ? prev.SelectedDiagnoses.filter(d => d !== id)
        : [...prev.SelectedDiagnoses, id]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const visitResult = await CreateOPDVisit({
      PatientID: parseInt(formData.PatientID),
      DoctorID: parseInt(formData.DoctorID),
      VisitDateTime: new Date().toISOString(),
      VisitType: formData.VisitType,
      RegistrationFee: parseFloat(formData.RegistrationFee)
    });

    const opdId = visitResult?.OPDID || visitResult?.data?.OPDID;
    if (opdId && formData.SelectedDiagnoses.length > 0) {
      await Promise.all(formData.SelectedDiagnoses.map(diagId =>
        CreateOPDDiagnosis({ OPDID: opdId, DiagnosisID: diagId })
      ));
    }
    setIsModalOpen(false);
    setFormData({ PatientID: "", DoctorID: "", VisitType: "New", RegistrationFee: "0", SelectedDiagnoses: [] });
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-slate-800">OPD Entry</h1><p className="text-slate-500">Record outpatient visits</p></div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> New OPD Entry</Button>
      </div>
      <Card><CardContent className="pt-6">
        <Table><TableHeader><TableRow><TableHead>OPD No</TableHead><TableHead>Date</TableHead><TableHead>Patient</TableHead><TableHead>Doctor</TableHead><TableHead>Visit Type</TableHead><TableHead>Fee</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {loading ? (<TableRow><TableCell colSpan={7} className="text-center py-10">Loading...</TableCell></TableRow>) : visits.length === 0 ? (<TableRow><TableCell colSpan={7} className="text-center py-10 text-slate-500">No visits recorded.</TableCell></TableRow>) : (
              visits.map((v) => (<TableRow key={v.OPDID}><TableCell className="font-mono text-xs font-bold">OPD-{v.OPDNo || v.OPDID}</TableCell><TableCell>{formatDate(v.VisitDateTime)}</TableCell><TableCell>{v.patient?.FullName || "-"}</TableCell><TableCell>{v.doctor?.DoctorName || "-"}</TableCell>
                <TableCell><span className={`px-2 py-1 rounded text-xs font-bold ${v.VisitType === "New" ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"}`}>{v.VisitType}</span></TableCell><TableCell>₹{v.RegistrationFee}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Link href={`/opd/${v.OPDID}`}>
                    <Button variant="ghost" size="icon" title="View Details"><Eye className="h-4 w-4 text-blue-500" /></Button>
                  </Link>
                </TableCell>
              </TableRow>))
            )}
          </TableBody>
        </Table>
      </CardContent></Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New OPD Entry" description="Register a new outpatient visit">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5"><label className="text-sm font-semibold text-slate-700">Patient</label>
            <select className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.PatientID} onChange={(e) => setFormData({ ...formData, PatientID: e.target.value })} required>
              <option value="">Select Patient</option>
              {patients.map((p: any) => (<option key={p.PatientID} value={p.PatientID}>{p.FullName} ({p.Mobile})</option>))}
            </select>
          </div>
          <div className="space-y-1.5"><label className="text-sm font-semibold text-slate-700">Doctor</label>
            <select className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.DoctorID} onChange={(e) => setFormData({ ...formData, DoctorID: e.target.value })} required>
              <option value="">Select Doctor</option>
              {doctors.map((d: any) => (<option key={d.DoctorID} value={d.DoctorID}>{d.DoctorName}</option>))}
            </select>
          </div>
          <div className="space-y-1.5"><label className="text-sm font-semibold text-slate-700">Visit Type</label>
            <select className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.VisitType} onChange={(e) => setFormData({ ...formData, VisitType: e.target.value })}>
              <option value="New">New</option><option value="FollowUp">Follow Up</option>
            </select>
          </div>
          <div className="space-y-1.5"><label className="text-sm font-semibold text-slate-700">Diagnoses</label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3">
              {diagnosisTypes.map((d: any) => (
                <label key={d.DiagnosisID} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-slate-50 p-1 rounded">
                  <input type="checkbox" checked={formData.SelectedDiagnoses.includes(d.DiagnosisID)} onChange={() => toggleDiagnosis(d.DiagnosisID)} className="h-4 w-4 rounded border-slate-300 text-blue-600" />
                  {d.DiagnosisName}
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3"><Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button><Button type="submit">Record Visit</Button></div>
        </form>
      </Modal>
    </div>
  );
}
