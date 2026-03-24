"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Modal } from "@/components/ui/Modal";
import { GetAllDoctors, CreateDoctor, UpdateDoctor, DeleteDoctor } from "@/app/service/doctor.service";
import { GetAllDepartments } from "@/app/service/master.service";
import { GetAllHospitals } from "@/app/service/hospital.service";

export default function DoctorPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [formData, setFormData] = useState({ DoctorName: "", DepartmentID: "", ConsultationFee: "", HospitalID: "", Mobile: "" });

  const fetchData = async () => {
    setLoading(true);
    const [docData, deptData, hospData] = await Promise.all([GetAllDoctors(), GetAllDepartments(), GetAllHospitals()]);
    if (!docData?.error) setDoctors(Array.isArray(docData) ? docData : []);
    if (!deptData?.error) setDepartments(Array.isArray(deptData) ? deptData : []);
    if (!hospData?.error) setHospitals(Array.isArray(hospData) ? hospData : []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenModal = (doc?: any) => {
    if (doc) {
      setEditing(doc);
      setFormData({ DoctorName: doc.DoctorName, DepartmentID: String(doc.DepartmentID), ConsultationFee: String(doc.ConsultationFee), HospitalID: String(doc.HospitalID || ""), Mobile: doc.Mobile || "" });
    } else {
      setEditing(null);
      setFormData({ DoctorName: "", DepartmentID: "", ConsultationFee: "", HospitalID: "", Mobile: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData, DepartmentID: parseInt(formData.DepartmentID), ConsultationFee: parseFloat(formData.ConsultationFee), HospitalID: formData.HospitalID ? parseInt(formData.HospitalID) : undefined };
    if (editing) { await UpdateDoctor(editing.DoctorID, payload); } else { await CreateDoctor(payload); }
    setIsModalOpen(false);
    fetchData();
  };

  const handleDelete = async (id: number) => { if (confirm("Are you sure?")) { await DeleteDoctor(id); fetchData(); } };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-slate-800">Doctor Master</h1><p className="text-slate-500">Manage doctor profiles</p></div>
        <Button onClick={() => handleOpenModal()} className="gap-2"><Plus className="h-4 w-4" /> Add Doctor</Button>
      </div>
      <Card><CardContent className="pt-6">
        <Table><TableHeader><TableRow>
          <TableHead>Name</TableHead><TableHead>Department</TableHead><TableHead>Fee</TableHead><TableHead>Mobile</TableHead><TableHead className="text-right">Actions</TableHead>
        </TableRow></TableHeader><TableBody>
          {loading ? (<TableRow><TableCell colSpan={5} className="text-center py-10">Loading...</TableCell></TableRow>) : doctors.length === 0 ? (<TableRow><TableCell colSpan={5} className="text-center py-10 text-slate-500">No doctors found.</TableCell></TableRow>) : (
            doctors.map((d) => (<TableRow key={d.DoctorID}>
              <TableCell className="font-bold">{d.DoctorName}</TableCell>
              <TableCell>{d.department?.DepartmentName || "-"}</TableCell>
              <TableCell>₹{d.ConsultationFee}</TableCell>
              <TableCell>{d.Mobile || "-"}</TableCell>
              <TableCell className="text-right space-x-1">
                <Link href={`/doctor/${d.DoctorID}`}>
                  <Button variant="ghost" size="icon" title="View Details"><Eye className="h-4 w-4 text-blue-500" /></Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => handleOpenModal(d)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(d.DoctorID)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
              </TableCell>
            </TableRow>))
          )}
        </TableBody></Table>
      </CardContent></Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? "Edit Doctor" : "Add Doctor"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Doctor Name" value={formData.DoctorName} onChange={(e) => setFormData({ ...formData, DoctorName: e.target.value })} required />
          <div className="space-y-1.5"><label className="text-sm font-semibold text-slate-700">Department</label>
            <select className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.DepartmentID} onChange={(e) => setFormData({ ...formData, DepartmentID: e.target.value })} required>
              <option value="">Select Department</option>
              {departments.map((d: any) => (<option key={d.DepartmentID} value={d.DepartmentID}>{d.DepartmentName}</option>))}
            </select>
          </div>
          <Input label="Consultation Fee" type="number" value={formData.ConsultationFee} onChange={(e) => setFormData({ ...formData, ConsultationFee: e.target.value })} required />
          <div className="space-y-1.5"><label className="text-sm font-semibold text-slate-700">Hospital</label>
            <select className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.HospitalID} onChange={(e) => setFormData({ ...formData, HospitalID: e.target.value })}>
              <option value="">Select Hospital</option>
              {hospitals.map((h: any) => (<option key={h.HospitalID} value={h.HospitalID}>{h.HospitalName}</option>))}
            </select>
          </div>
          <Input label="Mobile" value={formData.Mobile} onChange={(e) => setFormData({ ...formData, Mobile: e.target.value })} />
          <div className="flex justify-end gap-3"><Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button><Button type="submit">{editing ? "Update" : "Create"}</Button></div>
        </form>
      </Modal>
    </div>
  );
}
