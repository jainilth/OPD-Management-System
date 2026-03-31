"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Modal } from "@/components/ui/Modal";
import { GetAllPatients, CreatePatient, UpdatePatient, DeletePatient } from "@/app/service/patient.service";

export default function PatientPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [formData, setFormData] = useState({ FullName: "", DOB: "", Gender: "Male", Mobile: "", Address: "", Username: "", Password: "" });

  const fetchData = async () => { setLoading(true); const data = await GetAllPatients(); if (!data?.error) setPatients(Array.isArray(data) ? data : []); setLoading(false); };
  useEffect(() => { fetchData(); }, []);

  const filtered = patients.filter((p) =>
    p.FullName?.toLowerCase().includes(search.toLowerCase()) || p.Mobile?.includes(search)
  );

  const handleOpenModal = (patient?: any) => {
    if (patient) { setEditing(patient); setFormData({ FullName: patient.FullName, DOB: patient.DOB?.split("T")[0] || "", Gender: patient.Gender, Mobile: patient.Mobile, Address: patient.Address, Username: "", Password: "" }); }
    else { setEditing(null); setFormData({ FullName: "", DOB: "", Gender: "Male", Mobile: "", Address: "", Username: "", Password: "" }); }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    const payload: any = { ...formData };

    if (editing) {
      delete payload.Username;
      delete payload.Password;
    }

    const result = editing
      ? await UpdatePatient(editing.PatientID, payload)
      : await CreatePatient(payload);

    if (result?.error) {
      setFeedback({ type: "error", message: result.error });
      return;
    }

    setFeedback({
      type: "success",
      message: result?.message || (editing ? "Patient updated successfully" : "Patient created successfully"),
    });

    setIsModalOpen(false);
    fetchData();
  };

  const handleDelete = async (id: number) => { if (confirm("Are you sure?")) { await DeletePatient(id); fetchData(); } };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-slate-800">Patient Registration</h1><p className="text-slate-500">Manage patient records</p></div>
        <Button onClick={() => handleOpenModal()} className="gap-2"><Plus className="h-4 w-4" /> New Patient</Button>
      </div>
      {feedback && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {feedback.message}
        </div>
      )}
      <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><input className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search by name or mobile..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
      <Card><CardContent className="pt-6">
        <Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>DOB</TableHead><TableHead>Gender</TableHead><TableHead>Mobile</TableHead><TableHead>Address</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {loading ? (<TableRow><TableCell colSpan={6} className="text-center py-10">Loading...</TableCell></TableRow>) : filtered.length === 0 ? (<TableRow><TableCell colSpan={6} className="text-center py-10 text-slate-500">No patients found.</TableCell></TableRow>) : (
              filtered.map((p) => (<TableRow key={p.PatientID}><TableCell className="font-bold">{p.FullName}</TableCell><TableCell>{p.DOB?.split("T")[0]}</TableCell><TableCell>{p.Gender}</TableCell><TableCell>{p.Mobile}</TableCell><TableCell>{p.Address}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Link href={`/patient/${p.PatientID}`}>
                    <Button variant="ghost" size="icon" title="View Details"><Eye className="h-4 w-4 text-blue-500" /></Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => handleOpenModal(p)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(p.PatientID)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </TableCell></TableRow>))
            )}
          </TableBody>
        </Table>
      </CardContent></Card>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? "Edit Patient" : "New Patient"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!editing && <p className="text-xs text-slate-500">System checks by mobile number. Existing user is reused automatically; if not found, a new user is created using Username and Password.</p>}
          <Input label="Full Name" value={formData.FullName} onChange={(e) => setFormData({ ...formData, FullName: e.target.value })} required />
          <Input label="Date of Birth" type="date" value={formData.DOB} onChange={(e) => setFormData({ ...formData, DOB: e.target.value })} required />
          <div className="space-y-1.5"><label className="text-sm font-semibold text-slate-700">Gender</label>
            <select className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.Gender} onChange={(e) => setFormData({ ...formData, Gender: e.target.value })} required>
              <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
            </select>
          </div>
          <Input label="Mobile" value={formData.Mobile} onChange={(e) => setFormData({ ...formData, Mobile: e.target.value })} required />
          <Input label="Address" value={formData.Address} onChange={(e) => setFormData({ ...formData, Address: e.target.value })} required />
          {!editing && (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
              <Input label="Username (required only if mobile is new)" value={formData.Username} onChange={(e) => setFormData({ ...formData, Username: e.target.value })} />
              <Input type="password" label="Password (required only if mobile is new)" value={formData.Password} onChange={(e) => setFormData({ ...formData, Password: e.target.value })} />
            </div>
          )}
          <div className="flex justify-end gap-3"><Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button><Button type="submit">{editing ? "Update" : "Register"}</Button></div>
        </form>
      </Modal>
    </div>
  );
}
