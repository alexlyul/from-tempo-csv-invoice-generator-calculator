import {z} from "zod";

export const SchemaInvoiceFromData = z.object({
    name: z.string(),
    nameSub: z.string().optional(),
    address: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string(),
    taxNumber: z.string(),
    iban: z.string(),
    bic: z.string(),
});

export type IInvoiceFromData = z.infer<typeof SchemaInvoiceFromData>;