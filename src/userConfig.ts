import {ordinalSuffixOf} from "./common/utils/ordinalSuffixOf";
import {differenceInMonths, formatDate, parse} from "date-fns";
import {IConfigurationUserInput} from "./common/schemas/SchemaConfigurationUserInput";


const userConfig: IConfigurationUserInput = {
    invoiceIssueDate: new Date(),

    getInvoiceNumber: ({invoiceEndDate}) => {
        const firstInvoiceStr = 'Jun 4, 2020, 5:09PM';
        const firstInvoice = parse(firstInvoiceStr, 'MMM d, yyyy, h:mma', new Date());
        return differenceInMonths(invoiceEndDate, firstInvoice) + 2;
    },

    getInvoiceTitle: ({invoiceEndDate}) => `COMPANY-${formatDate(invoiceEndDate, "yyyy-MM")}`,

    emailConfig: {
        to: [
            'company.invoices@company.de',
            'technical.leader@company.de'
        ],
        getTitle: ({invoiceNumber, invoiceTitle}) => `Invoice ${invoiceTitle}, from Mysterious John, ${ordinalSuffixOf(invoiceNumber)} invoice`,
        getBody: ({invoiceNumber}) => {
            return 'Dear Sir/Madam,\n' +
                '\n' +
                `In the attachments, you can find the ${ordinalSuffixOf(invoiceNumber)} invoice.\n` +
                '\n' +
                'Best regards,\n' +
                'Mysterious John';
        },
    },

    invoice: {
        from: {
            name: "MYSTERIOUS JOHN",
            nameSub: "ФОП МІСТЕРІОС ДЖОН",
            address: "Unbekannt Srasse, 88A, 664",
            city: "Odesa",
            postalCode: "65009",
            country: "Ukraine",
            taxNumber: "3662244222",
            iban: "UA000000001345670000000000000",
            bic: "PBANUA2X"
        },
        to: {
            name: "Company GmbH",
            address: "Hubert-Weinhäuser-Straße 73",
            floor: "13th floor",
            city: "Stuttgart",
            postalCode: "81845",
            email: "info@company.de"
        },
    },

    getServices: ({periodStartDate, periodEndDate}) => {
        return [
            {
                type: "Company Projects – development",
                period: `${formatDate(periodStartDate, "MMM dd")} - ${formatDate(periodEndDate, "MMM dd")}`,
                hourlyRate: 777,
                hours: 0,
                total: 0,
            },
        ]
    },
};

export default userConfig;