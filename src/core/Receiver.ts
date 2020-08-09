import ShareCordUser from "./Base";
import {
    ShardCordUserOptions,
    ShareCordAddress,
    CONSTANTS
} from "./Utils";

import socketIO from "socket.io-client";

export default class ShareCordReceiver extends ShareCordUser {
    socket?: SocketIOClient.Socket;
    address?: ShareCordAddress;

    constructor(base: ShardCordUserOptions) {
        super(base);
    }

    connectServer(address: string, port: number): Promise<void> {
        return new Promise((resolve, reject) => {
            const socket = socketIO(`http://${address}:${port}?user=${encodeURIComponent(this.id)}`);
            socket.on("connect", () => {
                this.socket = socket;
                this.address = { address, port };
                resolve();
            });

            socket.on("error", (error: any) => {
                if (
                    error === CONSTANTS.ERRORS.ANONYMOUS_USER ||
                    error === CONSTANTS.ERRORS.INVALID_USER
                ) reject(`Couldn\'t Establish Connection to ${address}:${port}. Reason: ${error}`);
            });
        });
    }

    destroy(): Promise<void> {
        return new Promise((resolve, reject) => {
            if(this.socket) this.socket.close();
            delete this.socket;
            resolve();
        });
    }
}