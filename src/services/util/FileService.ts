import fs from "node:fs/promises";

export class FileService {
    constructor(protected errorPrefix: string) {}

    async readFile(filePath: string): Promise<string> {
        if (!filePath) throw new Error(`[${this.errorPrefix}] File path cannot be empty`);
        try {
            console.log(`[${this.errorPrefix} >> FileService.readFile] Reading file: "${filePath}"`);
            return await fs.readFile(filePath, 'utf-8');
        } catch (error) {
            const errorMessage = this.formatError('readFile', filePath, error);
            console.error(errorMessage);
            throw new Error(errorMessage);
        }
    }


    async writeFile(filePath: string, content: string | Uint8Array): Promise<void> {
        if (!filePath) throw new Error(`[${this.errorPrefix}] File path cannot be empty`);
        try {
            console.log(`[${this.errorPrefix} >> FileService.writeFile] Writing file: "${filePath}"`);
            await fs.writeFile(filePath, content, { encoding: typeof content === 'string' ? 'utf-8' : undefined, flag: 'w' });
        } catch (error) {
            const errorMessage = this.formatError('writeFile', filePath, error);
            console.error(errorMessage);
            throw new Error(errorMessage);
        }
    }

    /**
     * Creates a directory and its parent directories if they don't exist.
     * @param dirPath Path to the directory to create.
     * @throws An error if the directory cannot be created.
     */
    async createDir(dirPath: string): Promise<void> {
        if (!dirPath) throw new Error(`[${this.errorPrefix}] Directory path cannot be empty`);
        try {
            console.log(`[${this.errorPrefix} >> FileService.createDir] Creating directory: "${dirPath}"`);
            await fs.mkdir(dirPath, { recursive: true });
        } catch (error) {
            const errorMessage = this.formatError('createDir', dirPath, error);
            console.error(errorMessage);
            throw new Error(errorMessage);
        }
    }


    private formatError(methodName: string, path: string, error: unknown): string {
        const errorMessage = (error as Error)?.message || 'Unknown error';
        return `[${this.errorPrefix} >> FileService.${methodName}] Error processing "${path}": ${errorMessage}`;
    }
}
