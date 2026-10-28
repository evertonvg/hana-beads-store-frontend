import type { z } from "zod";
import { newsletterSchema } from "./newsletter";

/** Signed-out "AVISE-ME": e-mail plus an explicit consent, same fields and messages as the newsletter. */
export const stockAlertSchema = newsletterSchema;

export type StockAlertInput = z.infer<typeof stockAlertSchema>;
