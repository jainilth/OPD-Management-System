"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, ReceiptIndianRupee, Calculator, Printer, Eye, Search, X, Pencil } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { TableSkeletonRows } from "@/components/ui/TableSkeletonRows";
import { Modal } from "@/components/ui/Modal";
import { GetAllInvoices, GetMyInvoices, CreateInvoice, CreateInvoiceItem, UpdateInvoice, DeleteInvoice } from "@/app/service/invoice.service";
import { GetAllOPDVisits } from "@/app/service/opdvisit.service";
import { GetAllServices, GetAllPaymentModes } from "@/app/service/master.service";
import { GetAllUsers } from "@/app/service/user.service";
import { formatDate, formatCurrency } from "@/lib/utils";
import { useRole } from "@/context/RoleContext";
import { hasRole } from "@/lib/rbac";

interface ItemForm { ServiceID: string; Quantity: number; Rate: number; Amount: number; }

export default function ReceiptPage() {
  const { role } = useRole();
  const canCreate = hasRole(role, ["Admin", "Receptionist"]);
  const canEdit = hasRole(role, ["Admin"]);
  const canDelete = hasRole(role, ["Admin"]);
  const isUserSide = hasRole(role, ["Patient", "User"]);

  const [invoices, setInvoices] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [paymentModes, setPaymentModes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<any | null>(null);
  const [userSearchOpen, setUserSearchOpen] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [formData, setFormData] = useState({ UserID: "", OPDID: "", PaymentModeID: "1", Items: [] as ItemForm[] });

  const patientUsers = users.filter((u) => u.role?.RoleName === "Patient");

  const filteredUsers = patientUsers.filter(u =>
    u.Username?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    u.UserID.toString().includes(userSearchTerm)
  );

  const resetForm = () => {
    setEditingInvoice(null);
    setUserSearchTerm("");
    setUserSearchOpen(false);
    setFormData({ UserID: "", OPDID: "", PaymentModeID: "1", Items: [] });
  };

  const openEditModal = (invoice: any) => {
    setEditingInvoice(invoice);
    setFormData({
      UserID: String(invoice.UserID || ""),
      OPDID: String(invoice.OPDID || ""),
      PaymentModeID: String(invoice.PaymentModeID || "1"),
      Items: [],
    });
    setUserSearchTerm(invoice.user?.Username || "");
    setUserSearchOpen(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!canDelete) return;
    if (!confirm("Delete this receipt entry?")) return;
    await DeleteInvoice(id);
    fetchData();
  };

  const fetchData = async () => {
    setLoading(true);
    const [invData, uData, vData, sData, pmData] = await Promise.all([
      isUserSide ? GetMyInvoices() : GetAllInvoices(),
      canCreate ? GetAllUsers() : Promise.resolve([]),
      canCreate ? GetAllOPDVisits() : Promise.resolve([]),
      canCreate ? GetAllServices() : Promise.resolve([]),
      GetAllPaymentModes(),
    ]);
    if (!invData?.error) setInvoices(Array.isArray(invData) ? invData : []);
    if (!uData?.error) setUsers(Array.isArray(uData) ? uData : []);
    if (!vData?.error) setVisits(Array.isArray(vData) ? vData : []);
    if (!sData?.error) setServices(Array.isArray(sData) ? sData : []);
    if (!pmData?.error) setPaymentModes(Array.isArray(pmData) ? pmData : []);
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);

  const addItem = () => {
    if (!canCreate) return;
    setFormData(prev => ({ ...prev, Items: [...prev.Items, { ServiceID: "", Quantity: 1, Rate: 0, Amount: 0 }] }));
  };
  const removeItem = (i: number) => {
    if (!canCreate) return;
    setFormData(prev => ({ ...prev, Items: prev.Items.filter((_, idx) => idx !== i) }));
  };

  const updateItem = (index: number, field: keyof ItemForm, value: any) => {
    const newItems = [...formData.Items];
    const item = { ...newItems[index] };
    if (field === "ServiceID") { const s = services.find((s: any) => s.ServiceID === parseInt(value)); item.ServiceID = value; item.Rate = s?.Rate || 0; }
    else { (item as any)[field] = value; }
    item.Amount = item.Quantity * item.Rate;
    newItems[index] = item;
    setFormData(prev => ({ ...prev, Items: newItems }));
  };

  const totalAmount = formData.Items.reduce((sum, item) => sum + item.Amount, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreate && !canEdit) return;
    if (!formData.UserID) {
      alert("Please select a user");
      return;
    }

    if (editingInvoice) {
      await UpdateInvoice(editingInvoice.InvoiceID, {
        UserID: parseInt(formData.UserID),
        OPDID: parseInt(formData.OPDID),
        PaymentModeID: parseInt(formData.PaymentModeID),
        InvoiceDate: editingInvoice.InvoiceDate || new Date().toISOString(),
        TotalAmount: editingInvoice.TotalAmount,
      });
      setIsModalOpen(false);
      resetForm();
      fetchData();
      return;
    }

    const invoiceResult = await CreateInvoice({ UserID: parseInt(formData.UserID), OPDID: parseInt(formData.OPDID), InvoiceDate: new Date().toISOString(), TotalAmount: totalAmount, PaymentModeID: parseInt(formData.PaymentModeID) });
    const invoiceId = invoiceResult?.InvoiceID || invoiceResult?.data?.InvoiceID;
    if (invoiceId && formData.Items.length > 0) {
      await Promise.all(formData.Items.map(item => CreateInvoiceItem({ InvoiceID: invoiceId, ServiceID: parseInt(item.ServiceID), Quantity: item.Quantity, Rate: item.Rate, Amount: item.Amount })));
    }
    setIsModalOpen(false);
    resetForm();
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-slate-800">Billing & Receipts</h1><p className="text-slate-500">{canCreate ? "Generate and manage consultation receipts" : "View your past receipts"}</p></div>
        {canCreate && <Button onClick={() => { resetForm(); setIsModalOpen(true); }} className="gap-2"><ReceiptIndianRupee className="h-4 w-4" /> New Receipt</Button>}
      </div>
      <Card><CardContent className="pt-6">
        <Table><TableHeader><TableRow><TableHead>Receipt No</TableHead><TableHead>Date</TableHead><TableHead>OPD Ref</TableHead><TableHead>Amount</TableHead><TableHead>Payment Mode</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {loading ? (<TableSkeletonRows columns={6} />) : invoices.length === 0 ? (<TableRow><TableCell colSpan={6} className="text-center py-10 text-slate-500">No receipts generated yet.</TableCell></TableRow>) : (
              invoices.map((inv) => (<TableRow key={inv.InvoiceID}><TableCell className="font-mono text-xs font-bold">{inv.InvoiceNo || `#${inv.InvoiceID}`}</TableCell><TableCell>{formatDate(inv.InvoiceDate)}</TableCell><TableCell className="text-blue-600 font-medium">OPD-{inv.OPDID}</TableCell><TableCell className="font-bold">{formatCurrency(inv.TotalAmount)}</TableCell>
                <TableCell><span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-medium">{paymentModes.find((p: any) => p.PaymentModeID === inv.PaymentModeID)?.PaymentModeName || "Cash"}</span></TableCell>
                <TableCell className="text-right space-x-1">
                  <Link href={`/receipt/${inv.InvoiceID}`}>
                    <Button variant="ghost" size="icon" title="View Details"><Eye className="h-4 w-4 text-blue-500" /></Button>
                  </Link>
                  {canEdit && (
                    <Button variant="ghost" size="icon" title="Edit" onClick={() => openEditModal(inv)}>
                      <Pencil className="h-4 w-4 text-amber-500" />
                    </Button>
                  )}
                  {canDelete && (
                    <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDelete(inv.InvoiceID)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" title="Print"><Printer className="h-4 w-4 text-slate-500" /></Button>
                </TableCell></TableRow>))
            )}
          </TableBody>
        </Table>
      </CardContent></Card>

      <Modal isOpen={isModalOpen && (canCreate || canEdit)} onClose={() => setIsModalOpen(false)} title={editingInvoice ? "Edit Receipt Entry" : "Generate New Receipt"} description={editingInvoice ? "Update receipt details." : "Select visit and add services to bill."}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5 relative">
              <label className="text-sm font-semibold text-slate-700">User <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Search username or ID..."
                      value={userSearchTerm}
                      onChange={(e) => { setUserSearchTerm(e.target.value); setUserSearchOpen(true); }}
                      onFocus={() => setUserSearchOpen(true)}
                      className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {userSearchTerm && (
                      <button
                        type="button"
                        onClick={() => { setUserSearchTerm(""); setUserSearchOpen(false); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                {userSearchOpen && filteredUsers.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                    {filteredUsers.map((u: any) => {
                      const selectedUser = patientUsers.find(usr => usr.UserID === parseInt(formData.UserID));
                      const isSelected = selectedUser?.UserID === u.UserID;
                      return (
                        <button
                          key={u.UserID}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, UserID: u.UserID.toString() });
                            setUserSearchTerm(u.Username);
                            setUserSearchOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 ${isSelected ? "bg-blue-100 font-semibold" : ""
                            }`}
                        >
                          <div className="font-medium">{u.Username}</div>
                          <div className="text-xs text-slate-500">ID: {u.UserID}</div>
                        </button>
                      );
                    })}
                  </div>
                )}
                {userSearchOpen && userSearchTerm && filteredUsers.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 p-3 text-center text-sm text-slate-500">
                    No users found
                  </div>
                )}
              </div>
              {formData.UserID && (
                <div className="text-xs text-slate-600 mt-1">
                  Selected: <span className="font-semibold">{patientUsers.find(u => u.UserID === parseInt(formData.UserID))?.Username}</span>
                </div>
              )}
            </div>
            <div className="space-y-1.5"><label className="text-sm font-semibold text-slate-700">Select OPD Visit</label>
              <select className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.OPDID} onChange={(e) => setFormData({ ...formData, OPDID: e.target.value })} required>
                <option value="">Choose Visit...</option>
                {visits.map((v: any) => (<option key={v.OPDID} value={v.OPDID}>OPD-{v.OPDNo || v.OPDID} ({formatDate(v.VisitDateTime)})</option>))}
              </select>
            </div>
            <div className="space-y-1.5"><label className="text-sm font-semibold text-slate-700">Payment Mode</label>
              <select className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.PaymentModeID} onChange={(e) => setFormData({ ...formData, PaymentModeID: e.target.value })} required>
                {paymentModes.map((pm: any) => (<option key={pm.PaymentModeID} value={pm.PaymentModeID}>{pm.PaymentModeName}</option>))}
              </select>
            </div>
          </div>
          {!editingInvoice && (
            <>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b pb-2"><h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Bill Items</h3><Button type="button" variant="outline" size="sm" onClick={addItem} className="h-8"><Plus className="mr-1 h-3 w-3" /> Add Service</Button></div>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {formData.Items.map((item, index) => (
                    <div key={index} className="flex gap-2 items-end bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="flex-1 space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">Service</label>
                        <select className="flex h-9 w-full rounded border border-slate-200 bg-white px-2 py-1 text-xs focus:outline-none" value={item.ServiceID} onChange={(e) => updateItem(index, "ServiceID", e.target.value)} required>
                          <option value="">Select Service</option>{services.map((s: any) => (<option key={s.ServiceID} value={s.ServiceID}>{s.ServiceName} (₹{s.Rate})</option>))}
                        </select>
                      </div>
                      <div className="w-20 space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">Qty</label><input type="number" className="h-9 w-full rounded border border-slate-200 px-2 py-1 text-xs" value={item.Quantity} min="1" onChange={(e) => updateItem(index, "Quantity", parseInt(e.target.value))} required /></div>
                      <div className="w-24 space-y-1 text-right"><label className="text-[10px] font-bold text-slate-400 uppercase">Total</label><div className="h-9 flex items-center justify-end px-2 text-xs font-bold text-slate-800">₹{item.Amount}</div></div>
                      <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => removeItem(index)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                  {formData.Items.length === 0 && (<p className="text-center py-4 text-xs text-slate-400 italic">No services added to bill yet.</p>)}
                </div>
              </div>
              <div className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-xl shadow-inner">
                <div className="flex items-center gap-2"><Calculator className="h-5 w-5 text-blue-400" /><span className="text-sm font-medium text-slate-300">Total Payable Amount</span></div>
                <div className="text-2xl font-black">{formatCurrency(totalAmount)}</div>
              </div>
            </>
          )}
          <div className="flex justify-end gap-3"><Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Discard</Button><Button type="submit" disabled={(!editingInvoice && formData.Items.length === 0) || !formData.OPDID || !formData.UserID} className="px-8">{editingInvoice ? "Update Receipt" : "Generate & Print Receipt"}</Button></div>
        </form>
      </Modal>
    </div>
  );
}
