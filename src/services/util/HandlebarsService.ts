import {FileService} from "./FileService";
import * as Handlebars from "handlebars";


interface IHandlebarsConfig {
    srcTemplateString?: string;
    srcTemplatePath?: string;
    outHtmlPath?: string;
    data: Record<string, unknown>;
}

export default class HandlebarsService {
    constructor(private errorPrefix: string) {}

    protected fileService = new FileService("HandlebarsService");

    async genHandlebarTemplate(config: IHandlebarsConfig): Promise<string> {
        let handlebarsTemplate: unknown;
        try {
            if (!config.srcTemplateString && !config.srcTemplatePath) throw new Error("No template provided");
            const template = config.srcTemplateString || await this.fileService.readFile(config.srcTemplatePath!);
            handlebarsTemplate = Handlebars.compile(template);
        } catch (e) {
            console.error(`[${this.errorPrefix} HandlebarsServiceService#genHibernateConfigFile]`, {config});
            throw new Error(`Error generating HandlebarsService template: ${(e as Error).message}`);
        }

        let handlebarsOutputHtml: string;
        try {
            handlebarsOutputHtml = (handlebarsTemplate as (...data: unknown[])=> string)(config.data);
        } catch (e) {
            console.error(`[${this.errorPrefix} HandlebarsServiceService#genHibernateConfigFile]`, {config});
            throw e;
        }

        if (config.outHtmlPath) {
            await this.fileService.writeFile(config.outHtmlPath, handlebarsOutputHtml);
        }

        return handlebarsOutputHtml;
    }
}
