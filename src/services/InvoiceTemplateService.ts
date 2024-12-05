import {IConfiguration} from "./ConfigService";
import HandlebarsService from "./util/HandlebarsService";

export default class InvoiceTemplateService {
    protected static handlebarsService = new HandlebarsService('InvoiceTemplateService');

    static async generateInvoiceFromTemplate(config: {
        srcTemplateFilePath: string,
        inputData: IConfiguration,
        outputHtmlFilePath?: string,
    }): Promise<string> {
        return this.handlebarsService.genHandlebarTemplate({
            srcTemplatePath: config.srcTemplateFilePath,
            outHtmlPath: config.outputHtmlFilePath,
            data: config.inputData,
        });
    }
}
