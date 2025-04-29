import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import "./ChatbotWidget.css"; // We'll create this CSS file next

const SIZES = ["small", "medium", "large"];

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hello! How can I help you with course selection today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modalSize, setModalSize] = useState("medium");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const changeSize = (direction) => {
    const currentIndex = SIZES.indexOf(modalSize);
    let nextIndex;
    if (direction === "increase") {
      nextIndex = (currentIndex + 1) % SIZES.length;
    } else {
      nextIndex = (currentIndex - 1 + SIZES.length) % SIZES.length;
    }
    setModalSize(SIZES[nextIndex]);
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    const userMessage = inputValue.trim();
    if (!userMessage) return;

    // Add user message to chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", text: userMessage },
    ]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5001/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        // Try to get error message from response body
        const errorData = await response.json().catch(() => ({})); // Catch potential JSON parsing errors
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      const botMessage = data.response;

      // Add bot response to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "bot", text: botMessage },
      ]);
    } catch (error) {
      console.error("Failed to send message:", error);
      // Add an error message to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "bot",
          text: `Sorry, something went wrong. ${
            error.message || "Please try again later."
          }`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-widget-container">
      {/* Chat Bubble */}
      {!isOpen && (
        <button onClick={toggleChat} className="chat-bubble">
          💬
        </button>
      )}

      {/* Chat Modal */}
      {isOpen && (
        <div className={`chat-modal chat-modal--${modalSize}`}>
          {/* Header */}
          <div className="chat-modal-header">
            <h2>Course Counselor Bot</h2>
            <div className="size-controls">
              <button
                onClick={() => changeSize("decrease")}
                className="size-button"
                title="Decrease size"
              >
                -
              </button>
              <button
                onClick={() => changeSize("increase")}
                className="size-button"
                title="Increase size"
              >
                +
              </button>
            </div>
            <button onClick={toggleChat} className="close-button">
              &times;
            </button>
          </div>

          {/* Message List */}
          <div className="chat-modal-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                {/* Temporarily render both bot and user messages as plain text */}
                {String(msg.text ?? "")}
                {/* {msg.role === 'bot' ? (
                  // Ensure msg.text is treated as a string, handle null/undefined
                  <ReactMarkdown>{String(msg.text ?? '')}</ReactMarkdown>
                ) : (
                  msg.text // User messages are likely fine as strings
                )} */}
              </div>
            ))}
            {isLoading && (
              <div className="message bot loading">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="chat-modal-input">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Ask about courses..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ChatbotWidget;
