import * as XLSX from "xlsx";
import type { VisaApp, Customer } from "./admin-store";

export function exportToXlsx<T extends Record<string, unknown>>(rows: T[], filename: string, sheetName = "Sheet1") {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename);
}

export async function parseXlsxOrCsv(file: File): Promise<Record<string, unknown>[]> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });
  const first = wb.SheetNames[0];
  if (!first) return [];
  return XLSX.utils.sheet_to_json(wb.Sheets[first]);
}

export function appsToRows(apps: VisaApp[]) {
  return apps.map((a) => ({
    "الكود": a.track_code || "",
    "الاسم": a.full_name,
    "الهاتف": a.phone,
    "البريد": a.email || "",
    "الدولة": a.country,
    "نوع التأشيرة": a.visa_type,
    "الحالة": a.status,
    "السعر": a.price,
    "المدفوع": a.paid,
    "العملة": a.currency,
    "الجواز": a.passport_no || "",
    "الجنسية": a.nationality || "",
    "تاريخ الموعد": a.appointment_date || "",
    "تاريخ السفر": a.travel_date || "",
    "تاريخ الإنشاء": a.created_at,
  }));
}
export function customersToRows(customers: Customer[]) {
  return customers.map((c) => ({
    "الاسم": c.full_name, "الهاتف": c.phone || "", "البريد": c.email || "",
    "الجواز": c.passport_no || "", "الجنسية": c.nationality || "",
    "الميلاد": c.dob || "", "الجنس": c.gender || "", "العنوان": c.address || "",
  }));
}
