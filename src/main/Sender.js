const Base = require("./Base");
const File = require("./File");
const Utils = require("./Utils");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const httpTerminator = require("http-terminator");

class ShareCordSender extends Base {
    constructor(base, { password } = {}) {
        super(base);

        this.password = password || null;
        this.private = !!this.password;

        this.server = null;
        this.app = null;
        this.socket = null;
        this.address = null;
        this.sender = null;

        this.filesMap = new Map();
        this.usersMap = new Map();
    }

    startServer (address) {
        return new Promise((resolve, reject) => {
            const app = express();
            const server = http.createServer(app);
            const socket = socketio(server);

            // app.use(express.json());
            // app.use(express.urlencoded({ extended: false }));
            // app.set("view engine", "ejs");
            // app.set("views", path.join(__dirname, "views"));
            // app.use(express.static(path.join(__dirname, "..", "public")));

            socket.use((socketUser, next) => {
                const id = socketUser.handshake.query.user ? decodeURIComponent(socketUser.handshake.query.user) : null;
                if (!id) return next(new Error(Utils.CONSTANTS.ERRORS.ANONYMOUS_USER));

                const user = Utils.parseID(id);
                if (!user) return next(new Error(Utils.CONSTANTS.ERRORS.INVALID_USER));
                
                socketUser.user = { ...user, id, socketID: socketUser.id };
                return next();
            });

            socket.on("connection", (socketUser) => {
                this.usersMap.set(socketUser.user.socketID, socketUser.user);
                this.emit("userConnect", socketUser.user);

                socket.on("disconnect", () => {
                    this.usersMap.delete(socketUser.user.socketID);
                    this.emit("userDisconnect", socketUser.user);
                });
            });

            socket.on("GET Files", () => {
                socket.emit("POST Files", this.files);
            });

            app.use((req, res, next) => {
                const id = req.query.user ? decodeURIComponent(req.query.user) : null;
                if (!id) return res.end(Utils.CONSTANTS.ERRORS.ANONYMOUS_USER);

                const user = Utils.parseID(id);
                if (!user) return res.end(Utils.CONSTANTS.ERRORS.INVALID_USER);

                req.user = { ...user, id };
                return next();
            });

            app.get("/files/:id", (req, res) => {
                const id = req.params.id;
                const file = this.filesMap.get(id) || null;
                if (!file) return res.end(Utils.CONSTANTS.ERRORS.NO_CONTENT);
                res.download(file.path);
            });

            server.listen(undefined, address, () => {
                this.server = server;
                this.app = app;
                this.socket = socket;
                this.address = server.address();
                resolve();
            });
        });
    }

    addFile (file) {
        if (!file) throw new Error("Missing Parameter: file");
        if (!(file instanceof File)) throw new Error("Invalid Parameter: file");

        this.filesMap.set(file.id, file);
        this.socket.emit("PATCH Files", this.files);
    }

    removeFile (file) {
        if (!file) throw new Error("Missing Parameter: file");

        this.filesMap.delete(file instanceof File ? file.id : file);
        this.socket.emit("PATCH Files", this.files);
    }

    destroy () {
        return new Promise(async (resolve, reject) => {
            this.app = null;
            this.socket.close();
            this.socket = null;
            this.address = null;
            this.sender = null;
            const terminator = httpTerminator.createHttpTerminator({ server: this.server });
            await terminator.terminate();
            resolve();
        });
    }

    get files () {
        return Object.values(this.filesMap);
    }

    get users () {
        return Object.values(this.usersMap);
    }
}

module.exports = ShareCordSender;