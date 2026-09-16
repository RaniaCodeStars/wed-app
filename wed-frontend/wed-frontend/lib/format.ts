// lib/format.ts

export function formatPrice(price: number): string {
  return `${price.toLocaleString("fr-FR")} د.ج`;
}

// Miroir exact de la regex backend (backend/app/schemas/schemas.py : PHONE_REGEX)
export const PHONE_REGEX = /^0[567]\d{8}$/;

export function isValidAlgerianPhone(phone: string): boolean {
  return PHONE_REGEX.test(phone.trim().replace(/\s/g, ""));
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ar-DZ", { year: "numeric", month: "long", day: "numeric" });
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكدة",
  shipped: "تم الشحن",
  delivered: "تم التسليم",
  returned: "مرتجعة",
  cancelled: "ملغاة",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  returned: "bg-orange-50 text-orange-700 border-orange-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};
