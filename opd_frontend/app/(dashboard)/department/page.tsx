"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { TableSkeletonRows } from "@/components/ui/TableSkeletonRows";
import { Modal } from "@/components/ui/Modal";
import { GetAllDepartments, CreateDepartment, UpdateDepartment, DeleteDepartment } from "@/app/service/master.service";
import { GetAllHospitals } from "@/app/service/hospital.service";
import { useRole } from "@/context/RoleContext";
import { hasRole } from "@/lib/rbac";

export default function DepartmentPage() {
  const { role } = useRole();
  const canManage = hasRole(role, ["Admin", "Receptionist"]);

  const [items, setItems] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [formData, setFormData] = useState({ DepartmentName: "", HospitalID: "" });

  const fetchData = async () => {
    setLoading(true);
    const [depData, hospData] = await Promise.all([GetAllDepartments(), GetAllHospitals()]);
    if (!depData?.error) setItems(Array.isArray(depData) ? depData : []);
    if (!hospData?.error) setHospitals(Array.isArray(hospData) ? hospData : []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenModal = (item?: any) => {
    if (!canManage) return;

    if (item) {
      setEditing(item);
      setFormData({ DepartmentName: item.DepartmentName || "", HospitalID: item.HospitalID ? String(item.HospitalID) : "" });
    } else {
      setEditing(null);
      setFormData({ DepartmentName: "", HospitalID: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) return;

    const payload = { DepartmentName: formData.DepartmentName, HospitalID: formData.HospitalID ? parseInt(formData.HospitalID) : undefined };
    if (editing) await UpdateDepartment(editing.DepartmentID, payload);
    else await CreateDepartment(payload);
    setIsModalOpen(false);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!canManage) return;

    if (confirm("Are you sure?")) {
      await DeleteDepartment(id);
      fetchData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-slate-800">Department Master</h1><p className="text-slate-500">Manage departments</p></div>
        {canManage && <Button onClick={() => handleOpenModal()} className="gap-2"><Plus className="h-4 w-4" /> Add Department</Button>}
      </div>
      <Card><CardContent className="pt-6">
        <Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Hospital</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {loading ? (<TableSkeletonRows columns={3} />) : items.length === 0 ? (
              <TableRow><TableCell colSpan={3} className="text-center py-10 text-slate-500">No records found.</TableCell></TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.DepartmentID}>
                  <TableCell className="font-bold">{item.DepartmentName}</TableCell>
                  <TableCell>{item.hospital?.HospitalName || "-"}</TableCell>
                  <TableCell className="text-right space-x-1">
                    {canManage && <Button variant="ghost" size="icon" onClick={() => handleOpenModal(item)}><Pencil className="h-4 w-4" /></Button>}
                    {canManage && <Button variant="ghost" size="icon" onClick={() => handleDelete(item.DepartmentID)}><Trash2 className="h-4 w-4 text-red-500" /></Button>}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent></Card>

      <Modal isOpen={isModalOpen && canManage} onClose={() => setIsModalOpen(false)} title={editing ? "Edit Department" : "Add Department"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Department Name" value={formData.DepartmentName} onChange={(e) => setFormData({ ...formData, DepartmentName: e.target.value })} required />
          <div className="space-y-1.5"><label className="text-sm font-semibold text-slate-700">Hospital</label>
            <select className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.HospitalID} onChange={(e) => setFormData({ ...formData, HospitalID: e.target.value })}>
              <option value="">Select Hospital</option>
              {hospitals.map((h: any) => (<option key={h.HospitalID} value={h.HospitalID}>{h.HospitalName}</option>))}
            </select>
          </div>
          <div className="flex justify-end gap-3"><Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button><Button type="submit">{editing ? "Update" : "Create"}</Button></div>
        </form>
      </Modal>
    </div>
  );
}
