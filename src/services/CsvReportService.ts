import { parse } from "date-fns";
import { FileService } from "./util/FileService";
import HandlebarsService from "./util/HandlebarsService";

interface ICsvData extends Record<string, unknown> {
    rows: string[];
    tableHeaderRow: string[];
    tableBodyRows: string[][];
    totalHoursCell: string;
    startDate: string;
    endDate: string;
}

export default class CsvReportService {
    protected readonly fileService = new FileService("CsvReportProcessor");
    protected readonly handlebarsService = new HandlebarsService("CsvReportProcessor");
    protected csv: string | null = null;
    protected csvData: ICsvData | null = null;

    protected readonly srcCsvFilePath: string;
    protected readonly outputTimesheetFilePath: string;
    protected readonly handlebarsTemplatePath: string;

    constructor(config: {
        srcCsvFilePath: string;
        outputHtmlTimesheetFilePath: string;
        srcHandlebarsTemplatePath: string;
    }) {
        this.srcCsvFilePath = config.srcCsvFilePath;
        this.outputTimesheetFilePath = config.outputHtmlTimesheetFilePath;
        this.handlebarsTemplatePath = config.srcHandlebarsTemplatePath;
    }

    async init() {
        try {
            this.csv = await this.fileService.readFile(this.srcCsvFilePath);
            this.parseCsvTableInternal();
        } catch (error) {
            throw new Error(`Failed to initialize CSV report service: ${(error as Error).message}`);
        }
        return this;
    }

    getDataFromCsv(): {
        totalHours: number;
        startDate: Date;
        endDate: Date;
    } {
        if (!this.csvData) throw new Error("CSV data has not been initialized");

        const { totalHoursCell, startDate, endDate } = this.csvData;

        return {
            totalHours: parseFloat(totalHoursCell),
            startDate: parse(startDate, "dd/MMM/yy", new Date()),
            endDate: parse(endDate, "dd/MMM/yy", new Date()),
        };
    }

    protected parseCsvTableInternal() {
        if (!this.csv) throw new Error("No CSV data provided");

        const parsedRows = this.parseCsvRows(this.csv).filter(row => row.some(cell => cell.trim() !== ""));
        const rows = parsedRows.map(row => row.join(","));

        if (parsedRows.length < 2) {
            throw new Error("Invalid CSV format: Not enough rows to parse");
        }

        const tableHeaderRow = parsedRows[0];
        const tableBodyRows = parsedRows.slice(1);
        const lastRow = tableBodyRows.at(-1);

        if (!lastRow || lastRow.length < 5) {
            throw new Error("Invalid CSV format: Missing required columns in the last row");
        }

        const totalHoursCell = lastRow[3];
        const startDate = tableHeaderRow[4] || "";
        const endDate = tableHeaderRow.at(-1) || "";

        if (!totalHoursCell || !startDate || !endDate) {
            throw new Error("Invalid CSV format: Missing required data: " + JSON.stringify({ totalHoursCell, startDate, endDate }));
        }

        this.csvData = {
            rows,
            tableHeaderRow,
            tableBodyRows,
            totalHoursCell,
            startDate,
            endDate,
        };
    }

    protected parseCsvRows(csv: string): string[][] {
        const rows: string[][] = [];
        let currentRow: string[] = [];
        let currentCell = "";
        let inQuotes = false;

        for (let i = 0; i < csv.length; i++) {
            const char = csv[i];
            const nextChar = csv[i + 1];

            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    currentCell += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
                continue;
            }

            if (char === "," && !inQuotes) {
                currentRow.push(currentCell);
                currentCell = "";
                continue;
            }

            if ((char === "\n" || char === "\r") && !inQuotes) {
                if (char === "\r" && nextChar === "\n") {
                    i++;
                }

                currentRow.push(currentCell);
                rows.push(currentRow);
                currentRow = [];
                currentCell = "";
                continue;
            }

            currentCell += char;
        }

        if (currentCell.length > 0 || currentRow.length > 0) {
            currentRow.push(currentCell);
            rows.push(currentRow);
        }

        return rows;
    }

    async generateTimesheet(): Promise<string> {
        if (!this.csvData) throw new Error("No CSV data provided");

        try {
            return await this.handlebarsService.genHandlebarTemplate({
                srcTemplatePath: this.handlebarsTemplatePath,
                outHtmlPath: this.outputTimesheetFilePath,
                data: this.csvData,
            });
        } catch (error) {
            throw new Error(`Failed to generate timesheet: ${(error as Error).message}`);
        }
    }
}
