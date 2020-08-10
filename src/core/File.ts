import path from "path";
import fs from "fs";

export class ShareCordFile {
    public path: string;
    public name: string;
    public ext: string;
    public size: number;
    public createdAt: number;

    constructor(fpath: string) {
        this.path = fpath;
        this.name = path.basename(this.path);
        this.ext = path.extname(this.path);

        const lstat = fs.lstatSync(this.path);
        this.size = lstat.size;
        this.createdAt = lstat.birthtimeMs;
    }

    public get id (): string {
        return Buffer.from(`${this.name}:${this.size}:${this.createdAt}`).toString();
    }
}