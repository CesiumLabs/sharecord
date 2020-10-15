export { ShareCordUser as User } from "./core/Base";
export { ShareCordReceiver as Receiver } from "./core/Receiver";
export { ShareCordSender as Sender } from "./core/Sender";
export { ShareCordFile as File } from "./core/File";
export * as Utils from "./core/Utils";

const pkg = require("../package.json");
export const VERSION = pkg.version;