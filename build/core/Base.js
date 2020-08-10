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
exports.ShareCordUser = void 0;
var events_1 = require("events");
var os_1 = __importDefault(require("os"));
var ShareCordUser = /** @class */ (function (_super) {
    __extends(ShareCordUser, _super);
    function ShareCordUser(options) {
        var _this = _super.call(this) || this;
        _this.username = options.username;
        _this.discrim = options.discrim;
        _this.createdAt = options.createdAt;
        if (options.socketID)
            _this.socketID = _this.socketID;
        return _this;
    }
    Object.defineProperty(ShareCordUser.prototype, "user", {
        get: function () {
            return {
                username: this.username,
                discrim: this.discrim,
                createdAt: this.createdAt
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShareCordUser.prototype, "id", {
        get: function () {
            return encodeURIComponent(Buffer.from(JSON.stringify(this.user)).toString("base64"));
        },
        enumerable: false,
        configurable: true
    });
    ShareCordUser.prototype.getAvailableAddresses = function () {
        var ips = [];
        var connections = os_1.default.networkInterfaces();
        var networks = Object.values(connections);
        // @ts-ignore
        networks.forEach(function (net) { return ips.push.apply(ips, net); });
        return ips
            .filter(function (net) { return net.family === "IPv4" && !net.internal; })
            .map(function (net) { return ({ address: net.address, family: net.family }); });
    };
    return ShareCordUser;
}(events_1.EventEmitter));
exports.ShareCordUser = ShareCordUser;
