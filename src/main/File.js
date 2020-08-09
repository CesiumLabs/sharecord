const path = require("path");
const fs = require("fs");

class ShareCordFile {
    constructor(fpath) {
        this.path = fpath;
        this.name = path.basename(this.path);
        this.ext = path.extname(this.path);

        const lstat = fs.lstatSync(this.path);
        this.size = lstat.size;
        this.createdAt = lstat.birthtimeMs;
    }

    get id () {
        return Buffer.from(`${this.name}:${this.size}:${this.createdAt}`);
    }
}

module.exports = ShareCordFile;

// module.exports = {
//     async get (fpath) {
//         const lstat = await fs.promises.lstat(fpath);
//         return {
//             name: path.basename(fpath),
//             ext: path.extname(fpath),
//             ...lstat,
//             async read () {
//                 const data = await fs.promises.readFile(fpath);
//                 return data;
//             }
//         }
//     },
    // create: fs.promises.writeFile,
    // Buffer: {
    //     compose (slices) {
    //         const bulk = slices.map(x => Buffer.from(x.data).toString()).join("");
    //         return Buffer.from(bulk, "base64");
    //     },
    //     decompose (buffer) {
    //         const base64 = buffer.toString("base64");
    //         const slices = base64.match(/.{1,500000}/g);
    //         return slices.map((x, i) => {
    //             const xBuff = Buffer.from(x);
    //             return {
    //                 part: i,
    //                 data: xBuff,
    //                 size: x.length
    //             }
    //         });
    //     }
    // }
// };