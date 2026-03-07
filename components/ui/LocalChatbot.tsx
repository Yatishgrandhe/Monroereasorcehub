'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import { getBotResponse, QUICK_REPLIES } from '@/lib/chatbot-responses';

type Message = { id: string; role: 'user' | 'bot'; text: string; at: Date };

function formatTime(d: Date) {
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function renderTextWithBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**') ? (
      <strong key={i} className="font-semibold text-[var(--color-text)]">{p.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}

const WELCOME = 'Hi! I\'m the Monroe Resource Hub assistant. I can help you find resources, events, organizations, and how to use this site. Ask anything or pick a quick reply below.';

export function LocalChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);

  const addMessage = (role: 'user' | 'bot', text: string) => {
    const m: Message = { id: crypto.randomUUID(), role, text, at: new Date() };
    setMessages((prev) => [...prev, m]);
    return m;
  };

  const sendUserMessage = (text: string) => {
    const t = text.trim();
    if (!t) return;
    addMessage('user', t);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const reply = getBotResponse(t);
      addMessage('bot', reply);
      setTyping(false);
      if (liveRef.current) {
        liveRef.current.textContent = reply;
      }
    }, 600 + Math.min(t.length * 20, 400));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendUserMessage(input);
  };

  const handleQuickReply = (label: string) => {
    sendUserMessage(label);
  };

  // Focus trap when panel is open
  useEffect(() => {
    if (!open || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input, [href]'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  // Escape to close
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  // Scroll to bottom on new messages
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const showWelcome = messages.length === 0 && !typing;

  return (
    <>
      {/* Live region for screen readers */}
      <div
        ref={liveRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-0 font-[var(--font-body)]">
        {open && (
          <div
            ref={panelRef}
            role="dialog"
            aria-label="Monroe Resource Hub assistant"
            aria-modal="true"
            className="w-[360px] max-w-[calc(100vw-3rem)] max-h-[min(70vh,520px)] flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-primary)] text-white">
              <span className="font-semibold text-sm">Monroe Resource Hub</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Minimize chat"
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Minimize2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div
              ref={listRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
            >
              {showWelcome && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-[var(--color-border)]/40 px-4 py-3 text-sm text-[var(--color-text)]">
                    <p className="leading-relaxed">{WELCOME}</p>
                    <p className="mt-3 text-xs text-[var(--color-text-muted)]">
                      {formatTime(new Date())}
                    </p>
                  </div>
                </div>
              )}

              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                      m.role === 'user'
                        ? 'rounded-tr-sm bg-[var(--color-primary)] text-white'
                        : 'rounded-tl-sm bg-[var(--color-border)]/40 text-[var(--color-text)]'
                    }`}
                  >
                    <p className="leading-relaxed">
                      {m.role === 'bot' ? renderTextWithBold(m.text) : m.text}
                    </p>
                    <p
                      className={`mt-2 text-xs ${m.role === 'user' ? 'text-white/80' : 'text-[var(--color-text-muted)]'}`}
                    >
                      {formatTime(m.at)}
                    </p>
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-tl-sm bg-[var(--color-border)]/40 px-4 py-3">
                    <span className="inline-flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-[var(--color-text-muted)] animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 rounded-full bg-[var(--color-text-muted)] animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 rounded-full bg-[var(--color-text-muted)] animate-bounce [animation-delay:300ms]" />
                    </span>
                  </div>
                </div>
              )}

              {showWelcome && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {QUICK_REPLIES.map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => handleQuickReply(label)}
                      className="px-3 py-2 rounded-xl text-xs font-medium border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-bg)] hover:border-[var(--color-primary)]/40 transition-colors"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="p-3 border-t border-[var(--color-border)]">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about resources, events, or how to use the site..."
                  aria-label="Message"
                  className="flex-1 min-w-0 h-11 px-4 rounded-xl border border-[var(--color-border)] bg-white text-[var(--color-text)] placeholder:text-[var(--color-text-light)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  className="h-11 w-11 shrink-0 flex items-center justify-center rounded-xl bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close chat' : 'Open chat'}
          aria-expanded={open}
          className="h-14 w-14 rounded-full bg-[var(--color-primary)] text-white shadow-lg hover:bg-[var(--color-primary-dark)] hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 flex items-center justify-center"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      </div>
    </>
  );
}
