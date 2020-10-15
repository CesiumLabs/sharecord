import { ShareCordUser } from "./Base";
import { ShareCordFile } from "./File";
import {
    ShardCordUserOptions,
    ShareCordSenderServerOptions,
    ShareCordAddress,
    CONSTANTS,
    parseID
} from "./Utils";

import http from "http";
import express from "express";
import socketio from "socket.io";
import httpTerminator from "http-terminator";

export class ShareCordSender extends ShareCordUser {
    public password?: string;
    public filesMap: Map<string, ShareCordFile>;
    public usersMap: Map<string, ShareCordUser>;
    public server?: http.Server;
    public app?: express.Express;
    public socket?: socketio.Server;
    public address?: ShareCordAddress;
    public sender?: ShareCordUser;

    constructor(base: ShardCordUserOptions) {
        super(base);

        this.filesMap = new Map();
        this.usersMap = new Map();
    }

    public startServer(options: ShareCordSenderServerOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            if(options.password) this.password = options.password;

            const app = express();
            const server = http.createServer(app);
            const socket = socketio(server);

            socket.use((socketUser, next) => {
                const id = socketUser.handshake.query.user ? decodeURIComponent(socketUser.handshake.query.user) : null;
                if (!id) return next(new Error(CONSTANTS.ERRORS.ANONYMOUS_USER));
                const userRaw = parseID(id);
                if (!userRaw) return next(new Error(CONSTANTS.ERRORS.INVALID_USER));
                socketUser.user = new ShareCordUser({ ...userRaw, socketID: socketUser.id });
                return next();
            });

            socket.on("connection", (socketUser) => {
                if (!socketUser.user) return socketUser.disconnect();
    
                this.usersMap.set(socketUser.user.id, socketUser.user);
                this.emit("userConnect", socketUser.user, this);

                socket.on(CONSTANTS.SOCKET.FILES_GET, () => {
                    socket.emit(CONSTANTS.SOCKET.FILES_POST, this.files);
                    this.emit("filesDispatch", socketUser.user, this);
                });

                socket.on("disconnect", () => {
                    if (socketUser.user) {
                        this.usersMap.delete(socketUser.user.id);
                        this.emit("userDisconnect", socketUser.user, this);
                    }
                });
            });

            app.use((req, res, next) => {
                const id = req.query.user && typeof req.query.user === "string" ? req.query.user : null;
                if (!id) return res.end(CONSTANTS.ERRORS.ANONYMOUS_USER);

                const user = parseID(id);
                if (!user) return res.end(CONSTANTS.ERRORS.INVALID_USER);

                req.user = new ShareCordUser(user);
                return next();
            });

            app.get("/files/:id", (req, res) => {
                if (!req.user) return res.end(CONSTANTS.ERRORS.ANONYMOUS_USER);

                const id = req.params.id;
                const file = this.filesMap.get(id) || null;
                if (!file) return res.end(CONSTANTS.ERRORS.NO_CONTENT);
                this.emit("fileDownload", req.user.user);
                res.download(file.path);
            });

            server.listen(options.port, options.address, () => {
                this.server = server;
                this.app = app;
                this.socket = socket;
                const address = server.address();
                // @ts-ignore
                this.address = address && address.address && address.port ? { address: address.address, port: address.port } : null;
                
                this.emit("serverStarted", this);
                resolve();
            });
        });
    }

    public addFile(filesRaw: ShareCordFile): void {
        if (!filesRaw) throw new Error("Missing Parameter: file");
        const files = Array.isArray(filesRaw) ? filesRaw : [filesRaw];
        files.forEach(file => this.filesMap.set(file.id, file));
        if (this.socket) this.socket.emit("PATCH Files", this.files);
        this.emit("filesAdded", files, this);
    }

    public removeFile(filesRaw: ShareCordFile | Array<ShareCordFile>): void {
        if (!filesRaw) throw new Error("Missing Parameter: file");
        const files = Array.isArray(filesRaw) ? filesRaw : [filesRaw];
        files.forEach(file => this.filesMap.delete(file.id));
        if (this.socket) this.socket.emit("PATCH Files", this.files);
        this.emit("filesRemoved", files, this);
    }

    public destroy(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            delete this.app;
            if(this.socket) this.socket.close();
            delete this.socket;
            delete this.address;
            delete this.sender;
            if (this.server) {
                const terminator = httpTerminator.createHttpTerminator({ server: this.server });
                await terminator.terminate();
                delete this.server;
            }
            resolve();
        });
    }

    public get isPrivate(): boolean {
        return !!this.password;
    }

    public get files(): Array<ShareCordFile> {
        return Object.values(this.filesMap);
    }

    public get users(): Array<ShareCordUser> {
        return Object.values(this.usersMap);
    }
}