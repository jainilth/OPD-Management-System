"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Modal } from "@/components/ui/Modal";
import { GetAllPaymentModes, CreatePaymentMode, UpdatePaymentMode, DeletePaymentMode } from "@/app/service/master.service";
import { useRole } from "@/context/RoleContext";
import { hasRole } from "@/lib/rbac";

export default function PaymentModePage() {
    const { role } = useRole();
    const canAddEdit = hasRole(role, ["Admin"]);
    const canDelete = hasRole(role, ["Admin"]);
    const canViewPage = hasRole(role, ["Admin"]);

    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState<any | null>(null);
    const [formData, setFormData] = useState({ PaymentModeName: "" });

    const fetchData = async () => {
        setLoading(true);
        const data = await GetAllPaymentModes();
        if (!data?.error) setItems(Array.isArray(data) ? data : []);
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const handleOpenModal = (item?: any) => {
        if (!canAddEdit) return;

        if (item) {
            setEditing(item);
            setFormData({ PaymentModeName: item.PaymentModeName || "" });
        } else {
            setEditing(null);
            setFormData({ PaymentModeName: "" });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canAddEdit) return;

        if (editing) await UpdatePaymentMode(editing.PaymentModeID, formData);
        else await CreatePaymentMode(formData);
        setIsModalOpen(false);
        fetchData();
    };

    const handleDelete = async (id: number) => {
        if (!canDelete) return;

        if (confirm("Are you sure?")) {
            await DeletePaymentMode(id);
            fetchData();
        }
    };

    if (!canViewPage) {
        return (
            <div className="space-y-6">
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    You are not authorized to access Payment Mode management.
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div><h1 className="text-3xl font-bold text-slate-800">Payment Mode</h1><p className="text-slate-500">Manage payment options</p></div>
                {canAddEdit && <Button onClick={() => handleOpenModal()} className="gap-2"><Plus className="h-4 w-4" /> Add Mode</Button>}
            </div>
            <Card><CardContent className="pt-6">
                <Table><TableHeader><TableRow><TableHead>Payment Mode</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {loading ? (<TableRow><TableCell colSpan={2} className="text-center py-10">Loading...</TableCell></TableRow>) : items.length === 0 ? (
                            <TableRow><TableCell colSpan={2} className="text-center py-10 text-slate-500">No records found.</TableCell></TableRow>
                        ) : (
                            items.map((item) => (
                                <TableRow key={item.PaymentModeID}>
                                    <TableCell className="font-bold">{item.PaymentModeName}</TableCell>
                                    <TableCell className="text-right space-x-1">
                                        {canAddEdit && <Button variant="ghost" size="icon" onClick={() => handleOpenModal(item)}><Pencil className="h-4 w-4" /></Button>}
                                        {canDelete && <Button variant="ghost" size="icon" onClick={() => handleDelete(item.PaymentModeID)}><Trash2 className="h-4 w-4 text-red-500" /></Button>}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent></Card>

            <Modal isOpen={isModalOpen && canAddEdit} onClose={() => setIsModalOpen(false)} title={editing ? "Edit Payment Mode" : "Add Payment Mode"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Payment Mode Name" value={formData.PaymentModeName} onChange={(e) => setFormData({ ...formData, PaymentModeName: e.target.value })} required />
                    <div className="flex justify-end gap-3"><Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button><Button type="submit">{editing ? "Update" : "Create"}</Button></div>
                </form>
            </Modal>
        </div>
    );
}
