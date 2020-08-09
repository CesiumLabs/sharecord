import ShareCordUser from "./Base";
import ShareCordFile from "./File";
import {
    ShardCordUserOptions,
    ShareCordReceiverOptions,
    ShareCordAddress,
    CONSTANTS,
    parseID
} from "./Utils";

import http from "http";
import express from "express";
import socketio from "socket.io";
import httpTerminator from "http-terminator";



export default class ShareCordSender extends ShareCordUser {
    password?: string;
    private: boolean;
    filesMap: Map<string, ShareCordFile>;
    usersMap: Map<string, ShareCordUser>;
    server?: http.Server;
    app?: express.Express;
    socket?: socketio.Server;
    address?: ShareCordAddress;
    sender?: ShareCordUser;

    constructor(base: ShardCordUserOptions, { password }: ShareCordReceiverOptions) {
        super(base);

        if (password) this.password = password;
        this.private = !!this.password;
        this.filesMap = new Map();
        this.usersMap = new Map();
    }

    startServer(address: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const app = express();
            const server = http.createServer(app);
            const socket = socketio(server);

            socket.use((socketUser: ShareCordSenderSocketMiddleware, next) => {
                const id = socketUser.handshake.query.user ? decodeURIComponent(socketUser.handshake.query.user) : null;
                if (!id) return next(new Error(CONSTANTS.ERRORS.ANONYMOUS_USER));
                const userRaw = parseID(id);
                if (!userRaw) return next(new Error(CONSTANTS.ERRORS.INVALID_USER));
                socketUser.user = new ShareCordUser({ ...userRaw, socketID: socketUser.id });
                return next();
            });

            socket.on("connection", (socketUser: ShareCordSenderSocketRequest) => {
                this.usersMap.set(socketUser.user.id, socketUser.user);
                this.emit("userConnect", socketUser.user);

                socket.on("disconnect", () => {
                    this.usersMap.delete(socketUser.user.id);
                    this.emit("userDisconnect", socketUser.user);
                });
            });

            socket.on("GET Files", () => {
                socket.emit("POST Files", this.files);
            });

            app.use((req, res, next) => {
                const id = req.query.user && typeof req.query.user === "string" ? decodeURIComponent(req.query.user) : null;
                if (!id) return res.end(CONSTANTS.ERRORS.ANONYMOUS_USER);

                const user = parseID(id);
                if (!user) return res.end(CONSTANTS.ERRORS.INVALID_USER);

                req.user = new ShareCordUser(user);
                return next();
            });

            app.get("/files/:id", (req, res) => {
                const id = req.params.id;
                const file = this.filesMap.get(id) || null;
                if (!file) return res.end(CONSTANTS.ERRORS.NO_CONTENT);
                res.download(file.path);
            });

            server.listen(undefined, address, () => {
                this.server = server;
                this.app = app;
                this.socket = socket;
                const address = server.address();
                // @ts-ignore
                this.address = address && address.address && address.port ? { address: address.address, port: address.port } : null;
                resolve();
            });
        });
    }

    addFile(file: ShareCordFile): void {
        if (!file) throw new Error("Missing Parameter: file");
        if (!(file instanceof ShareCordFile)) throw new Error("Invalid Parameter: file");

        this.filesMap.set(file.id, file);
        if (this.socket) this.socket.emit("PATCH Files", this.files);
    }

    removeFile(file: ShareCordFile): void {
        if (!file) throw new Error("Missing Parameter: file");

        this.filesMap.delete(file.id);
        if (this.socket) this.socket.emit("PATCH Files", this.files);
    }

    destroy(): Promise<void> {
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

    get files(): Array<ShareCordFile> {
        return Object.values(this.filesMap);
    }

    get users(): Array<ShareCordUser> {
        return Object.values(this.usersMap);
    }
}

interface ShareCordSenderSocketMiddleware extends socketio.Socket {
    user?: ShareCordUser;
}

interface ShareCordSenderSocketRequest extends socketio.Socket {
    user: ShareCordUser;
}