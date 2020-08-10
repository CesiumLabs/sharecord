"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = exports.parseID = exports.CONSTANTS = void 0;
exports.CONSTANTS = {
    SOCKET: {
        FILES_GET: "GET Files",
        FILES_POST: "POST Files"
    },
    ERRORS: {
        NO_CONTENT: "204: No Content",
        ANONYMOUS_USER: "401: Anonymous User",
        INVALID_USER: "402: Invalid User"
    }
};
function parseID(id) {
    try {
        var decoded = decodeURIComponent(id);
        var userString = Buffer.from(decoded, "base64").toString();
        var userJSON = JSON.parse(userString);
        var isValid = validateUser(userJSON);
        return isValid ? userJSON : false;
    }
    catch (e) {
        return null;
    }
}
exports.parseID = parseID;
function validateUser(user) {
    if (!user ||
        typeof user !== "object" ||
        !user.username ||
        typeof user.username !== "string" ||
        !user.discrim ||
        typeof user.discrim !== "number" ||
        !user.createdAt ||
        typeof user.createdAt !== "number")
        return false;
    return true;
}
exports.validateUser = validateUser;
