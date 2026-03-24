"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Modal } from "@/components/ui/Modal";
import { GetAllDiagnosisTypes, CreateDiagnosisType, UpdateDiagnosisType, DeleteDiagnosisType } from "@/app/service/opd.service";

export default function DiagnosisTypePage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [formData, setFormData] = useState({ DiagnosisName: "", ICDCode: "" });

  const fetchData = async () => { setLoading(true); const data = await GetAllDiagnosisTypes(); if (!data?.error) setItems(Array.isArray(data) ? data : []); setLoading(false); };
  useEffect(() => { fetchData(); }, []);

  const handleOpenModal = (item?: any) => {
    if (item) { setEditing(item); setFormData({ DiagnosisName: item.DiagnosisName, ICDCode: item.ICDCode }); }
    else { setEditing(null); setFormData({ DiagnosisName: "", ICDCode: "" }); }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) { await UpdateDiagnosisType(editing.DiagnosisID, formData); } else { await CreateDiagnosisType(formData); }
    setIsModalOpen(false); fetchData();
  };

  const handleDelete = async (id: number) => { if (confirm("Are you sure?")) { await DeleteDiagnosisType(id); fetchData(); } };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-slate-800">Diagnosis Type</h1><p className="text-slate-500">Manage diagnosis types</p></div>
        <Button onClick={() => handleOpenModal()} className="gap-2"><Plus className="h-4 w-4" /> Add Diagnosis</Button>
      </div>
      <Card><CardContent className="pt-6">
        <Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>ICD Code</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {loading ? (<TableRow><TableCell colSpan={3} className="text-center py-10">Loading...</TableCell></TableRow>) : items.length === 0 ? (<TableRow><TableCell colSpan={3} className="text-center py-10 text-slate-500">No records found.</TableCell></TableRow>) : (
              items.map((d) => (<TableRow key={d.DiagnosisID}><TableCell className="font-bold">{d.DiagnosisName}</TableCell><TableCell>{d.ICDCode}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Link href={`/diagnosis-type/${d.DiagnosisID}`}>
                    <Button variant="ghost" size="icon" title="View Details"><Eye className="h-4 w-4 text-blue-500" /></Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => handleOpenModal(d)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(d.DiagnosisID)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </TableCell></TableRow>))
            )}
          </TableBody>
        </Table>
      </CardContent></Card>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? "Edit Diagnosis" : "Add Diagnosis"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Diagnosis Name" value={formData.DiagnosisName} onChange={(e) => setFormData({ ...formData, DiagnosisName: e.target.value })} required />
          <Input label="ICD Code" value={formData.ICDCode} onChange={(e) => setFormData({ ...formData, ICDCode: e.target.value })} required />
          <div className="flex justify-end gap-3"><Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button><Button type="submit">{editing ? "Update" : "Create"}</Button></div>
        </form>
      </Modal>
    </div>
  );
}
