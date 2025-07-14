import ChatBot from "@modules/chatbot/views/ChatBot.jsx";


export const CHAT_BOT = {
    CHAT_BOT_READ: {
        path: '/module/chat/bot',
        permission: 'auth.view_chat_bot',
    },
};

export const MODULE_ROUTES = [
    {
        path: CHAT_BOT.CHAT_BOT_READ.path,
        component: ChatBot,
        permission: CHAT_BOT.CHAT_BOT_READ.permission,
    },
];
