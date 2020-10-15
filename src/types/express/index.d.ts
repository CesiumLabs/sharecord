import { ShareCordUser } from "../../core/Base";

declare global {
    namespace Express {
        interface Request {
            user?: ShareCordUser;
        }
    }
}