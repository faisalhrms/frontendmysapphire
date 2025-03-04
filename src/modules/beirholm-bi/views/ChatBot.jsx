import React, { useState, useEffect, useRef } from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import api from "@config/axiosConfig.js";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const suggestions = [
    "Give me top importers of 2024",
    "What's total export of sapphire textiles",
    "Top exporters from Asia continent of Pakistan 2023",
    "Show me bed sheet importers in 2024",
    "Give me top importers of 2024 in USD",
    "Which company imports more: CompanyA vs CompanyB"
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
        if (Array.isArray(respData)) {
          setMessages((prev) => [...prev, { type: "bot", data: respData }]);
          speakAnswer("Here are the top importers of Pakistan 2024");
        } else if (typeof respData === "object" && respData !== null) {
          const answerText = JSON.stringify(respData);
          setMessages((prev) => [...prev, { type: "bot", text: answerText }]);
          speakAnswer(answerText);
        } else {
          const answerText = respData;
          setMessages((prev) => [...prev, { type: "bot", text: answerText }]);
          speakAnswer(answerText);
        }
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
      <PageHeader currentpage="Chat Bot" mainpage="Chat Bot" />
      <div className="flex justify-center items-start p-8 bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] min-h-[calc(100vh-60px)]">
        <div className="flex-1 max-w-[800px] bg-white rounded-xl shadow-lg p-5 mr-5">
          <div className="h-[400px] overflow-y-auto rounded-md p-4 mb-4 bg-gray-100 space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded my-2 inline-block max-w-full whitespace-pre-line ${
                  msg.type === "user" ? "bg-green-100 text-right ml-auto" : "bg-gray-200 text-left mr-auto"
                }`}
              >
                {msg.data ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="border px-2 py-1">#</th>
                          <th className="border px-2 py-1">Company</th>
                          <th className="border px-2 py-1">Value (PKR)</th>
                          <th className="border px-2 py-1">Country</th>
                          <th className="border px-2 py-1">Product</th>
                        </tr>
                      </thead>
                      <tbody>
                        {msg.data.map((item, idx) => (
                          <tr key={idx}>
                            <td className="border px-2 py-1">{idx + 1}</td>
                            <td className="border px-2 py-1">{item.Company}</td>
                            <td className="border px-2 py-1">{item.VALUE_PKR}</td>
                            <td className="border px-2 py-1">{item.Country}</td>
                            <td className="border px-2 py-1">{item.Product}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  Array.isArray(msg.text)
                    ? msg.text.map((line, i) => <div key={i}>{line}</div>)
                    : msg.text
                )}
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
