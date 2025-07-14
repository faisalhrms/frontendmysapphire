import {generateSidebarItem} from "@helpers/formatters.js";
import {CHAT_BOT} from "@modules/chatbot/routes.js";


export const sidebarMenu = [
    generateSidebarItem(
        CHAT_BOT.CHAT_BOT_READ.path,
        'link',
        'ChatBot',
        5,
        'bi bi-robot',
        CHAT_BOT.CHAT_BOT_READ.permission,
    )
];