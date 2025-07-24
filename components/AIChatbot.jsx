// components/AIChatbot.jsx
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react'; // Added Send icon
import styles from '../styles/AIChatbot.module.css'; 

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const chatWindowRef = useRef(null);
  const chatBodyRef = useRef(null); // Ref to scroll chat body

  const [messages, setMessages] = useState([]); // Stores { text: string, sender: 'user' | 'ai' }
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false); // New state for AI typing indicator

  // Function to get current page context
  const getPageContext = () => {
    // This is a basic way to get text. You might want to refine this
    // to extract more specific or structured content (e.g., specific headings, article text).
    const title = document.title;
    const descriptionMeta = document.querySelector('meta[name="description"]');
    const description = descriptionMeta ? descriptionMeta.content : '';
    const mainContent = document.querySelector('main, article, body'); // Target main content
    const textContent = mainContent ? mainContent.innerText.substring(0, 1500) : ''; // Limit for efficiency

    return `Page Title: "${title}"\nPage Description: "${description}"\nRelevant Text Snippet: "${textContent}"`;
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    // When opening, potentially send an initial AI greeting or context if desired
    // For now, it will greet after first user message or if specific prompt is given.
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatWindowRef.current && !chatWindowRef.current.contains(event.target) && event.target.closest(`.${styles.chatToggleButton}`) === null) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Scroll to bottom of chat messages when new messages arrive
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      const newUserMessage = { id: Date.now(), text: input, sender: 'user' };
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);
      setInput('');
      setIsTyping(true); // Show typing indicator

      // Prepare conversation history for the AI
      const conversationHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model', // Gemini expects 'user' or 'model'
        parts: [{ text: msg.text }]
      }));

      let context = '';
      // Check if the user is asking about the page
      if (newUserMessage.text.toLowerCase().includes('explain this page') || 
          newUserMessage.text.toLowerCase().includes('about this page') ||
          newUserMessage.text.toLowerCase().includes('what is this page about')) {
        context = getPageContext();
      }

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            message: newUserMessage.text, 
            history: conversationHistory, 
            pageContext: context // Pass page context if applicable
          }),
        });

        const data = await res.json();

        if (res.ok) {
          const aiResponse = { id: Date.now() + 1, text: data.reply, sender: 'ai' };
          setMessages((prevMessages) => [...prevMessages, aiResponse]);
        } else {
          setMessages((prevMessages) => [...prevMessages, { id: Date.now() + 1, text: data.message || 'Error getting response.', sender: 'ai' }]);
          console.error('API Error:', data.error);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setMessages((prevMessages) => [...prevMessages, { id: Date.now() + 1, text: 'Network error. Please try again.', sender: 'ai' }]);
      } finally {
        setIsTyping(false); // Hide typing indicator
      }
    }
  };

  return (
    <>
      {/* Floating Chat Toggle Button */}
      <button
        className={styles.chatToggleButton}
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div ref={chatWindowRef} className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <span>AI Assistant</span>
            <button onClick={toggleChat} className={styles.closeButton} aria-label="Close chat">
              <X size={20} />
            </button>
          </div>
          <div ref={chatBodyRef} className={styles.chatBody}>
            {messages.length === 0 ? (
              <p className={styles.initialMessage}>Ask me anything about this page or your queries!</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`${styles.message} ${styles[msg.sender]}`}>
                  {msg.text}
                </div>
              ))
            )}
            {isTyping && (
                <div className={`${styles.message} ${styles.ai} ${styles.typingIndicator}`}>
                    <span>.</span><span>.</span><span>.</span>
                </div>
            )}
          </div>
          <form onSubmit={handleSendMessage} className={styles.chatInputForm}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className={styles.chatInput}
              disabled={isTyping} // Disable input while AI is typing
            />
            <button type="submit" className={styles.sendButton} disabled={isTyping}>
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}