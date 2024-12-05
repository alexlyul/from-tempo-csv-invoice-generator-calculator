import {z} from "zod";

export const SchemaInvoiceToData = z.object({
    name: z.string(),
    address: z.string(),
    floor: z.string(),
    city: z.string(),
    postalCode: z.string(),
    email: z.string(),
});

export type IInvoiceToData = z.infer<typeof SchemaInvoiceToData>