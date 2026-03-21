import { useState, useRef, useEffect } from "react";
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
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your AXON study assistant. Ask me anything about the current flashcard!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userQuestion: string): string => {
    const lowerQuestion = userQuestion.toLowerCase();
    const cardContent = (currentCard.front + " " + currentCard.back).toLowerCase();

    // Context-aware responses based on card content
    if (lowerQuestion.includes("mechanism") || lowerQuestion.includes("how does") || lowerQuestion.includes("how work")) {
      if (cardContent.includes("beta blocker") || cardContent.includes("metoprolol")) {
        return "Beta blockers like metoprolol work by blocking β1-adrenergic receptors in the heart. This reduces the heart's response to adrenaline, leading to decreased heart rate, contractility, and blood pressure. Think of it as 'putting brakes' on the heart's response to stress hormones.";
      }
      if (cardContent.includes("ace inhibitor") || cardContent.includes("lisinopril")) {
        return "ACE inhibitors block the enzyme that converts angiotensin I to angiotensin II. This prevents vasoconstriction and reduces aldosterone secretion, leading to lower blood pressure and reduced fluid retention. They're especially protective for the kidneys in diabetic patients.";
      }
      return "The mechanism of action refers to how a drug produces its therapeutic effect at the molecular/cellular level. Check the 'Drugs' tab on the right for detailed mechanism information!";
    }

    if (lowerQuestion.includes("side effect") || lowerQuestion.includes("adverse")) {
      if (cardContent.includes("beta blocker") || cardContent.includes("metoprolol")) {
        return "Common side effects of beta blockers include bradycardia (slow heart rate), fatigue, and cold extremities. They can also mask symptoms of hypoglycemia in diabetics - important to remember! Check the 'Drugs' tab for a complete list.";
      }
      if (cardContent.includes("ace inhibitor") || cardContent.includes("lisinopril")) {
        return "ACE inhibitors commonly cause a dry cough (10-15% of patients) due to increased bradykinin. Other side effects include hyperkalemia, angioedema (rare but serious), and potential for acute kidney injury. Always check potassium levels!";
      }
      return "Side effects vary by medication class. Check the 'Drugs' tab for detailed adverse effects information!";
    }

    if (lowerQuestion.includes("contraindication") || lowerQuestion.includes("when not") || lowerQuestion.includes("avoid")) {
      return "Contraindications are situations where a medication should NOT be used. Key ones often involve pregnancy, drug interactions, or specific medical conditions. The 'Drugs' tab shows all major contraindications. Always check for drug-drug interactions!";
    }

    if (lowerQuestion.includes("indication") || lowerQuestion.includes("used for") || lowerQuestion.includes("treat")) {
      return "Indications are the approved medical uses for a medication. Many drugs have multiple indications across different organ systems. Check the 'Drugs' tab (look for the green badges) for all FDA-approved indications!";
    }

    if (lowerQuestion.includes("clinical") || lowerQuestion.includes("exam") || lowerQuestion.includes("pearls")) {
      return "Great question! Clinical pearls are high-yield facts that help in real patient care. Check the 'Clinical' tab for anatomy-specific clinical relevance and examination findings. These are especially useful for USMLE and clinical rotations!";
    }

    if (lowerQuestion.includes("anatomy") || lowerQuestion.includes("structure")) {
      return "The 'Anatomy' tab shows interactive diagrams you can click on to learn about specific structures. Hover over different parts to see their names, and click for detailed clinical information!";
    }

    if (lowerQuestion.includes("mnemonic") || lowerQuestion.includes("remember") || lowerQuestion.includes("memorize")) {
      return "Here's a study tip: Create acronyms or visual associations! For beta blockers, remember 'ABCD': Avoid in Asthma, Bradycardia risk, Careful in Diabetes, Don't stop abruptly. Try making your own mnemonics - they stick better!";
    }

    if (lowerQuestion.includes("dosage") || lowerQuestion.includes("dose") || lowerQuestion.includes("how much")) {
      return "Dosage information is available in the 'Drugs' tab. Remember that doses often need adjustment for renal/hepatic impairment and vary by indication. Always check current guidelines for specific patient populations!";
    }

    if (lowerQuestion.includes("thank") || lowerQuestion.includes("thanks")) {
      return "You're welcome! Keep up the great studying. Remember, spaced repetition is key to long-term retention. Good luck! 🎓";
    }

    // Default helpful response
    return `That's a great question! Based on this card about "${currentCard.front.substring(0, 50)}...", I'd recommend checking the tabs on the right: \n\n• 'Overview' for key concepts and definitions\n• 'Drugs' for detailed pharmacology\n• 'Anatomy' for interactive diagrams\n• 'Clinical' for clinical pearls\n\nCould you be more specific about what aspect you'd like to understand better?`;
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Generate and add bot response after a short delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputText),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 500);

    setInputText("");
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
                  disabled={!inputText.trim()}
                  size="icon"
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
