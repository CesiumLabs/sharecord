import ShareCordUser from "../../main/Base";

declare global {
    namespace Express {
        interface Request {
            user?: ShareCordUser;
        }
    }
}