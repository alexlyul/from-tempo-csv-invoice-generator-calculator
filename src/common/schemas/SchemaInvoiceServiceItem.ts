import {z} from "zod";

export const SchemaInvoiceServiceItem = z.object({
    type: z.string(),
    period: z.string(),
    hourlyRate: z.number().or(z.literal('-')),
    hours: z.number(),
    total: z.number(),
});

export type ISchemaInvoiceServiceItem = z.infer<typeof SchemaInvoiceServiceItem>;
