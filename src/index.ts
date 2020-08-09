import * as ShareCordUser from "./core/Base";
import * as ShareCordReceiver from "./core/Receiver";
import * as ShareCordSender from "./core/Sender";
import * as ShareCordFile from "./core/File";
import * as ShareCordUtils from "./core/Utils";

const ShareCord = {
    User: ShareCordUser,
    Receiver: ShareCordReceiver,
    Sender: ShareCordSender,
    File: ShareCordFile,
    Utils: ShareCordUtils
}

export default ShareCord;
module.exports = ShareCord; /* CommonJS */