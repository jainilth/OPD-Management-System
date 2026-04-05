"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { TableSkeletonRows } from "@/components/ui/TableSkeletonRows";
import { Modal } from "@/components/ui/Modal";
import { GetAllRoles, CreateRole, UpdateRole, DeleteRole } from "@/app/service/user.service";
import { useRole } from "@/context/RoleContext";
import { hasRole } from "@/lib/rbac";

export default function RolePage() {
    const { role } = useRole();
    const canManage = hasRole(role, ["Admin"]);

    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState<any | null>(null);
    const [formData, setFormData] = useState({ RoleName: "" });

    const fetchData = async () => {
        setLoading(true);
        const data = await GetAllRoles();
        if (!data?.error) setItems(Array.isArray(data) ? data : []);
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const handleOpenModal = (item?: any) => {
        if (!canManage) return;

        if (item) {
            setEditing(item);
            setFormData({ RoleName: item.RoleName || "" });
        } else {
            setEditing(null);
            setFormData({ RoleName: "" });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canManage) return;

        if (editing) await UpdateRole(editing.RoleID, formData);
        else await CreateRole(formData);
        setIsModalOpen(false);
        fetchData();
    };

    const handleDelete = async (id: number) => {
        if (!canManage) return;

        if (confirm("Are you sure?")) {
            await DeleteRole(id);
            fetchData();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div><h1 className="text-3xl font-bold text-slate-800">Role Master</h1><p className="text-slate-500">Manage system roles</p></div>
                {canManage && <Button onClick={() => handleOpenModal()} className="gap-2"><Plus className="h-4 w-4" /> Add Role</Button>}
            </div>
            <Card><CardContent className="pt-6">
                <Table><TableHeader><TableRow><TableHead>Role Name</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {loading ? (<TableSkeletonRows columns={2} />) : items.length === 0 ? (
                            <TableRow><TableCell colSpan={2} className="text-center py-10 text-slate-500">No roles found.</TableCell></TableRow>
                        ) : (
                            items.map((item) => (
                                <TableRow key={item.RoleID}>
                                    <TableCell className="font-bold">{item.RoleName}</TableCell>
                                    <TableCell className="text-right space-x-1">
                                        {canManage && <Button variant="ghost" size="icon" onClick={() => handleOpenModal(item)}><Pencil className="h-4 w-4" /></Button>}
                                        {canManage && <Button variant="ghost" size="icon" onClick={() => handleDelete(item.RoleID)}><Trash2 className="h-4 w-4 text-red-500" /></Button>}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent></Card>

            <Modal isOpen={isModalOpen && canManage} onClose={() => setIsModalOpen(false)} title={editing ? "Edit Role" : "Add Role"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Role Name" value={formData.RoleName} onChange={(e) => setFormData({ ...formData, RoleName: e.target.value })} required />
                    <div className="flex justify-end gap-3"><Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button><Button type="submit">{editing ? "Update" : "Create"}</Button></div>
                </form>
            </Modal>
        </div>
    );
}
