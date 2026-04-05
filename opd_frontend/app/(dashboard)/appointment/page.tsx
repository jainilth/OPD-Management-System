"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { TableSkeletonRows } from "@/components/ui/TableSkeletonRows";
import { Modal } from "@/components/ui/Modal";
import { GetAllAppointments, GetMyAppointments, CreateAppointment, UpdateAppointment, DeleteAppointment } from "@/app/service/appointment.service";
import { GetAllPatients } from "@/app/service/patient.service";
import { GetAllDoctors } from "@/app/service/doctor.service";
import { formatDate } from "@/lib/utils";
import { useRole } from "@/context/RoleContext";
import { hasRole } from "@/lib/rbac";

export default function AppointmentPage() {
    const { role } = useRole();
    const canCreate = hasRole(role, ["Admin", "Receptionist", "Patient"]);
    const canEdit = hasRole(role, ["Admin", "Receptionist", "Patient"]);
    const canDelete = hasRole(role, ["Admin", "Receptionist"]);
    const isPatient = role === "Patient";

    const [appointments, setAppointments] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState<any | null>(null);
    const [formData, setFormData] = useState({
        PatientID: "",
        DoctorID: "",
        AppointmentDateTime: "",
        Status: "Scheduled",
    });

    const fetchData = async () => {
        setLoading(true);
        const [aData, pData, dData] = await Promise.all([
            isPatient ? GetMyAppointments() : GetAllAppointments(),
            isPatient ? Promise.resolve([]) : GetAllPatients(),
            GetAllDoctors(),
        ]);

        if (!aData?.error) setAppointments(Array.isArray(aData) ? aData : []);
        if (!pData?.error) setPatients(Array.isArray(pData) ? pData : []);
        if (!dData?.error) setDoctors(Array.isArray(dData) ? dData : []);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const patientOwnedAppointments = useMemo(() => appointments, [appointments]);

    const handleOpenModal = (appointment?: any) => {
        if (!canCreate && !canEdit) return;

        if (appointment) {
            setEditing(appointment);
            setFormData({
                PatientID: String(appointment.PatientID || ""),
                DoctorID: String(appointment.DoctorID || ""),
                AppointmentDateTime: appointment.AppointmentDateTime ? new Date(appointment.AppointmentDateTime).toISOString().slice(0, 16) : "",
                Status: appointment.Status || "Scheduled",
            });
        } else {
            setEditing(null);
            setFormData({ PatientID: "", DoctorID: "", AppointmentDateTime: "", Status: "Scheduled" });
        }

        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canCreate && !canEdit) return;

        const payload: any = {
            DoctorID: parseInt(formData.DoctorID),
            AppointmentDateTime: new Date(formData.AppointmentDateTime).toISOString(),
        };

        if (!isPatient) {
            payload.PatientID = parseInt(formData.PatientID);
            payload.Status = formData.Status;
        }

        const result = editing
            ? await UpdateAppointment(editing.AppointmentID, payload)
            : await CreateAppointment(payload);

        if (result?.error) return;

        setIsModalOpen(false);
        setEditing(null);
        setFormData({ PatientID: "", DoctorID: "", AppointmentDateTime: "", Status: "Scheduled" });
        fetchData();
    };

    const handleDelete = async (id: number) => {
        if (!canDelete) return;
        if (confirm("Are you sure?")) {
            await DeleteAppointment(id);
            fetchData();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Book Appointment</h1>
                    <p className="text-slate-500">
                        {isPatient ? "Manage your appointments" : "Manage all user appointments"}
                    </p>
                </div>
                {canCreate && (
                    <Button onClick={() => handleOpenModal()} className="gap-2">
                        <Plus className="h-4 w-4" /> Add Appointment
                    </Button>
                )}
            </div>

            <Card>
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date & Time</TableHead>
                                <TableHead>Patient</TableHead>
                                <TableHead>Doctor</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableSkeletonRows columns={5} />
                            ) : patientOwnedAppointments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-slate-500">No appointments found.</TableCell>
                                </TableRow>
                            ) : (
                                patientOwnedAppointments.map((a) => (
                                    <TableRow key={a.AppointmentID}>
                                        <TableCell>{formatDate(a.AppointmentDateTime)}</TableCell>
                                        <TableCell>{a.patient?.FullName || "-"}</TableCell>
                                        <TableCell>{a.doctor?.DoctorName || "-"}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${a.Status === "Completed" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>
                                                {a.Status || "Scheduled"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right space-x-1">
                                            {canEdit && <Button variant="ghost" size="icon" onClick={() => handleOpenModal(a)}><Pencil className="h-4 w-4" /></Button>}
                                            {canDelete && <Button variant="ghost" size="icon" onClick={() => handleDelete(a.AppointmentID)}><Trash2 className="h-4 w-4 text-red-500" /></Button>}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Modal isOpen={isModalOpen && (canCreate || canEdit)} onClose={() => setIsModalOpen(false)} title={editing ? "Edit Appointment" : "Book Appointment"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isPatient && (
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Patient</label>
                            <select
                                className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.PatientID}
                                onChange={(e) => setFormData({ ...formData, PatientID: e.target.value })}
                                required
                            >
                                <option value="">Select Patient</option>
                                {patients.map((p: any) => (
                                    <option key={p.PatientID} value={p.PatientID}>{p.FullName} ({p.Mobile})</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Doctor</label>
                        <select
                            className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.DoctorID}
                            onChange={(e) => setFormData({ ...formData, DoctorID: e.target.value })}
                            required
                        >
                            <option value="">Select Doctor</option>
                            {doctors.map((d: any) => (
                                <option key={d.DoctorID} value={d.DoctorID}>{d.DoctorName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Appointment Date & Time</label>
                        <input
                            type="datetime-local"
                            className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.AppointmentDateTime}
                            onChange={(e) => setFormData({ ...formData, AppointmentDateTime: e.target.value })}
                            required
                        />
                    </div>

                    {!isPatient && (
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Status</label>
                            <select
                                className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.Status}
                                onChange={(e) => setFormData({ ...formData, Status: e.target.value })}
                                required
                            >
                                <option value="Scheduled">Scheduled</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    )}

                    <div className="flex justify-end gap-3">
                        <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit">{editing ? "Update" : "Book"}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
