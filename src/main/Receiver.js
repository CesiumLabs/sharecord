const Base = require("./Base");
const Utils = require("./Utils");
const socketIO = require("socket.io-client");

class ShareCordReceiver extends Base {
    constructor(base) {
        super(base);

        this.socket = null;
        this.address = null;
    }

    connectServer (address, port) {
        return new Promise((resolve, reject) => {
            const socket = socketIO(`http://${address}:${port}?user=${encodeURIComponent(this.id)}`);
            socket.on("connect", () => {
                this.socket = socket;
                this.address = { address, port };
                resolve();
            });

            socket.on("error", (error) => {
                if (
                    error === Utils.CONSTANTS.ERRORS.ANONYMOUS_USER ||
                    error === Utils.CONSTANTS.ERRORS.INVALID_USER
                ) reject(`Couldn\'t Establish Connection to ${address}:${port}. Reason: ${error}`);
            });
        });
    }

    destroy () {
        return new Promise((resolve, reject) => {
            this.socket.close();
            this.socket = null;
            resolve();
        });
    }
}

module.exports = ShareCordReceiver;