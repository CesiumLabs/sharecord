import {
    ShardCordUserOptions,
    ShareCordNetworkAddress
} from "./Utils";

import { EventEmitter } from "events";
import os from "os";

export class ShareCordUser extends EventEmitter {
    public username: string;
    public discrim: string;
    public createdAt: number;
    public socketID?: string;

    constructor(options: ShardCordUserOptions) {
        super();

        this.username = options.username;
        this.discrim = options.discrim;
        this.createdAt = options.createdAt;
        if (options.socketID) this.socketID = this.socketID;
    }

    public get user(): ShardCordUserOptions {
        return {
            username: this.username,
            discrim: this.discrim,
            createdAt: this.createdAt
        }
    }

    public get id (): string {
        return encodeURIComponent(Buffer.from(JSON.stringify(this.user)).toString("base64"));
    }

    public getAvailableAddresses(): Array<ShareCordNetworkAddress> {
        const ips: Array<os.NetworkInterfaceInfoIPv4> = [];
        const connections = os.networkInterfaces();
        const networks = Object.values(connections);
        // @ts-ignore
        networks.forEach(net => ips.push(...net));
        return ips
            .filter(net => net.family === "IPv4" && !net.internal)
            .map(net => ({ address: net.address, family: net.family }));
    }
}