import {z} from "zod";

export const SchemaUserConfigYaml = z.object({
    firstInvoiceDate: z.string(),
    invoiceTitlePrefix: z.string(),
    emailConfig: z.object({
        to: z.array(z.string().email()),
        senderDisplayName: z.string(),
        greeting: z.string(),
        signature: z.string(),
    }),
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
    service: z.object({
        type: z.string(),
        hourlyRate: z.number(),
        hours: z.number(),
    }),
});
