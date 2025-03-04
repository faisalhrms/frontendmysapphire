import React, { useState, useEffect, useRef } from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import api from "@config/axiosConfig.js";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const chatContainerRef = useRef(null);

  const suggestions = [
    "Give me top exporters of Pakistan",
    "What's total export of sapphire textiles mills",
    "Which product does Faisal Spinning Mills export most?",
    "Exports of Faisal Spinning Mills",
    "Exports of Faisal Spinning Mills to Europe",
    "Show me the imports of diamond brand"
  ];

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        setMessages((prev) => [...prev, { type: "user", text: transcript }]);
        setInput("");
        setListening(false);
        await sendQuery(transcript);
      };
      recognition.onerror = () => {
        setListening(false);
      };
      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const extractVowels = (text) => {
    return text.replace(/[^aeiouAEIOU]/g, "");
  };

  const speakAnswer = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const sendQuery = async (message) => {
    const vowels = extractVowels(message);
    try {
      const response = await api.post("chat/query/", { query: message, vowels });
      if (response.status === 200) {
        const respData = response.data.response;
        let botMessage;
        if (Array.isArray(respData)) {
          botMessage = { type: "bot", data: respData };
          speakAnswer("Here are the results.");
        } else if (typeof respData === "object" && respData !== null) {
          botMessage = { type: "bot", text: JSON.stringify(respData) };
          speakAnswer(JSON.stringify(respData));
        } else {
          botMessage = { type: "bot", text: respData };
          speakAnswer(respData);
        }
        setMessages((prev) => [...prev, botMessage]);
      } else {
        setMessages((prev) => [...prev, { type: "bot", text: "Error processing query" }]);
        speakAnswer("Error processing query");
      }
    } catch (error) {
      setMessages((prev) => [...prev, { type: "bot", text: "Network error" }]);
      speakAnswer("Network error");
    }
  };

  const handleSend = async () => {
    if (input.trim() !== "") {
      const userMessage = input.trim();
      setMessages((prev) => [...prev, { type: "user", text: userMessage }]);
      setInput("");
      await sendQuery(userMessage);
    }
  };

  const handleSuggestion = async (suggestion) => {
    setMessages((prev) => [...prev, { type: "user", text: suggestion }]);
    await sendQuery(suggestion);
  };

  const startVoice = () => {
    if (recognitionRef.current) {
      setListening(true);
      recognitionRef.current.start();
    }
  };

  return (
    <>
      <div className="flex justify-center items-start p-8 bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] min-h-[calc(100vh-60px)]">
        <div className="flex-1 max-w-[800px] bg-white rounded-xl shadow-lg p-5 mr-5">
          <div
            ref={chatContainerRef}
            className="h-[400px] overflow-y-auto rounded-md p-4 mb-4 bg-gray-100 space-y-4"
          >
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] p-3 rounded-lg ${msg.type === "user" ? "bg-green-100 text-right" : "bg-gray-200 text-left"}`}>
                  {msg.type === "bot" && msg.data ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse">
                        <thead>
                          <tr>
                            <th className="border px-2 py-1">#</th>
                            <th className="border px-2 py-1">Company</th>
                            <th className="border px-2 py-1">Value</th>
                            <th className="border px-2 py-1">Country</th>
                            <th className="border px-2 py-1">Product</th>
                          </tr>
                        </thead>
                        <tbody>
                          {msg.data.map((item, idx) => (
                            <tr key={idx}>
                              <td className="border px-2 py-1">{idx + 1}</td>
                              <td className="border px-2 py-1">{item.Company}</td>
                              <td className="border px-2 py-1">{item.VALUE_PKR || item.USD}</td>
                              <td className="border px-2 py-1">{item.Country}</td>
                              <td className="border px-2 py-1">{item.Product}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Suggestions</h3>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestion(suggestion)}
                  className="px-3 py-1 bg-gray-300 rounded-full text-sm hover:bg-gray-400"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-3 rounded-md border border-gray-300 text-lg"
            />
            <button onClick={handleSend} className="p-3 ml-2 rounded-md bg-green-600 text-white cursor-pointer ti-btn-success-full text-lg flex items-center">
              <i className="ri-send-plane-fill mr-2 font-semibold align-middle"></i>
            </button>
            <button onClick={startVoice} className="p-3 ml-2 rounded-md bg-blue-600 text-white cursor-pointer ti-btn-primary-full text-lg flex items-center">
              <i className="ri-voiceprint-fill font-semibold align-middle"></i>
              {listening ? "Listening..." : ""}
            </button>
          </div>
        </div>
        <div className="w-64 text-center bg-white rounded-xl shadow-lg p-5">
          <img
            src="https://robohash.org/ComicCharacter?set=set3"
            alt="AI Bot"
            className="w-36 h-36 mx-auto rounded-full border-2 border-gray-300"
          />
          <h2 className="mt-4 text-2xl text-gray-800">Chatbot</h2>
          <p className="text-gray-600">Your friendly AI assistant</p>
          {listening && <p className="text-blue-600 font-bold">Listening...</p>}
        </div>
      </div>
    </>
  );
};

export default ChatBot;
