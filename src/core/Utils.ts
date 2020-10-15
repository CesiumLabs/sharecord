export interface ShardCordUserOptions {
    username: string;
    discrim: string;
    createdAt: number;
    socketID?: string;
}

export interface ShareCordAddress {
    address: string;
    port: number;
    family?: string;
}

export interface ShareCordNetworkAddress {
    address: string;
    family: string;
}

export interface ShareCordSenderServerOptions {
    address: string;
    port?: number;
    password?: string;
}

export interface ShareCordReceiverServerOptions {
    address: string;
    port: number;
    password?: string;
}

export const CONSTANTS = {
    SOCKET: {
        FILES_GET: "GET Files",
        FILES_POST: "POST Files"
    },
    ERRORS: {
        NO_CONTENT: "204: No Content",
        ANONYMOUS_USER: "401: Anonymous User",
        INVALID_USER: "402: Invalid User"
    }
}

export function parseID(id: string): ShardCordUserOptions | false | null {
    try {
        const decoded = decodeURIComponent(id);
        const userString = Buffer.from(decoded, "base64").toString();
        const userJSON = JSON.parse(userString);
        const isValid = validateUser(userJSON);
        return isValid ? userJSON : false;
    } catch (e) {
        return null;
    }
}

export function validateUser(user: ShardCordUserOptions): boolean {
    if (
        !user ||
        typeof user !== "object" ||

        !user.username ||
        typeof user.username !== "string" ||

        !user.discrim ||
        typeof user.discrim !== "number" ||

        !user.createdAt ||
        typeof user.createdAt !== "number"
    ) return false;
    return true;
}