import api from "@config/axiosConfig.js"

const ChatService = {
  resetMemory: () => api.post("chat/query/reset_memory/"),
  query: (msg, webSearch, mode) =>
    api.post("chat/query/", { query: msg, web_search: webSearch, mode })
}

export default ChatService
