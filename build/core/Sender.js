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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShareCordSender = void 0;
var Base_1 = require("./Base");
var Utils_1 = require("./Utils");
var http_1 = __importDefault(require("http"));
var express_1 = __importDefault(require("express"));
var socket_io_1 = __importDefault(require("socket.io"));
var http_terminator_1 = __importDefault(require("http-terminator"));
var ShareCordSender = /** @class */ (function (_super) {
    __extends(ShareCordSender, _super);
    function ShareCordSender(base) {
        var _this = _super.call(this, base) || this;
        _this.filesMap = new Map();
        _this.usersMap = new Map();
        return _this;
    }
    ShareCordSender.prototype.startServer = function (options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (options.password)
                _this.password = options.password;
            var app = express_1.default();
            var server = http_1.default.createServer(app);
            var socket = socket_io_1.default(server);
            socket.use(function (socketUser, next) {
                var id = socketUser.handshake.query.user ? decodeURIComponent(socketUser.handshake.query.user) : null;
                if (!id)
                    return next(new Error(Utils_1.CONSTANTS.ERRORS.ANONYMOUS_USER));
                var userRaw = Utils_1.parseID(id);
                if (!userRaw)
                    return next(new Error(Utils_1.CONSTANTS.ERRORS.INVALID_USER));
                socketUser.user = new Base_1.ShareCordUser(__assign(__assign({}, userRaw), { socketID: socketUser.id }));
                return next();
            });
            socket.on("connection", function (socketUser) {
                if (!socketUser.user)
                    return socketUser.disconnect();
                _this.usersMap.set(socketUser.user.id, socketUser.user);
                _this.emit("userConnect", socketUser.user, _this);
                socket.on(Utils_1.CONSTANTS.SOCKET.FILES_GET, function () {
                    socket.emit(Utils_1.CONSTANTS.SOCKET.FILES_POST, _this.files);
                    _this.emit("filesDispatch", socketUser.user, _this);
                });
                socket.on("disconnect", function () {
                    if (socketUser.user) {
                        _this.usersMap.delete(socketUser.user.id);
                        _this.emit("userDisconnect", socketUser.user, _this);
                    }
                });
            });
            app.use(function (req, res, next) {
                var id = req.query.user && typeof req.query.user === "string" ? req.query.user : null;
                if (!id)
                    return res.end(Utils_1.CONSTANTS.ERRORS.ANONYMOUS_USER);
                var user = Utils_1.parseID(id);
                if (!user)
                    return res.end(Utils_1.CONSTANTS.ERRORS.INVALID_USER);
                req.user = new Base_1.ShareCordUser(user);
                return next();
            });
            app.get("/files/:id", function (req, res) {
                if (!req.user)
                    return res.end(Utils_1.CONSTANTS.ERRORS.ANONYMOUS_USER);
                var id = req.params.id;
                var file = _this.filesMap.get(id) || null;
                if (!file)
                    return res.end(Utils_1.CONSTANTS.ERRORS.NO_CONTENT);
                _this.emit("fileDownload", req.user.user);
                res.download(file.path);
            });
            server.listen(options.port, options.address, function () {
                _this.server = server;
                _this.app = app;
                _this.socket = socket;
                var address = server.address();
                // @ts-ignore
                _this.address = address && address.address && address.port ? { address: address.address, port: address.port } : null;
                _this.emit("serverStarted", _this);
                resolve();
            });
        });
    };
    ShareCordSender.prototype.addFile = function (filesRaw) {
        var _this = this;
        if (!filesRaw)
            throw new Error("Missing Parameter: file");
        var files = Array.isArray(filesRaw) ? filesRaw : [filesRaw];
        files.forEach(function (file) { return _this.filesMap.set(file.id, file); });
        if (this.socket)
            this.socket.emit("PATCH Files", this.files);
        this.emit("filesAdded", files, this);
    };
    ShareCordSender.prototype.removeFile = function (filesRaw) {
        var _this = this;
        if (!filesRaw)
            throw new Error("Missing Parameter: file");
        var files = Array.isArray(filesRaw) ? filesRaw : [filesRaw];
        files.forEach(function (file) { return _this.filesMap.delete(file.id); });
        if (this.socket)
            this.socket.emit("PATCH Files", this.files);
        this.emit("filesRemoved", files, this);
    };
    ShareCordSender.prototype.destroy = function () {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var terminator;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        delete this.app;
                        if (this.socket)
                            this.socket.close();
                        delete this.socket;
                        delete this.address;
                        delete this.sender;
                        if (!this.server) return [3 /*break*/, 2];
                        terminator = http_terminator_1.default.createHttpTerminator({ server: this.server });
                        return [4 /*yield*/, terminator.terminate()];
                    case 1:
                        _a.sent();
                        delete this.server;
                        _a.label = 2;
                    case 2:
                        resolve();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    Object.defineProperty(ShareCordSender.prototype, "isPrivate", {
        get: function () {
            return !!this.password;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShareCordSender.prototype, "files", {
        get: function () {
            return Object.values(this.filesMap);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShareCordSender.prototype, "users", {
        get: function () {
            return Object.values(this.usersMap);
        },
        enumerable: false,
        configurable: true
    });
    return ShareCordSender;
}(Base_1.ShareCordUser));
exports.ShareCordSender = ShareCordSender;
