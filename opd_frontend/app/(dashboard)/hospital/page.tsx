"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/Table";
import { Modal } from "@/components/ui/Modal";
import { GetAllHospitals, CreateHospital, UpdateHospital, DeleteHospital } from "@/app/service/hospital.service";

interface Hospital {
  HospitalID: number;
  HospitalName: string;
  RegistrationCharge: number;
  OpeningDate: string;
  Address: string;
  ContactInfo: string;
}

export default function HospitalPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Hospital | null>(null);
  const [formData, setFormData] = useState({
    HospitalName: "", RegistrationCharge: "", OpeningDate: "", Address: "", ContactInfo: ""
  });

  const fetchData = async () => {
    setLoading(true);
    const data = await GetAllHospitals();
    if (!data?.error) setHospitals(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenModal = (hospital?: Hospital) => {
    if (hospital) {
      setEditing(hospital);
      setFormData({
        HospitalName: hospital.HospitalName,
        RegistrationCharge: String(hospital.RegistrationCharge),
        OpeningDate: hospital.OpeningDate?.split("T")[0] || "",
        Address: hospital.Address,
        ContactInfo: hospital.ContactInfo,
      });
    } else {
      setEditing(null);
      setFormData({ HospitalName: "", RegistrationCharge: "", OpeningDate: "", Address: "", ContactInfo: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData, RegistrationCharge: parseFloat(formData.RegistrationCharge) };
    if (editing) {
      await UpdateHospital(editing.HospitalID, payload);
    } else {
      await CreateHospital(payload);
    }
    setIsModalOpen(false);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure?")) {
      await DeleteHospital(id);
      fetchData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Hospital Master</h1>
          <p className="text-slate-500">Manage hospital information</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="h-4 w-4" /> Add Hospital
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Reg. Charge</TableHead>
                <TableHead>Opening Date</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-10">Loading...</TableCell></TableRow>
              ) : hospitals.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-10 text-slate-500">No hospitals found.</TableCell></TableRow>
              ) : (
                hospitals.map((h) => (
                  <TableRow key={h.HospitalID}>
                    <TableCell className="font-bold">{h.HospitalName}</TableCell>
                    <TableCell>₹{h.RegistrationCharge}</TableCell>
                    <TableCell>{h.OpeningDate?.split("T")[0]}</TableCell>
                    <TableCell>{h.Address}</TableCell>
                    <TableCell>{h.ContactInfo}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Link href={`/hospital/${h.HospitalID}`}>
                        <Button variant="ghost" size="icon" title="View Details"><Eye className="h-4 w-4 text-blue-500" /></Button>
                      </Link>
                      <Button variant="ghost" size="icon" onClick={() => handleOpenModal(h)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(h.HospitalID)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? "Edit Hospital" : "Add Hospital"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Hospital Name" value={formData.HospitalName} onChange={(e) => setFormData({ ...formData, HospitalName: e.target.value })} required />
          <Input label="Registration Charge" type="number" value={formData.RegistrationCharge} onChange={(e) => setFormData({ ...formData, RegistrationCharge: e.target.value })} required />
          <Input label="Opening Date" type="date" value={formData.OpeningDate} onChange={(e) => setFormData({ ...formData, OpeningDate: e.target.value })} required />
          <Input label="Address" value={formData.Address} onChange={(e) => setFormData({ ...formData, Address: e.target.value })} required />
          <Input label="Contact Info" value={formData.ContactInfo} onChange={(e) => setFormData({ ...formData, ContactInfo: e.target.value })} required />
          <div className="flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editing ? "Update" : "Create"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
