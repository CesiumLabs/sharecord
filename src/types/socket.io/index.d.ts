import { ShareCordUser } from "../../core/Base";

declare global {
    namespace SocketIO {
        interface Socket {
            user?: ShareCordUser;
        }
    }
}