// components/LiveChat.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const listRef = useRef(null);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setInput('');

    try {
      // Send the message to the backend using a POST request
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Assuming the response contains the reply from the backend
      const data = await response.json();
      setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-emerald-700"
        >
          Live Chat
        </button>
      )}
      {isOpen && (
        <div className="w-80 h-96 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-emerald-600 text-white px-3 py-2 flex items-center justify-between">
            <span className="font-semibold">AgroChain Assistant</span>
            <button className="text-white/90" onClick={() => setIsOpen(false)}>
              ✖
            </button>
          </div>
          <div ref={listRef} className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${
                  m.sender === 'user' ? 'ml-auto bg-emerald-100' : 'mr-auto bg-white border'
                }`}
              >
                {m.text}
              </div>
            ))}
            {!messages.length && (
              <div className="text-center text-gray-500 text-sm mt-8">
                Ask anything about AgroChain Ethiopia. I’ll reply instantly.
              </div>
            )}
          </div>
          <div className="p-2 border-t bg-white">
            <div className="flex gap-2">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message…"
                className="flex-1 resize-none border rounded-md px-2 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                onClick={sendMessage}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 rounded-md flex items-center gap-1"
                title="Send"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
