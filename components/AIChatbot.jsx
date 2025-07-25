import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import styles from '../styles/AIChatbot.module.css'; 

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const chatWindowRef = useRef(null);
  const chatBodyRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const getPageContext = () => {
    const title = document.title;
    const descriptionMeta = document.querySelector('meta[name="description"]');
    const description = descriptionMeta ? descriptionMeta.content : '';
    const mainContent = document.querySelector('main, article, body');
    const textContent = mainContent ? mainContent.innerText.substring(0, 1500) : '';

    return `Page Title: "${title}"\nPage Description: "${description}"\nRelevant Text Snippet: "${textContent}"`;
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
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

      const conversationHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model', 
        parts: [{ text: msg.text }]
      }));

      let context = '';
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
            pageContext: context
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
        setIsTyping(false);
      }
    }
  };

  return (
    <>
      <button
        className={styles.chatToggleButton}
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>

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
              disabled={isTyping}
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