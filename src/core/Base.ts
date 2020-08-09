import {
    ShardCordUserOptions
} from "./Utils";

import { EventEmitter } from "events";
import os from "os";

export default class ShareCordUser extends EventEmitter {
    username: string;
    discrim: string;
    createdAt: number;
    socketID?: string;

    constructor(info: ShardCordUserOptions) {
        super();

        this.username = info.username;
        this.discrim = info.discrim;
        this.createdAt = info.createdAt;
        if (info.socketID) this.socketID = this.socketID;
    }

    get user(): ShardCordUserOptions {
        return {
            username: this.username,
            discrim: this.discrim,
            createdAt: this.createdAt
        }
    }

    get id (): string {
        return Buffer.from(JSON.stringify(this.user)).toString("base64");
    }

    getAvailableAddresses () {
        const ips: Array<os.NetworkInterfaceInfoIPv4> = [];
        const connections = os.networkInterfaces();
        const networks = Object.values(connections);
        // @ts-ignore
        networks.forEach(net => ips.push(...net));
        return ips.filter(net => net.family === "IPv4" && !net.internal);
    }
}