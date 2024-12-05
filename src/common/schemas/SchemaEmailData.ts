import {z} from "zod";

export const SchemaEmailData = z.object({
    to: z.array(z.string().email()),
    getTitle: z.function()
        .args(
            z.object({
                invoiceNumber: z.number().nonnegative('Invoice number must be non-negative'),
                invoiceTitle: z.string().nonempty('Invoice title must be non-empty'),
            })
        )
        .returns(z.string()), //takes invoice number as a single argument
    getBody: z.function()
        .args(
            z.object({
                invoiceNumber: z.number().nonnegative('Invoice number must be non-negative'),
            })
        )
        .returns(z.string()), //takes invoice number as a single argument
});

export type IEmailData =  z.infer<typeof SchemaEmailData>;