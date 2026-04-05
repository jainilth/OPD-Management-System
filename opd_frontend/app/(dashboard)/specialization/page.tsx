"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { TableSkeletonRows } from "@/components/ui/TableSkeletonRows";
import { Modal } from "@/components/ui/Modal";
import { GetAllSpecializations, CreateSpecialization, UpdateSpecialization, DeleteSpecialization } from "@/app/service/master.service";
import { useRole } from "@/context/RoleContext";
import { hasRole } from "@/lib/rbac";

export default function SpecializationPage() {
  const { role } = useRole();
  const canManage = hasRole(role, ["Admin"]);

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [formData, setFormData] = useState({ SpecializationName: "", Description: "" });

  const fetchData = async () => {
    setLoading(true);
    const data = await GetAllSpecializations();
    if (!data?.error) setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenModal = (item?: any) => {
    if (!canManage) return;

    if (item) {
      setEditing(item);
      setFormData({ SpecializationName: item.SpecializationName || "", Description: item.Description || "" });
    } else {
      setEditing(null);
      setFormData({ SpecializationName: "", Description: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) return;

    if (editing) await UpdateSpecialization(editing.SpecializationID, formData);
    else await CreateSpecialization(formData);
    setIsModalOpen(false);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!canManage) return;

    if (confirm("Are you sure?")) {
      await DeleteSpecialization(id);
      fetchData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-slate-800">Specialization</h1><p className="text-slate-500">Manage doctor specializations</p></div>
        {canManage && <Button onClick={() => handleOpenModal()} className="gap-2"><Plus className="h-4 w-4" /> Add Specialization</Button>}
      </div>
      <Card><CardContent className="pt-6">
        <Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Description</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {loading ? (<TableSkeletonRows columns={3} />) : items.length === 0 ? (
              <TableRow><TableCell colSpan={3} className="text-center py-10 text-slate-500">No records found.</TableCell></TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.SpecializationID}>
                  <TableCell className="font-bold">{item.SpecializationName}</TableCell>
                  <TableCell>{item.Description || "-"}</TableCell>
                  <TableCell className="text-right space-x-1">
                    {canManage && <Button variant="ghost" size="icon" onClick={() => handleOpenModal(item)}><Pencil className="h-4 w-4" /></Button>}
                    {canManage && <Button variant="ghost" size="icon" onClick={() => handleDelete(item.SpecializationID)}><Trash2 className="h-4 w-4 text-red-500" /></Button>}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent></Card>

      <Modal isOpen={isModalOpen && canManage} onClose={() => setIsModalOpen(false)} title={editing ? "Edit Specialization" : "Add Specialization"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Specialization Name" value={formData.SpecializationName} onChange={(e) => setFormData({ ...formData, SpecializationName: e.target.value })} required />
          <Input label="Description" value={formData.Description} onChange={(e) => setFormData({ ...formData, Description: e.target.value })} />
          <div className="flex justify-end gap-3"><Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button><Button type="submit">{editing ? "Update" : "Create"}</Button></div>
        </form>
      </Modal>
    </div>
  );
}
