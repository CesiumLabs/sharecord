"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Base_1 = __importDefault(require("./Base"));
var Utils_1 = require("./Utils");
var socket_io_client_1 = __importDefault(require("socket.io-client"));
var ShareCordReceiver = /** @class */ (function (_super) {
    __extends(ShareCordReceiver, _super);
    function ShareCordReceiver(base) {
        return _super.call(this, base) || this;
    }
    ShareCordReceiver.prototype.connectServer = function (address, port) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var socket = socket_io_client_1.default("http://" + address + ":" + port + "?user=" + encodeURIComponent(_this.id));
            socket.on("connect", function () {
                _this.socket = socket;
                _this.address = { address: address, port: port };
                resolve();
            });
            socket.on("error", function (error) {
                if (error === Utils_1.CONSTANTS.ERRORS.ANONYMOUS_USER ||
                    error === Utils_1.CONSTANTS.ERRORS.INVALID_USER)
                    reject("Couldn't Establish Connection to " + address + ":" + port + ". Reason: " + error);
            });
        });
    };
    ShareCordReceiver.prototype.destroy = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.socket)
                _this.socket.close();
            delete _this.socket;
            resolve();
        });
    };
    return ShareCordReceiver;
}(Base_1.default));
exports.default = ShareCordReceiver;
