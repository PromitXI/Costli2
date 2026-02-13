import React, { useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';
import { Compass, Send } from 'lucide-react';
import { ChatMessage, CloudProvider } from '../types';
import { AgentChatSession, createAgentChatSession } from '../services/agentService';

interface CostCompassProps {
  initialPrompt: string;
  provider: CloudProvider;
  onChatUpdate: (userText: string, modelText: string) => void;
}

const CostCompass: React.FC<CostCompassProps> = ({ initialPrompt, provider, onChatUpdate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatSessionRef = useRef<AgentChatSession | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    chatSessionRef.current = createAgentChatSession(provider);
    const displayPrompt = initialPrompt.length > 150 ? `${initialPrompt.substring(0, 150).trim()}...` : initialPrompt;

    setMessages([
      {
        id: 'init-1',
        role: 'model',
        text: `I am reviewing your ${provider} request: "${displayPrompt}". Share budget or timeline constraints and I will tailor the actions.`,
      },
    ]);
  }, [provider, initialPrompt]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const responseText = await chatSessionRef.current.sendMessage(userMsg.text);
      const botMsg: ChatMessage = { id: `${Date.now()}-bot`, role: 'model', text: responseText };
      setMessages((prev) => [...prev, botMsg]);
      onChatUpdate(userMsg.text, responseText);
    } catch (error) {
      console.error('Chat error', error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center gap-3 border-b border-black/10 px-4 py-3">
        <div className="rounded-xl border border-black/10 bg-slate-50 p-2">
          <Compass className="h-4 w-4 text-slate-800" />
        </div>
        <div>
          <div className="text-sm font-bold text-slate-900">Cost Compass</div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{provider}</div>
        </div>
      </div>

      <div ref={scrollRef} className="no-scrollbar flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'user' ? (
              <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-slate-900 px-3 py-2 text-sm text-white">{msg.text}</div>
            ) : (
              <div className="max-w-[90%] rounded-2xl rounded-bl-sm border border-black/10 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                <Markdown
                  components={{
                    p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                    strong: ({ node, ...props }) => <strong className="font-semibold text-slate-900" {...props} />,
                    ul: ({ node, ...props }) => <ul className="mb-2 list-inside list-disc space-y-1" {...props} />,
                  }}
                >
                  {msg.text}
                </Markdown>
              </div>
            )}
          </div>
        ))}

        {isTyping && <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Thinking...</div>}
      </div>

      <div className="border-t border-black/10 p-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask follow-up questions"
            className="h-11 flex-1 rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-slate-400"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CostCompass;
