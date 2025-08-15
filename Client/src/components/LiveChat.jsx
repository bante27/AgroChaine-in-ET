// components/LiveChat.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import Draggable from 'react-draggable';
import { Resizable } from 're-resizable';

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatRef = useRef(null);
  const listRef = useRef(null);

  // Send message
  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInput('');

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      if (res.ok) setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Enter key
  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Auto-scroll
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = e => {
      if (chatRef.current && !chatRef.current.contains(e.target)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <Draggable bounds="parent">
      <div ref={chatRef} className="fixed bottom-5 right-5 z-50 cursor-move">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-emerald-700"
          >
            Live Chat
          </button>
        )}

        {isOpen && (
          <Resizable
            defaultSize={{ width: 320, height: 400 }}
            minWidth={250} minHeight={300} maxWidth={600} maxHeight={600}
            enable={{ top: true, right: true, bottom: true, left: true,
                      topRight: true, bottomRight: true, bottomLeft: true, topLeft: true }}
          >
            <div className="w-full h-full bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
              {/* Header */}
              <div className="bg-emerald-600 text-white px-3 py-2 flex items-center justify-between cursor-move">
                <span className="font-semibold">AgroChain Assistant</span>
                <button onClick={() => setIsOpen(false)}>✖</button>
              </div>

              {/* Messages */}
              <div ref={listRef} className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50">
                {messages.map((m, i) => (
                  <div key={i} className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${
                    m.sender === 'user' ? 'ml-auto bg-emerald-100' : 'mr-auto bg-white border'
                  }`}>{m.text}</div>
                ))}
                {!messages.length && <div className="text-center text-gray-500 text-sm mt-8">
                  Ask anything about AgroChain Ethiopia. I’ll reply instantly.
                </div>}
              </div>

              {/* Input */}
              <div className="p-2 border-t bg-white flex gap-2">
                <textarea
                  rows={1}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message…"
                  className="flex-1 resize-none border rounded-md px-2 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  onClick={sendMessage}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 rounded-md flex items-center gap-1"
                >
                  <Send className="w-4 h-4" /> Send
                </button>
              </div>
            </div>
          </Resizable>
        )}
      </div>
    </Draggable>
  );
}
