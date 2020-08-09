import path from "path";
import fs from "fs";

export default class ShareCordFile {
    path: string;
    name: string;
    ext: string;
    size: number;
    createdAt: number;

    constructor(fpath: string) {
        this.path = fpath;
        this.name = path.basename(this.path);
        this.ext = path.extname(this.path);

        const lstat = fs.lstatSync(this.path);
        this.size = lstat.size;
        this.createdAt = lstat.birthtimeMs;
    }

    get id (): string {
        return Buffer.from(`${this.name}:${this.size}:${this.createdAt}`).toString();
    }
}