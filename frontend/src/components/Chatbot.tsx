import React, { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FiSend, FiX, FiMessageSquare } from "react-icons/fi";

interface Message {
  text: string;
  isUser: boolean;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface Message {
  text: string;
  isUser: boolean;
}

interface FAQItem {
  question: string;
  answer: string;
}

// Predefined questions and answers
const FAQ = [
  {
    question: "register",
    answer:
      "You can register for an event by clicking on the 'Register' button on the event details page and filling out the registration form.",
  },
  {
    question: "cancel",
    answer:
      "Yes, you can cancel your registration by going to 'My Registrations' and clicking the 'Cancel' button next to the event you wish to cancel.",
  },
  {
    question: "payment",
    answer:
      "We accept all major credit cards, PayPal, and bank transfers for event registrations.",
  },
  {
    question: "refund",
    answer:
      "Yes, we offer a full refund if cancellation is made at least 7 days before the event. Please check our refund policy for more details.",
  },
  {
    question: "hello",
    answer: "Hello! I'm your event assistant. How can I help you today?",
  },
  {
    question: "hi",
    answer: "Hi there! How can I assist you with our events?",
  },
  {
    question: "help",
    answer:
      "I can help you with event registration, cancellations, payments, and refunds. What would you like to know?",
  },
];

// No styled-components needed with Tailwind

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text:
        "👋 Hello! I'm your event assistant. Here's what I can help with:\n\n" +
        '• Type "register" - For event registration\n' +
        '• Type "cancel" - To cancel registration\n' +
        '• Type "payment" - For payment methods\n' +
        '• Type "refund" - About refund policy\n' +
        '• Type "help" - For general assistance',
      isUser: false,
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Gemini API with environment variable
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  //  console.log('API Key:', GEMINI_API_KEY ? 'Found' : 'Not found');
  const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const context =
    "This Site is called Uni.io, users can register/unregister for events. admins can host events, make some guesses on other quieries";

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const findBestMatch = (input: string): string | null => {
    const inputLower = input.toLowerCase();

    const exactMatch = FAQ.find(
      (item) => inputLower === item.question.toLowerCase()
    );
    if (exactMatch) return exactMatch.answer;

    const partialMatch = FAQ.find(
      (item) =>
        inputLower.includes(item.question.toLowerCase()) ||
        item.question
          .toLowerCase()
          .split(" ")
          .some((word) => inputLower.includes(word) && word.length > 3)
    );

    return partialMatch?.answer || null;
  };

  const handleSendMessage = async (): Promise<void> => {
    if (!inputMessage.trim()) return;

    const userMessage = { text: inputMessage, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    const faqMatch = findBestMatch(inputMessage);

    if (faqMatch) {
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: faqMatch, isUser: false }]);
      }, 500);
    } else {
      try {
        if (genAI) {
          const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
          });
          const prompt =
            "You are a helpful assistant for a club event management platform." +
            context +
            `Answer the following question concisely and helpfully: ${inputMessage}`;

          const result = await model.generateContent(prompt);
          const response = await result.response;
          const text = response.text();

          // Add the question and answer to our FAQ for future reference
          if (
            !FAQ.some(
              (item) =>
                item.question.toLowerCase() === inputMessage.toLowerCase()
            )
          ) {
            FAQ.push({
              question: inputMessage.toLowerCase(),
              answer: text,
            });
          }

          setMessages((prev) => [...prev, { text, isUser: false }]);
        } else {
          throw new Error("AI service is currently unavailable");
        }
      } catch (error) {
        console.error("Error generating response:", error);
        // Fallback to a generic response
        const fallbackResponses = [
          "I'm sorry, I'm having trouble connecting to the AI service. Could you try rephrasing your question?",
          "I'm currently experiencing technical difficulties. Please try asking something else.",
          "I'm unable to process your request right now. Try asking about event registration, payments, or refunds.",
        ];
        const randomResponse =
          fallbackResponses[
            Math.floor(Math.random() * fallbackResponses.length)
          ];
        setMessages((prev) => [
          ...prev,
          { text: randomResponse, isUser: false },
        ]);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat Window */}
      <div
        className={`absolute bottom-16 right-0 w-96 h-[600px] flex flex-col bg-background rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ease-in-out border border-border ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/90 text-white p-4 flex justify-between items-center">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <FiMessageSquare size={20} />
            UNI.AI
          </h3>
          <button
            onClick={toggleChat}
            className="text-black/80 hover:bg-white/10 p-1.5 rounded-full transition-colors"
            aria-label="Close chat"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-background flex flex-col gap-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`max-w-[85%] p-3 rounded-lg whitespace-pre-line text-sm ${
                message.isUser
                  ? "bg-black text-white self-end rounded-br-sm"
                  : "bg-accent/80 text-foreground self-start rounded-bl-sm border border-border shadow-sm"
              }`}
            >
              {message.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-card">
          <div className="relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full p-3 pr-12 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 bg-white text-black placeholder:text-gray-400 text-sm transition-all duration-200"
            />
            <button
  onClick={handleSendMessage}
  disabled={!inputMessage.trim()}
  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors text-black"
  aria-label="Send message"
>
  <FiSend size={20} />
</button>

          </div>
        </div>
      </div>

      {/* Toggle Button - Always Visible */}
      <button
        onClick={toggleChat}
        className={`w-14 h-14 rounded-full bg-black dark:bg-primary text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:scale-105 ${
          isOpen ? 'rotate-180' : ''
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <FiX size={24} className="text-white" /> : <FiMessageSquare size={24} className="text-white" />}
      </button>
    </div>
  );
};

export default Chatbot;
