import puppeteer, {PaperFormat} from "puppeteer";
import {FileService} from "./FileService";

export interface IPdfConfig {
    htmlFile: string,
    outputPath: string,
    format: PaperFormat | null,
}


export default class PdfService {
    protected static fileService = new FileService("PdfService");

    static async genPdfFromHtmlFiles(...config: IPdfConfig[]) {
        console.log('[PdfService#genPdfFromHtmlFiles] Generating PDFs from HTML files');

        const browser = await puppeteer.launch();
        try {
            const page = await browser.newPage();

            for (const { htmlFile, outputPath, format } of config) {
                try {
                    await page.goto(`file:///${htmlFile}`, {
                        waitUntil: "networkidle0"
                    });

                    const pdfFile = await page.pdf({format: format || undefined});
                    await this.fileService.writeFile(outputPath, pdfFile);
                } catch (e) {
                    console.error(`Error generating PDF from "${htmlFile}" to: "${outputPath}" ${e}`);
                    throw e;
                }
            }

            console.log("[PdfService#genPdfFromHtmlFiles] PDFs generated successfully");
        } finally {
            console.log("[PdfService#genPdfFromHtmlFiles] closing browser");
            await browser.close();
        }
    }
}
