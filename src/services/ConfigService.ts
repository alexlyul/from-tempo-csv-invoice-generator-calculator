import {formatDate} from "date-fns";
import Decimal from "decimal.js-light";
import {z} from "zod";
import type {IConfigurationUserInput} from "../common/schemas/SchemaConfigurationUserInput";
import {SchemaConfigurationUserInput} from "../common/schemas/SchemaConfigurationUserInput";
import {SchemaConfiguration, IConfiguration} from "../common/schemas/SchemaConfiguration";
import {ISchemaInvoiceServiceItem} from "../common/schemas/SchemaInvoiceServiceItem";


export default class ConfigService {
    protected period: { start: Date, end: Date } | null = null;
    protected totalHours: number | null = null;
    protected userConfig: IConfigurationUserInput;


    constructor(userConfig: IConfigurationUserInput) {
        this.userConfig = SchemaConfigurationUserInput.parse(userConfig) as IConfigurationUserInput;
    }

    setPeriod(start: Date, end: Date) {
        this.period = z.object({
            start: z.date(),
            end: z.date(),
        }).parse({start, end});
        return this;
    }

    setTotalHours(totalHours: number) {
        this.totalHours = z
            .number().nonnegative().min(1, "Min 1 hour required").max(190, "Max 190 hours")
            .parse(totalHours);
        return this;
    }

    protected get configBase(): IConfiguration {
        if (!this.period) throw new Error("Period is not set");
        if (this.totalHours === null) throw new Error("Total hours is not set");

        const invoiceNumber = this.userConfig.getInvoiceNumber({
            invoiceStartDate: this.period.start,
            invoiceEndDate: this.period.end,
        });
        const invoiceTitle = this.userConfig.getInvoiceTitle({
            invoiceStartDate: this.period.start,
            invoiceEndDate: this.period.end,
        });
        const emailTitle = this.userConfig.emailConfig.getTitle({
            invoiceNumber,
            invoiceTitle: this.userConfig.getInvoiceTitle({
                invoiceStartDate: this.period.start,
                invoiceEndDate: this.period.end,
            })
        });
        const emailBody = this.userConfig.emailConfig.getBody({invoiceNumber});
        const dateIssued = formatDate(this.userConfig.invoiceIssueDate, "dd MMM yyyy");
        const services = this.userConfig.getServices({
            periodStartDate: this.period.start,
            periodEndDate: this.period.end,
        });

        return {
            startDate: this.period.start,
            endDate: this.period.end,
            dateIssued: dateIssued,

            invoiceNumber: invoiceNumber,
            invoiceTitle: invoiceTitle,

            services: services,

            emailData: {
                to: this.userConfig.emailConfig.to,
                title: emailTitle,
                body: emailBody,
            },

            totalAmountPaid: 0,

            to: this.userConfig.invoice.to,
            from: this.userConfig.invoice.from,
        }
    }

    get config(): IConfiguration {
        const servicesFinal: ISchemaInvoiceServiceItem[] = [];
        let totalAmountPaid = new Decimal(0);

        for (const service of this.configBase.services) {
            const total = new Decimal(this.totalHours!).mul(service.hourlyRate);
            totalAmountPaid = totalAmountPaid.add(total);

            //@todo: is only one service item supported
            servicesFinal.push({
                ...service,
                hours: this.totalHours!,
                total: total.toNumber(),
            });
        }

        const schema = SchemaConfiguration.parse({
            ...this.configBase,
            services: servicesFinal,
            totalAmountPaid: totalAmountPaid.toNumber(),
        });

        return schema;
    }
}
