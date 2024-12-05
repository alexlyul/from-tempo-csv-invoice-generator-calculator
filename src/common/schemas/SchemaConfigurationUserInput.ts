import {z} from "zod";
import {SchemaEmailData} from "./SchemaEmailData";
import {SchemaInvoiceServiceItem} from "./SchemaInvoiceServiceItem";

export const SchemaConfigurationUserInput = z.object({
    invoiceIssueDate: z.date(),
    emailConfig: SchemaEmailData,

    getInvoiceNumber: z.function().args(
        z.object({
            invoiceStartDate: z.date(),
            invoiceEndDate: z.date(),
        })
    ).returns(z.number()),
    getInvoiceTitle: z.function().args(
        z.object({
            invoiceStartDate: z.date(),
            invoiceEndDate: z.date(),
        })
    ).returns(z.string()),

    invoice: z.object({
        from: z.object({
            name: z.string(),
            nameSub: z.string().optional(),
            address: z.string(),
            city: z.string(),
            postalCode: z.string(),
            country: z.string(),
            taxNumber: z.string(),
            iban: z.string(),
            bic: z.string(),
        }),
        to: z.object({
            name: z.string(),
            address: z.string(),
            floor: z.string(),
            city: z.string(),
            postalCode: z.string(),
            email: z.string().email(),
        }),
    }),

    getServices: z.function().args(
        z.object({
            periodStartDate: z.date(),
            periodEndDate: z.date(),
        })
    ).returns(z.array(SchemaInvoiceServiceItem)),
});

export type IConfigurationUserInput = z.infer<typeof SchemaConfigurationUserInput>;
