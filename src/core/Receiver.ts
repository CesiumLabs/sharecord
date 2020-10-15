import { ShareCordUser } from "./Base";
import { ShareCordFile } from "./File";
import {
    ShardCordUserOptions,
    ShareCordReceiverServerOptions,
    ShareCordAddress,
    CONSTANTS
} from "./Utils";

import socketIO from "socket.io-client";

export class ShareCordReceiver extends ShareCordUser {
    public socket?: SocketIOClient.Socket;
    public address?: ShareCordAddress;
    public files?: Array<ShareCordFile>;

    constructor(base: ShardCordUserOptions) {
        super(base);
    }

    public connectServer(options: ShareCordReceiverServerOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            const socket = socketIO(`http://${options.address}:${options.port}?user=${this.id}`);
            socket.on("connect", () => {
                this.socket = socket;
                this.address = { address: options.address, port: options.port };
                this.files = [];

                socket.emit(CONSTANTS.SOCKET.FILES_GET);
                socket.on(CONSTANTS.SOCKET.FILES_POST, (files: Array<ShareCordFile>) => {
                    this.files = files;
                    this.emit("onFilesChange", this);
                });

                this.emit("socketConnect", this);
                resolve();
            });

            socket.on("error", (error: any) => {
                if (
                    error === CONSTANTS.ERRORS.ANONYMOUS_USER ||
                    error === CONSTANTS.ERRORS.INVALID_USER
                ) return reject(`Couldn\'t Establish Connection to ${options.address}:${options.port}. Reason: ${error}`);

                this.emit("socketError", error, this);
            });
        });
    }

    public fetchFiles(): void {
        this.socket?.emit(CONSTANTS.SOCKET.FILES_GET);
    }

    public destroy(): Promise<void> {
        return new Promise((resolve, reject) => {
            if(this.socket) this.socket.close();
            delete this.socket;

            this.emit("socketDisconnect");
            resolve();
        });
    }
}