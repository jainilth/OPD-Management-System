"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Search, User, Menu, Loader2, FileText, UserRound, Building2, Stethoscope, Activity, Tag, ReceiptIndianRupee } from "lucide-react";
import { GlobalSearch } from "@/app/service/global-search.service";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export function Navbar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    patients: any[], doctors: any[], visits: any[], 
    hospitals: any[], diagnoses: any[], treatments: any[], 
    services: any[], receipts: any[]
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults(null);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setIsOpen(true);
      try {
        const data = await GlobalSearch(query);
        setResults(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const hasResults = results && (
    results.patients.length > 0 || results.doctors.length > 0 || results.visits.length > 0 ||
    results.hospitals.length > 0 || results.diagnoses.length > 0 || results.treatments.length > 0 ||
    results.services.length > 0 || results.receipts.length > 0
  );

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center gap-4">
        <button className="lg:hidden">
          <Menu className="h-6 w-6" />
        </button>
        <div className="relative group z-50" ref={searchRef}>
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-blue-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if (query.trim().length >= 2) setIsOpen(true) }}
            placeholder="Search everywhere..."
            className="h-10 w-96 rounded-xl border border-slate-200 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all bg-slate-50 focus:bg-white"
          />
          
          {isOpen && (query.trim().length >= 2) && (
            <div className="absolute top-full left-0 mt-2 w-[480px] bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden text-sm">
              {isLoading ? (
                <div className="flex items-center justify-center p-8 text-slate-400">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" /> Searching Everywhere...
                </div>
              ) : results ? (
                <div className="max-h-[75vh] overflow-y-auto custom-scrollbar">
                  {!hasResults ? (
                    <div className="p-8 text-center text-slate-500">No results found for &quot;{query}&quot;</div>
                  ) : (
                    <div className="p-2 space-y-4">
                      {results.patients.length > 0 && (
                        <div>
                          <p className="px-3 text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2 mt-2">Patients</p>
                          <div className="space-y-1">
                            {results.patients.map((p) => (
                              <Link href={`/patient/${p.PatientID}`} key={`p-${p.PatientID}`} onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors">
                                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0"><User className="h-4 w-4 text-blue-600" /></div>
                                <div className="flex-1 min-w-0"><p className="font-bold text-slate-900 truncate">{p.FullName}</p><p className="text-xs text-slate-500">Reg: {p.PatientNo} • Mobile: {p.Mobile}</p></div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {results.doctors.length > 0 && (
                        <div>
                          <p className="px-3 text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">Doctors</p>
                          <div className="space-y-1">
                            {results.doctors.map((d) => (
                              <Link href={`/doctor/${d.DoctorID}`} key={`d-${d.DoctorID}`} onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors">
                                <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center shrink-0"><UserRound className="h-4 w-4 text-purple-600" /></div>
                                <div className="flex-1 min-w-0"><p className="font-bold text-slate-900 truncate">Dr. {d.DoctorName}</p><p className="text-xs text-slate-500">{d.Mobile || 'No mobile'}</p></div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {results.visits.length > 0 && (
                        <div>
                          <p className="px-3 text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">OPD Visits</p>
                          <div className="space-y-1">
                            {results.visits.map((v) => (
                              <Link href={`/opd/${v.OPDID}`} key={`v-${v.OPDID}`} onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors">
                                <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center shrink-0"><FileText className="h-4 w-4 text-green-600" /></div>
                                <div className="flex-1 min-w-0"><p className="font-bold text-slate-900 truncate">OPD-{v.OPDNo}</p><p className="text-xs text-slate-500">{v.patient?.FullName || 'Unknown'} • {v.doctor?.DoctorName}</p></div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {results.receipts.length > 0 && (
                        <div>
                          <p className="px-3 text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">Receipts / Invoices</p>
                          <div className="space-y-1">
                            {results.receipts.map((r) => (
                              <Link href={`/receipt/${r.InvoiceID}`} key={`r-${r.InvoiceID}`} onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors">
                                <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0"><ReceiptIndianRupee className="h-4 w-4 text-indigo-600" /></div>
                                <div className="flex-1 min-w-0"><p className="font-bold text-slate-900 truncate">{r.InvoiceNo || `RCPT-${r.InvoiceID}`}</p><p className="text-xs text-slate-500">OPD-{r.OPDID} • {formatCurrency(r.TotalAmount)}</p></div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {results.hospitals.length > 0 && (
                        <div>
                          <p className="px-3 text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">Hospitals</p>
                          <div className="space-y-1">
                            {results.hospitals.map((h) => (
                              <Link href={`/hospital/${h.HospitalID}`} key={`h-${h.HospitalID}`} onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors">
                                <div className="h-8 w-8 rounded-lg bg-rose-100 flex items-center justify-center shrink-0"><Building2 className="h-4 w-4 text-rose-600" /></div>
                                <div className="flex-1 min-w-0"><p className="font-bold text-slate-900 truncate">{h.HospitalName}</p><p className="text-xs text-slate-500">{h.ContactInfo || 'No Contact'}</p></div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {results.diagnoses.length > 0 && (
                        <div>
                          <p className="px-3 text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">Diagnosis Types</p>
                          <div className="space-y-1">
                            {results.diagnoses.map((d) => (
                              <Link href={`/diagnosis-type/${d.DiagnosisID}`} key={`diag-${d.DiagnosisID}`} onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors">
                                <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0"><Stethoscope className="h-4 w-4 text-indigo-600" /></div>
                                <div className="flex-1 min-w-0"><p className="font-bold text-slate-900 truncate">{d.DiagnosisName}</p><p className="text-xs text-slate-500">ICD: {d.ICDCode || 'N/A'}</p></div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {results.treatments.length > 0 && (
                        <div>
                          <p className="px-3 text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">Treatment Categories</p>
                          <div className="space-y-1">
                            {results.treatments.map((t) => (
                              <Link href={`/treatment-type/${t.TreatmentTypeID}`} key={`treat-${t.TreatmentTypeID}`} onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors">
                                <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0"><Activity className="h-4 w-4 text-orange-600" /></div>
                                <div className="flex-1 min-w-0"><p className="font-bold text-slate-900 truncate">{t.TreatmentTypeName}</p></div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {results.services.length > 0 && (
                        <div>
                          <p className="px-3 text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">Services / Sub Treatments</p>
                          <div className="space-y-1">
                            {results.services.map((s) => (
                              <Link href={`/sub-treatment-type/${s.ServiceID}`} key={`serv-${s.ServiceID}`} onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors">
                                <div className="h-8 w-8 rounded-lg bg-teal-100 flex items-center justify-center shrink-0"><Tag className="h-4 w-4 text-teal-600" /></div>
                                <div className="flex-1 min-w-0"><p className="font-bold text-slate-900 truncate">{s.ServiceName}</p><p className="text-xs text-slate-500">{formatCurrency(s.Rate)}</p></div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 hover:bg-slate-100">
          <Bell className="h-5 w-5 text-slate-600" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <button className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-slate-100">
          <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
            <User className="h-5 w-5 text-slate-600" />
          </div>
          <span className="text-sm font-medium text-slate-700">Admin</span>
        </button>
      </div>
    </header>
  );
}
