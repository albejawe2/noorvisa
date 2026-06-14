import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { Invoice, VisaApp, Customer } from "./admin-store";

export function generateInvoicePDF(opts: {
  invoice: Invoice;
  app?: VisaApp | null;
  customer?: Customer | null;
}) {
  const { invoice, app, customer } = opts;
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  // Header
  doc.setFillColor(42, 26, 15);
  doc.rect(0, 0, 210, 35, "F");
  doc.setTextColor(212, 175, 55);
  doc.setFontSize(22).setFont("helvetica", "bold");
  doc.text("NoorVisa", 14, 20);
  doc.setFontSize(9).setFont("helvetica", "normal");
  doc.text("Premium Visa Consultancy", 14, 27);

  doc.setTextColor(212, 175, 55);
  doc.setFontSize(14).setFont("helvetica", "bold");
  doc.text("INVOICE", 196, 18, { align: "right" });
  doc.setFontSize(10);
  doc.text(`# ${invoice.number}`, 196, 25, { align: "right" });

  // Meta
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(10);
  const issued = new Date(invoice.issued_at).toLocaleDateString("en-GB");
  const due = invoice.due_at ? new Date(invoice.due_at).toLocaleDateString("en-GB") : "—";
  doc.text(`Issued: ${issued}`, 14, 48);
  doc.text(`Due: ${due}`, 14, 54);
  doc.text(`Status: ${invoice.status.toUpperCase()}`, 14, 60);

  // Bill to
  doc.setFont("helvetica", "bold").setFontSize(11);
  doc.text("Bill To:", 130, 48);
  doc.setFont("helvetica", "normal").setFontSize(10);
  const name = customer?.full_name || app?.full_name || "—";
  const phone = customer?.phone || app?.phone || "";
  const email = customer?.email || app?.email || "";
  doc.text(name, 130, 54);
  if (phone) doc.text(phone, 130, 60);
  if (email) doc.text(email, 130, 66);

  // Items table
  autoTable(doc, {
    startY: 80,
    head: [["#", "Description", "Qty", "Price", "Total"]],
    body: invoice.items.map((it, i) => [
      String(i + 1),
      it.description,
      String(it.qty),
      `${Number(it.price).toFixed(2)} ${invoice.currency}`,
      `${(Number(it.price) * Number(it.qty)).toFixed(2)} ${invoice.currency}`,
    ]),
    theme: "striped",
    headStyles: { fillColor: [42, 26, 15], textColor: [212, 175, 55], fontStyle: "bold" },
    styles: { fontSize: 10, cellPadding: 4 },
  });

  // Totals
  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  doc.setFontSize(10);
  doc.text(`Subtotal: ${Number(invoice.subtotal).toFixed(2)} ${invoice.currency}`, 196, finalY, { align: "right" });
  doc.text(`Tax: ${Number(invoice.tax).toFixed(2)} ${invoice.currency}`, 196, finalY + 6, { align: "right" });
  doc.setFont("helvetica", "bold").setFontSize(13).setTextColor(42, 26, 15);
  doc.text(`TOTAL: ${Number(invoice.total).toFixed(2)} ${invoice.currency}`, 196, finalY + 16, { align: "right" });

  if (invoice.notes) {
    doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(80, 80, 80);
    doc.text("Notes:", 14, finalY + 30);
    doc.text(doc.splitTextToSize(invoice.notes, 180), 14, finalY + 36);
  }

  // Footer
  doc.setFontSize(8).setTextColor(150, 150, 150);
  doc.text("Thank you for choosing NoorVisa — noorvisa.lovable.app", 105, 285, { align: "center" });

  doc.save(`${invoice.number}.pdf`);
}
