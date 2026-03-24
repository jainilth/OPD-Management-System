import Cookies from "js-cookie";

const BASE_URL = "/api";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

async function request<T>(
  endpoint: string,
  method: HttpMethod = "GET",
  data?: any
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const token = Cookies.get("accessToken");
  
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    },
    // We can also use credentials: 'include' if we want to rely on the backend's cookie
    credentials: 'include',
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);

  if (response.status === 401) {
    Cookies.remove("accessToken");
    if (typeof window !== "undefined" && window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || result.Message || `API error: ${response.statusText}`);
  }

  // Handle various backend response formats
  // Some routes return { success: true, data: [...] }
  // Login returns { sucess: true, token: "..." }
  return result.data ?? result;
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, "GET"),
  post: <T>(endpoint: string, data: any) => request<T>(endpoint, "POST", data),
  put: <T>(endpoint: string, data: any) => request<T>(endpoint, "PUT", data),
  patch: <T>(endpoint: string, data: any) => request<T>(endpoint, "PATCH", data),
  delete: <T>(endpoint: string) => request<T>(endpoint, "DELETE"),
};

// ... types remain the same (keeping them in the file for brevity)
export interface Hospital {
  HospitalID: number;
  HospitalName: string;
  RegistrationCharge: number;
  OpeningDate: string;
  Address: string;
  ContactInfo: string;
}

export interface Department {
  DepartmentID: number;
  DepartmentName: string;
  HospitalID?: number;
}

export interface Doctor {
  DoctorID: number;
  DoctorName: string;
  DepartmentID: number;
  ConsultationFee: number;
  HospitalID?: number;
  UserID?: number;
  photourl?: string;
  Mobile?: string;
  department?: { DepartmentName: string };
}

export interface DiagnosisType {
  DiagnosisID: number;
  DiagnosisName: string;
  ICDCode: string;
}

export interface TreatmentType {
  TreatmentTypeID: number;
  TreatmentTypeName: string;
}

export interface SubTreatmentType {
  ServiceID: number;
  TreatmentTypeID: number;
  ServiceName: string;
  Rate: number;
  treatmenttype?: { TreatmentTypeName: string };
}

export interface Patient {
  PatientID: number;
  PatientNo: number;
  FullName: string;
  DOB: string;
  Gender: "Male" | "Female" | "Other";
  Mobile: string;
  Address: string;
}

export interface OPDVisit {
  OPDID: number;
  OPDNo: string;
  PatientID: number;
  DoctorID: number;
  VisitDateTime: string;
  VisitType: "New" | "FollowUp";
  RegistrationFee: number;
  patient?: Patient;
  doctor?: Doctor;
}

export interface Receipt {
  InvoiceID: number;
  InvoiceNo: string;
  OPDID: number;
  InvoiceDate: string;
  TotalAmount: number;
  PaymentModeID: number;
  opdvisit?: OPDVisit;
}

export interface ReceiptItem {
  InvoiceItemID: number;
  InvoiceID: number;
  ServiceID: number;
  Quantity: number;
  Rate: number;
  Amount: number;
  service?: SubTreatmentType;
}
