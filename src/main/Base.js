const Utils = require("./Utils");
const events = require("events");
const os = require("os");

class ShareCordUser extends events {
    constructor(info) {
        super();

        if (!Utils.validateUser(info)) throw new Error("Missing/Invalid User Arguments");

        this.username = info.username;
        this.discrim = info.discrim;
        this.createdAt = info.createdAt;
    }

    get user () {
        return {
            username: this.username,
            discrim: this.discrim,
            createdAt: this.createdAt
        }
    }

    get id () {
        return Buffer.from(JSON.stringify(this.user)).toString("base64");
    }

    get href () {
        return this.address ? `${this.address.address}:${this.address.port}` : null;
    }

    getAvailableAddresses () {
        const ips = [];
        const connections = os.networkInterfaces();
        const networks = Object.values(connections);
        networks.forEach(net => ips.push(...net));
        return ips.filter(net => net.family === "IPv4" && !net.internal);
    }
}

module.exports = ShareCordUser;