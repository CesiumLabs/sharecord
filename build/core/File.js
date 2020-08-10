"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShareCordFile = void 0;
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var ShareCordFile = /** @class */ (function () {
    function ShareCordFile(fpath) {
        this.path = fpath;
        this.name = path_1.default.basename(this.path);
        this.ext = path_1.default.extname(this.path);
        var lstat = fs_1.default.lstatSync(this.path);
        this.size = lstat.size;
        this.createdAt = lstat.birthtimeMs;
    }
    Object.defineProperty(ShareCordFile.prototype, "id", {
        get: function () {
            return Buffer.from(this.name + ":" + this.size + ":" + this.createdAt).toString();
        },
        enumerable: false,
        configurable: true
    });
    return ShareCordFile;
}());
exports.ShareCordFile = ShareCordFile;
