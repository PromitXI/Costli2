import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { ChatMessage, CloudProvider } from '../types';
import { createChatSession } from '../services/geminiService';
import { Chat } from '@google/genai';

interface CostCompassProps {
  initialPrompt: string;
  provider: CloudProvider;
  onChatUpdate: (userText: string, modelText: string) => void;
}

const CostCompass: React.FC<CostCompassProps> = ({ initialPrompt, provider, onChatUpdate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Initialize Chat Session
    const session = createChatSession(provider);
    chatSessionRef.current = session;

    // Initial greeting based on context
    const initialGreeting: ChatMessage = {
      id: 'init-1',
      role: 'model',
      text: `Hello. I am reviewing your request regarding ${provider}: "${initialPrompt}". \n\nI'm analyzing the potential cost drivers now. While I generate the insights, is there any specific budget constraint or timeline I should be aware of?`
    };
    setMessages([initialGreeting]);

  }, [provider, initialPrompt]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const result = await chatSessionRef.current.sendMessage({ message: userMsg.text });
      const responseText = result.text || "I apologize, I couldn't process that. Could you rephrase?";
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText
      };
      setMessages(prev => [...prev, botMsg]);
      
      // Trigger the workspace update with the new context
      onChatUpdate(userMsg.text, responseText);

    } catch (error) {
      console.error("Chat Error", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center space-x-3 bg-slate-50/50 backdrop-blur-sm">
        <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-sm">
          <Bot size={18} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-800">Cost Compass</h2>
          <p className="text-xs text-slate-500">Consultant • {provider}</p>
        </div>
      </div>

      {/* Messages */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar"
        ref={scrollRef}
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`
                max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                ${msg.role === 'user' 
                  ? 'bg-slate-900 text-white rounded-br-none' 
                  : 'bg-slate-100 text-slate-800 rounded-bl-none'}
              `}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="bg-slate-100 rounded-2xl rounded-bl-none px-4 py-3 flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
             </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Reply to Cost Compass..."
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 focus:bg-white transition-all text-slate-700 placeholder-slate-400"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-2 p-1.5 bg-white rounded-lg text-slate-400 hover:text-slate-900 disabled:opacity-50 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CostCompass;