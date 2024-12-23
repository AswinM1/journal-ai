import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Home.css'; // Importing the custom CSS file

const Home = () => {
  const [input, setInput] = useState('');
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [responses]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      return;
    }

    setLoading(true);

    const newEntry = { role: 'user', content: input };
    setResponses(prev => [...prev, newEntry]);
    setInput('');

    try {
      const res = await axios.post("http://localhost:3000/main", { input });
      const replyContent = res.data.reply?.choices?.[0]?.message?.content || "No response available.";

      const assistantReply = { role: 'assistant', content: replyContent };
      setResponses(prev => [...prev, assistantReply]);
    } catch (error) {
      console.error("There was an error making the request", error);
      const errorMessage = { role: 'assistant', content: "Sorry, something went wrong." };
      setResponses(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="journal-assistant">
      <div className="sidebar">
        <h1>Journal Assistant</h1>
        <p>Your AI-powered journaling companion</p>
      </div>
      <div className="main-content">
        <div className="conversation">
          {responses.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              <div className="message-content">
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="input-area">
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your journal entry here..."
            rows="3"
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading || !input.trim()}>
            {loading ? "Processing..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
