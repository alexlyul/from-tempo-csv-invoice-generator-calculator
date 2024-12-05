import path from "node:path";
import InvoiceTemplateService from "./services/InvoiceTemplateService";
import CsvReportService from "./services/CsvReportService";
import ConfigService from "./services/ConfigService";
import PdfService from "./services/util/PdfService";
import EmailService from "./services/EmailService";
import {FileService} from "./services/util/FileService";
import { platform } from 'node:os';
import { exec } from 'node:child_process';
import userConfig from "./userConfig";
import {IConfigurationUserInput} from "./common/schemas/SchemaConfigurationUserInput";


const TEMPLATES_PATHS = {
    invoice: {
        srcHbsTemplate: path.join(__dirname, '../src/templates/template-tax-invoice.hbs'),
        outHtmlPath: path.join(__dirname, '../dist-templates/invoice.temp.html'),
        outPdfPath: (folderName: string, month: string, year: string) => path.join(__dirname, `../dist-templates/mail/${folderName}/Tax Invoice - Alexander Lyulko - ${month} ${year}.pdf`),
    },
    timesheet: {
        srcHbsTemplate: path.join(__dirname, '../src/templates/template-timsheet-table.hbs'),
        outHtmlPath: path.join(__dirname, '../dist-templates/timesheet.temp.html'),
        outPdfPath: (folderName: string, month: string, year: string) => path.join(__dirname, `../dist-templates/mail/${folderName}/Timesheet -  Alexander Lyulko - ${month} ${year}.pdf`),
        jiraCsvReportPath: path.join(__dirname, '../src/templates/tempor-teport.csv'),
    },
    mail: {
        outTexFilePath: (folderName: string) => path.join(__dirname, `../dist-templates/mail/${folderName}/mail.html`),
    },
    outRootPath: (folderName: string) => path.join(__dirname, `../dist-templates/mail/${folderName}`),
} as const;


class App {
    protected readonly configService: ConfigService;
    protected readonly fileService = new FileService('App');

    constructor(userConfig: IConfigurationUserInput) {
        this.configService = new ConfigService(userConfig);
    }

    protected readonly config = TEMPLATES_PATHS;

    async process() {
        const csvReportProcessor = await new CsvReportService({
            srcCsvFilePath: this.config.timesheet.jiraCsvReportPath,
            outputHtmlTimesheetFilePath: this.config.timesheet.outHtmlPath,
            srcHandlebarsTemplatePath: this.config.timesheet.srcHbsTemplate,
        }).init();


        // get data from CSV
        {
            const {totalHours, startDate, endDate} = csvReportProcessor.getDataFromCsv();
            console.log(`[App#process] Parsed data: `, JSON.stringify({totalHours, startDate, endDate}, null, 2));

            this.configService
                .setPeriod(startDate, endDate)
                .setTotalHours(totalHours);
        }

        const outDirName = `${this.configService.config.startDate.getTime()}__${this.configService.config.invoiceTitle}`;
        const outDirPath = path.join(__dirname, `../dist-templates/mail/`, outDirName);
        console.log(`[App#process] Creating directory: ${outDirPath}`);
        await this.fileService.createDir(outDirPath);


        // prepare and write mail.html page
        {
            const emailPage = EmailService.renderEmailPage({
                to: this.configService.config.emailData.to,
                title: this.configService.config.emailData.title,
                body: this.configService.config.emailData.body,
            });

            console.log(`[App#process] Email prepared: \n`, emailPage);
            await this.fileService.writeFile(this.config.mail.outTexFilePath(outDirName), emailPage);
        }


        // generate invoice and timesheet .temp.html files
        {
            await csvReportProcessor.generateTimesheet();
            await InvoiceTemplateService.generateInvoiceFromTemplate({
                srcTemplateFilePath: this.config.invoice.srcHbsTemplate,
                outputHtmlFilePath: this.config.invoice.outHtmlPath,
                inputData: {...this.configService.config},
            });
        }


        // generate pdf files
        {
            const invoiceMonth = this.configService.config.startDate.toLocaleString('en', {month: 'long'});
            const invoiceYear = this.configService.config.startDate.getFullYear().toString();
            await PdfService.genPdfFromHtmlFiles(
                {
                    htmlFile: this.config.invoice.outHtmlPath,
                    outputPath: this.config.invoice.outPdfPath(outDirName, invoiceMonth, invoiceYear),
                    format: null,
                },
                {
                    htmlFile: this.config.timesheet.outHtmlPath,
                    outputPath: this.config.timesheet.outPdfPath(outDirName, invoiceMonth, invoiceYear),
                    format: "A1",
                },
            );
        }


        // open folder in browser
        {
            const urlToOpen = 'file:///' + this.config.outRootPath(outDirName).replace(/\\/g, '/');
            this.openFolderInBrowser(urlToOpen);
        }
    }

    protected openFolderInBrowser(filePathUrl: string) {
        const WINDOWS_PLATFORM = 'win32';
        const MAC_PLATFORM = 'darwin';

        const osPlatform = platform();

        let command;

        if (osPlatform === WINDOWS_PLATFORM) {
            command = `start chrome "${filePathUrl}"`;
        } else if (osPlatform === MAC_PLATFORM) {
            command = `open -a "Google Chrome" ${filePathUrl}`;
        } else {
            command = `google-chrome --no-sandbox ${filePathUrl}`;
        }

        console.log(`[App >> openFolderInBrowser] executing command: ${command}`);

        exec(command);
    }
}


new App(userConfig)
    .process()
    .then(() => console.log('[App] Done!'))
    .catch(console.error);
