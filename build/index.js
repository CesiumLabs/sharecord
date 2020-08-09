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
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ShareCordUser = __importStar(require("./core/Base"));
var ShareCordReceiver = __importStar(require("./core/Receiver"));
var ShareCordSender = __importStar(require("./core/Sender"));
var ShareCordFile = __importStar(require("./core/File"));
var ShareCordUtils = __importStar(require("./core/Utils"));
var ShareCord = {
    User: ShareCordUser,
    Receiver: ShareCordReceiver,
    Sender: ShareCordSender,
    File: ShareCordFile,
    Utils: ShareCordUtils
};
exports.default = ShareCord;
module.exports = ShareCord; /* CommonJS */
