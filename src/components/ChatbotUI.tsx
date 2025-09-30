'use client'
import { useState, useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"

export default function ChatbotUI() {
  const [messages, setMessages] = useState<string[]>([])
  const [newMessage, setNewMessage] = useState<string>('')
  const chatbotRef = useRef<HTMLDivElement>(null)
  const [minimized, setMinimized] = useState(false);
  const isDragging = useRef(false)
  const offset = useRef({ x: 0, y: 0 })
  const { t, i18n } = useTranslation()

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


    <div>
      {minimized ? (
        <div className="fixed bottom-4 right-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg" onClick={() => setMinimized(false)}>
          💬
        </div>
      ) : (
        <div className="touch-none" dir={i18n.language === 'en' ? 'ltr' : 'rtl'}
          id="chatbot-ui"
          ref={chatbotRef}
          style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="max-w-2xl mx-auto p-4 bg-gray-50 rounded-lg shadow-md h-full flex flex-col">
            <h1 className="text-xl font-bold mb-4 text-blue-700">{t('chatbotTitle')}</h1>

            <div className="space-y-2 mb-4 flex-1 overflow-y-auto border rounded p-2 bg-white">
              {messages.map((msg, i) => (
                <p key={i} className="text-sm text-gray-800">{msg}</p>
              ))}
            </div>

            <textarea
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder={t('typeYourMessage')}
              className="w-full border rounded p-2 mb-2 resize-none"
            />

            <button
              onClick={sendMessage}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            >
              {t('send')}
            </button>
            <button
              className="absolute top-2 right-2 text-sm text-gray-500"
              onClick={() => setMinimized(true)}
            >
              ⤵️ {t('minimize')}
            </button>
          </div>
        </div>
      )}


    </div>
  )
}