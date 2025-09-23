'use client'
import { useState, useRef, useEffect } from "react"

export default function ChatbotUI() {
  const [messages, setMessages] = useState<string[]>([])
  const [newMessage, setNewMessage] = useState<string>('')
  const chatbotRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const offset = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !chatbotRef.current) return;
      chatbotRef.current.style.left = `${e.clientX - offset.current.x}px`;
      chatbotRef.current.style.top = `${e.clientY - offset.current.y}px`;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || !chatbotRef.current) return;
      const touch = e.touches[0];
      chatbotRef.current.style.left = `${touch.clientX - offset.current.x}px`;
      chatbotRef.current.style.top = `${touch.clientY - offset.current.y}px`;
    };

    const stopDragging = () => {
      isDragging.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', stopDragging);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', stopDragging);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!chatbotRef.current) return
    isDragging.current = true
    const rect = chatbotRef.current.getBoundingClientRect()
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!chatbotRef.current) return;
    isDragging.current = true;
    const rect = chatbotRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    offset.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  };

  const sendMessage = async () => {
    const response = await fetch(`${process.env.CHAT_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: newMessage }),
    })

    const data = await response.json()
    setMessages(prev => [...prev, `🧑 ${newMessage}`, `🤖 ${data.reply}`])
    setNewMessage('')
  }

  return (
    <div className="touch-none"
      id="chatbot-ui"
      ref={chatbotRef}
      style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="max-w-2xl mx-auto p-4 bg-gray-50 rounded-lg shadow-md h-full flex flex-col">
        <h1 className="text-xl font-bold mb-4 text-blue-700">TechMart Chatbot</h1>

        <div className="space-y-2 mb-4 flex-1 overflow-y-auto border rounded p-2 bg-white">
          {messages.map((msg, i) => (
            <p key={i} className="text-sm text-gray-800">{msg}</p>
          ))}
        </div>

        <textarea
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full border rounded p-2 mb-2 resize-none"
        />

        <button
          onClick={sendMessage}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  )
}