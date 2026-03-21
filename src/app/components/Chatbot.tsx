import { useState, useRef, useEffect } from "react";
import { getChatApiUrl } from "@/lib/chatApi";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { MessageCircle, Send, X, Bot, User } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatbotProps {
  currentCard: {
    front: string;
    back: string;
  };
}

export function Chatbot({ currentCard }: ChatbotProps) {
  const getWelcomeMessage = () =>
    `Ask me about this card only.\n\nCurrent card: ${currentCard.front.slice(0, 110)}${currentCard.front.length > 110 ? "..." : ""}`;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: getWelcomeMessage(),
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([
      {
        id: Date.now().toString(),
        text: getWelcomeMessage(),
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
  }, [currentCard.front, currentCard.back]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isSending) return;
    const question = inputText.trim();

    const userMessage: Message = {
      id: Date.now().toString(),
      text: question,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsSending(true);

    try {
      const response = await fetch(getChatApiUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          card: {
            front: currentCard.front,
            back: currentCard.back,
          },
        }),
      });

      const data = await response.json().catch(() => ({}));
      let botText: string;
      if (!response.ok) {
        const detail =
          typeof data?.details === "string"
            ? data.details
            : typeof data?.error === "string"
              ? data.error
              : `Request failed (${response.status})`;
        botText = `Could not get a reply: ${detail}`;
      } else if (typeof data?.answer === "string" && data.answer.trim()) {
        botText = data.answer;
      } else {
        botText =
          "No answer returned. Check the API server logs (missing API key, model error, or empty response).";
      }

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: botText,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      const url = getChatApiUrl();
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: [
          `Could not reach the chat API (${url}).`,
          reason ? `Error: ${reason}` : "",
          "",
          "Common fixes:",
          "• Start the backend: `npm run api` (or run both with `npm run dev:all`).",
          "• Default dev URL is `/api/chat` (Vite proxies to port 8787). If `.env` sets `VITE_CHAT_API_URL`, that server must be up and reachable.",
          "• If the API runs in WSL and Vite on Windows (or the reverse), use the same environment for both or fix port forwarding.",
        ]
          .filter(Boolean)
          .join("\n"),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 z-50"
          size="icon"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] shadow-2xl rounded-lg overflow-hidden z-50 border-2 border-blue-200">
          <Card className="h-[500px] flex flex-col m-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white flex-shrink-0 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  <CardTitle className="text-base">AXON Study Assistant</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-blue-100 mt-1">Ask questions about your current flashcard</p>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.sender === "bot" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-lg px-3 py-2 ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {message.sender === "user" && (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-gray-700" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </CardContent>

            <div className="border-t bg-white p-3 flex-shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask a question..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isSending}
                  size="icon"
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  {isSending ? (
                    <span className="text-xs font-semibold">...</span>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
