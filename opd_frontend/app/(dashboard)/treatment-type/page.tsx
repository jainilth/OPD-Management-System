"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { TableSkeletonRows } from "@/components/ui/TableSkeletonRows";
import { Modal } from "@/components/ui/Modal";
import { GetAllTreatmentTypes, CreateTreatmentType, UpdateTreatmentType, DeleteTreatmentType } from "@/app/service/master.service";
import { useRole } from "@/context/RoleContext";
import { hasRole } from "@/lib/rbac";

export default function TreatmentTypePage() {
  const { role } = useRole();
  const canAddEdit = hasRole(role, ["Admin", "Doctor", "Receptionist"]);
  const canDelete = hasRole(role, ["Admin"]);

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [formData, setFormData] = useState({ TreatmentTypeName: "" });

  const fetchData = async () => { setLoading(true); const data = await GetAllTreatmentTypes(); if (!data?.error) setItems(Array.isArray(data) ? data : []); setLoading(false); };
  useEffect(() => { fetchData(); }, []);

  const handleOpenModal = (item?: any) => {
    if (!canAddEdit) return;

    if (item) { setEditing(item); setFormData({ TreatmentTypeName: item.TreatmentTypeName }); }
    else { setEditing(null); setFormData({ TreatmentTypeName: "" }); }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAddEdit) return;

    if (editing) { await UpdateTreatmentType(editing.TreatmentTypeID, formData); } else { await CreateTreatmentType(formData); }
    setIsModalOpen(false); fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!canDelete) return;
    if (confirm("Are you sure?")) { await DeleteTreatmentType(id); fetchData(); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-slate-800">Treatment Type</h1><p className="text-slate-500">Manage treatment categories</p></div>
        {canAddEdit && <Button onClick={() => handleOpenModal()} className="gap-2"><Plus className="h-4 w-4" /> Add Treatment</Button>}
      </div>
      <Card><CardContent className="pt-6">
        <Table><TableHeader><TableRow><TableHead>Treatment Type Name</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {loading ? (<TableSkeletonRows columns={2} />) : items.length === 0 ? (<TableRow><TableCell colSpan={2} className="text-center py-10 text-slate-500">No records found.</TableCell></TableRow>) : (
              items.map((t) => (<TableRow key={t.TreatmentTypeID}><TableCell className="font-bold">{t.TreatmentTypeName}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Link href={`/treatment-type/${t.TreatmentTypeID}`}>
                    <Button variant="ghost" size="icon" title="View Details"><Eye className="h-4 w-4 text-blue-500" /></Button>
                  </Link>
                  {canAddEdit && <Button variant="ghost" size="icon" onClick={() => handleOpenModal(t)}><Pencil className="h-4 w-4" /></Button>}
                  {canDelete && <Button variant="ghost" size="icon" onClick={() => handleDelete(t.TreatmentTypeID)}><Trash2 className="h-4 w-4 text-red-500" /></Button>}
                </TableCell></TableRow>))
            )}
          </TableBody>
        </Table>
      </CardContent></Card>
      <Modal isOpen={isModalOpen && canAddEdit} onClose={() => setIsModalOpen(false)} title={editing ? "Edit Treatment" : "Add Treatment"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Treatment Type Name" value={formData.TreatmentTypeName} onChange={(e) => setFormData({ ...formData, TreatmentTypeName: e.target.value })} required />
          <div className="flex justify-end gap-3"><Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button><Button type="submit">{editing ? "Update" : "Create"}</Button></div>
        </form>
      </Modal>
    </div>
  );
}
