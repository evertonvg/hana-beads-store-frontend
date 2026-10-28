import { formatPhone as formatBrPhone } from "@brazilian-utils/brazilian-utils";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

export {
  formatCep,
  formatCpf,
  isValidCep,
  isValidCpf,
  isValidPhone,
} from "@brazilian-utils/brazilian-utils";

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/**
 * Formats a Brazilian phone with DDD. The library's default mask ("sn") drops the last digit
 * of DDD-prefixed numbers, so `"auto"` is required.
 */
export function formatPhone(value: string): string {
  return formatBrPhone(value, { mask: "auto" });
}

/** Keeps only the digits of a string (strips masks such as CPF, CEP or phone punctuation). */
export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** Formats cents as BRL, or the `[PREÇO]` placeholder when there is no price. */
export function formatPrice(cents: number | null): string {
  if (cents === null) return "[PREÇO]";
  return brl.format(cents / 100).replaceAll(" ", " ");
}

/** Formats cents as BRL, or the `[VALOR]` placeholder when there is no total. */
export function formatTotal(cents: number | null): string {
  if (cents === null) return "[VALOR]";
  return formatPrice(cents);
}

/** Formats an ISO date in pt-BR, or the `[00/00/0000]` placeholder when there is no date. */
export function formatDate(iso: string | null, pattern = "dd/MM/yyyy"): string {
  if (iso === null) return "[00/00/0000]";
  return format(parseISO(iso), pattern, { locale: ptBR });
}

/** Formats an order number for display, e.g. `"0005"` becomes `"#0005"`. */
export function formatOrderNumber(n: string): string {
  return `#${n}`;
}
