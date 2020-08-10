"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERSION = void 0;
var Base_1 = require("./core/Base");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return Base_1.ShareCordUser; } });
var Receiver_1 = require("./core/Receiver");
Object.defineProperty(exports, "Receiver", { enumerable: true, get: function () { return Receiver_1.ShareCordReceiver; } });
var Sender_1 = require("./core/Sender");
Object.defineProperty(exports, "Sender", { enumerable: true, get: function () { return Sender_1.ShareCordSender; } });
var File_1 = require("./core/File");
Object.defineProperty(exports, "File", { enumerable: true, get: function () { return File_1.ShareCordFile; } });
exports.Utils = __importStar(require("./core/Utils"));
var pkg = require("../package.json");
exports.VERSION = pkg.version;
