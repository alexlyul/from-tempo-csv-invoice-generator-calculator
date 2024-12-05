import {z} from "zod";
import {SchemaInvoiceFromData} from "./SchemaInvoiceFromData";
import {SchemaInvoiceToData} from "./SchemaInvoiceToData";
import {SchemaInvoiceServiceItem} from "./SchemaInvoiceServiceItem";

export const SchemaConfiguration = z.object({
    dateIssued: z.string(),
    startDate: z.date(),
    endDate: z.date(),

    invoiceNumber: z.number(),
    invoiceTitle: z.string(),

    from: SchemaInvoiceFromData,
    to: SchemaInvoiceToData,

    emailData: z.object({
        to: z.array(z.string().email()),
        title: z.string(),
        body: z.string(),
    }),

    services: z.array(SchemaInvoiceServiceItem),
    totalAmountPaid: z.number(),
});

export type IConfiguration = z.infer<typeof SchemaConfiguration>;