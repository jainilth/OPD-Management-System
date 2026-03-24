"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Modal } from "@/components/ui/Modal";
import { GetAllServices, CreateService, UpdateService, DeleteService, GetAllTreatmentTypes } from "@/app/service/opd.service";

export default function SubTreatmentTypePage() {
  const [items, setItems] = useState<any[]>([]);
  const [treatmentTypes, setTreatmentTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [formData, setFormData] = useState({ ServiceName: "", TreatmentTypeID: "", Rate: "" });

  const fetchData = async () => {
    setLoading(true);
    const [servData, ttData] = await Promise.all([GetAllServices(), GetAllTreatmentTypes()]);
    if (!servData?.error) setItems(Array.isArray(servData) ? servData : []);
    if (!ttData?.error) setTreatmentTypes(Array.isArray(ttData) ? ttData : []);
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);

  const handleOpenModal = (item?: any) => {
    if (item) { setEditing(item); setFormData({ ServiceName: item.ServiceName, TreatmentTypeID: String(item.TreatmentTypeID), Rate: String(item.Rate) }); }
    else { setEditing(null); setFormData({ ServiceName: "", TreatmentTypeID: "", Rate: "" }); }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ServiceName: formData.ServiceName, TreatmentTypeID: parseInt(formData.TreatmentTypeID), Rate: parseFloat(formData.Rate) };
    if (editing) { await UpdateService(editing.ServiceID, payload); } else { await CreateService(payload); }
    setIsModalOpen(false); fetchData();
  };

  const handleDelete = async (id: number) => { if (confirm("Are you sure?")) { await DeleteService(id); fetchData(); } };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-slate-800">Sub Treatment Type</h1><p className="text-slate-500">Manage billable services</p></div>
        <Button onClick={() => handleOpenModal()} className="gap-2"><Plus className="h-4 w-4" /> Add Service</Button>
      </div>
      <Card><CardContent className="pt-6">
        <Table><TableHeader><TableRow><TableHead>Service Name</TableHead><TableHead>Treatment Type</TableHead><TableHead>Rate</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {loading ? (<TableRow><TableCell colSpan={4} className="text-center py-10">Loading...</TableCell></TableRow>) : items.length === 0 ? (<TableRow><TableCell colSpan={4} className="text-center py-10 text-slate-500">No records found.</TableCell></TableRow>) : (
              items.map((s) => (<TableRow key={s.ServiceID}><TableCell className="font-bold">{s.ServiceName}</TableCell><TableCell>{s.treatmenttype?.TreatmentTypeName || "-"}</TableCell><TableCell>₹{s.Rate}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Link href={`/sub-treatment-type/${s.ServiceID}`}>
                    <Button variant="ghost" size="icon" title="View Details"><Eye className="h-4 w-4 text-blue-500" /></Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => handleOpenModal(s)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(s.ServiceID)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </TableCell></TableRow>))
            )}
          </TableBody>
        </Table>
      </CardContent></Card>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? "Edit Service" : "Add Service"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Service Name" value={formData.ServiceName} onChange={(e) => setFormData({ ...formData, ServiceName: e.target.value })} required />
          <div className="space-y-1.5"><label className="text-sm font-semibold text-slate-700">Treatment Type</label>
            <select className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.TreatmentTypeID} onChange={(e) => setFormData({ ...formData, TreatmentTypeID: e.target.value })} required>
              <option value="">Select Treatment Type</option>
              {treatmentTypes.map((t: any) => (<option key={t.TreatmentTypeID} value={t.TreatmentTypeID}>{t.TreatmentTypeName}</option>))}
            </select>
          </div>
          <Input label="Rate" type="number" value={formData.Rate} onChange={(e) => setFormData({ ...formData, Rate: e.target.value })} required />
          <div className="flex justify-end gap-3"><Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button><Button type="submit">{editing ? "Update" : "Create"}</Button></div>
        </form>
      </Modal>
    </div>
  );
}
