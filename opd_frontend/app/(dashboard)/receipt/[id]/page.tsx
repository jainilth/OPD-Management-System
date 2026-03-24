"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GetInvoiceById } from "@/app/service/opd.service";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { ArrowLeft, Printer, ReceiptIndianRupee, CreditCard, CalendarDays, ClipboardCheck, Tag } from "lucide-react";
import { Loader2 } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function ReceiptDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const data = await GetInvoiceById(Number(id));
      if (data.error) throw new Error(data.error);
      setInvoice(data);
    } catch (err: any) {
      setError(err.message || "Failed to load receipt details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>;
  if (error) return <div className="text-center p-20 text-red-500 font-bold">{error}</div>;
  if (!invoice) return <div className="text-center p-20 text-slate-500">Receipt not found.</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="rounded-full hidden sm:flex">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-black text-slate-900">{invoice.InvoiceNo || `RCPT-${invoice.InvoiceID}`}</h1>
          <p className="text-sm font-medium text-slate-500 tracking-wide uppercase">Consultation Receipt</p>
        </div>
        <div className="ml-auto flex gap-3">
          <Button className="gap-2 bg-slate-900 border-none hover:bg-slate-800 shadow-md">
            <Printer className="h-4 w-4" /> Print Receipt
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-lg shadow-slate-200/50">
            <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-xl">
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2"><ClipboardCheck className="h-5 w-5 text-indigo-500" /> Billed Items</div>
                <div className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full border">
                  OPD-{invoice.OPDID}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50/50 text-slate-500 uppercase font-black text-[10px] tracking-widest border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Service Description</th>
                      <th className="px-6 py-4 text-center">Qty</th>
                      <th className="px-6 py-4 text-right">Rate</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoice.invoiceitem && invoice.invoiceitem.map((item: any) => (
                      <tr key={item.InvoiceItemID} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-3">
                          <Tag className="h-4 w-4 text-slate-300" />
                          {item.service?.ServiceName || "Unknown Service"}
                        </td>
                        <td className="px-6 py-4 text-center text-slate-600 font-medium">{item.Quantity}</td>
                        <td className="px-6 py-4 text-right text-slate-600 font-medium">{formatCurrency(item.Rate)}</td>
                        <td className="px-6 py-4 text-right font-black text-slate-900">{formatCurrency(item.Amount)}</td>
                      </tr>
                    ))}
                    {!invoice.invoiceitem || invoice.invoiceitem.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-slate-400 italic">No items found for this receipt.</td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50 border-t border-slate-100 rounded-b-xl flex justify-between items-center p-6">
              <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total Payable</div>
              <div className="text-3xl font-black text-slate-900">{formatCurrency(invoice.TotalAmount)}</div>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-lg shadow-slate-200/50 bg-gradient-to-br from-indigo-500 to-purple-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <ReceiptIndianRupee className="w-32 h-32" />
            </div>
            <CardHeader>
              <CardTitle className="text-lg font-bold text-white/90">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 relative z-10">
              <div>
                <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest">Status</p>
                <div className="inline-flex items-center gap-1.5 mt-2 bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span> Paid
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest pl-1">Payment Mode</p>
                <div className="flex items-center gap-2 mt-1 px-1">
                  <CreditCard className="h-5 w-5 text-indigo-100" />
                  <p className="text-xl font-black text-white">
                    {invoice.paymentmode?.PaymentModeName || "Cash"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest pl-1">Receipt Date</p>
                <div className="flex items-center gap-2 mt-1 px-1">
                  <CalendarDays className="h-5 w-5 text-indigo-100" />
                  <p className="text-md font-bold text-white">{formatDate(invoice.InvoiceDate)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
