'use client'
import { useState, useEffect } from "react"
export default function ChatbotUI() {
    const [messages, setMessages] = useState<string[]>([])
    const [newMessage, setNewMessage] = useState<string>('')
    const sendMessage = async () => {
        const response = await fetch('http://localhost:3001/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: newMessage }),
        });

        const data = await response.json(); // assuming response shape: { reply: string }

        setMessages(prev => [...prev, `🧑 ${newMessage}`, `🤖 ${data.reply}`]);
        setNewMessage('');
    };
    return (
        <div className="max-w-2xl mx-auto p-4 bg-gray-50 rounded-lg shadow-md">
            <h1 className="text-xl font-bold mb-4 text-blue-700">TechMart Chatbot</h1>

            <div className="space-y-2 mb-4 h-64 overflow-y-auto border rounded p-2 bg-white">
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
    )
}