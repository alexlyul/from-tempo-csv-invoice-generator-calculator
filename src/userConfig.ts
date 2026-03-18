import {ordinalSuffixOf} from "./common/utils/ordinalSuffixOf";
import {differenceInMonths, formatDate, parse} from "date-fns";
import {IConfigurationUserInput} from "./common/schemas/SchemaConfigurationUserInput";
import {readFileSync} from "fs";
import {join} from "path";
import {load} from "js-yaml";
import {SchemaUserConfigYaml} from "./common/schemas/SchemaUserConfigYaml";


const configYamlPath = join(__dirname, "..", "config.yaml");
const configYamlRaw = readFileSync(configYamlPath, "utf-8");
const configYamlData = SchemaUserConfigYaml.parse(load(configYamlRaw));

const userConfig: IConfigurationUserInput = {
    invoiceIssueDate: new Date(),

    getInvoiceNumber: ({invoiceEndDate}) => {
        const firstInvoice = parse(configYamlData.firstInvoiceDate, "MMM d, yyyy, h:mma", new Date());
        return differenceInMonths(invoiceEndDate, firstInvoice) + 2;
    },

    getInvoiceTitle: ({invoiceEndDate}) => `${configYamlData.invoiceTitlePrefix}-${formatDate(invoiceEndDate, "yyyy-MM")}`,

    emailConfig: {
        to: configYamlData.emailConfig.to,
        getTitle: ({invoiceNumber, invoiceTitle}) => `Invoice ${invoiceTitle}, from ${configYamlData.emailConfig.senderDisplayName}, ${ordinalSuffixOf(invoiceNumber)} invoice`,
        getBody: ({invoiceNumber}) => {
            return `${configYamlData.emailConfig.greeting}\n` +
                '\n' +
                `In the attachments, you can find the ${ordinalSuffixOf(invoiceNumber)} invoice.\n` +
                '\n' +
                'Best regards,\n' +
                configYamlData.emailConfig.signature;
        },
    },

    invoice: configYamlData.invoice,

    getServices: ({periodStartDate, periodEndDate}) => {
        return [
            {
                type: configYamlData.service.type,
                period: `${formatDate(periodStartDate, "MMM dd")} - ${formatDate(periodEndDate, "MMM dd")}`,
                hourlyRate: configYamlData.service.hourlyRate,
                hours: configYamlData.service.hours,
                total: configYamlData.service.hourlyRate * configYamlData.service.hours,
            },
        ]
    },
};

export default userConfig;
