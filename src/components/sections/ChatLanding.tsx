'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatLandingProps {
  onEnterPortfolio?: () => void;
}

const SUGGESTED_QUESTIONS = [
  "What are your best skills?",
  "Tell me about your projects",
  "What's your tech stack?",
  "Are you available?",
];

const API_URL = process.env.NEXT_PUBLIC_CHAT_API_URL || 'http://localhost:8000';

export default function ChatLanding({ onEnterPortfolio }: ChatLandingProps) {
  const { theme, colors } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Only scroll within chat container, not the whole page
  useEffect(() => {
    if (messages.length > 0 && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input without scrolling the page
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true });
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history: messages.slice(-10),
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble connecting. Try again or explore my portfolio below!" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const accentColor = theme === 'dark' ? 'rgba(196, 163, 90,' : 'rgba(139, 92, 246,';
  const hasMessages = messages.length > 0;

  return (
    <section
      id="ask"
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'clamp(20px, 5vw, 40px)',
        position: 'relative',
        overflow: 'hidden',
        background: theme === 'dark'
          ? 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(20, 18, 25, 1) 0%, rgba(10, 10, 10, 1) 100%)'
          : 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(20, 15, 30, 1) 0%, rgba(10, 10, 10, 1) 100%)',
      }}
    >
      {/* Subtle ambient glow */}
      <motion.div
        animate={{ 
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(400px, 60vw, 900px)',
          height: 'clamp(400px, 60vw, 900px)',
          borderRadius: '50%',
          background: theme === 'dark'
            ? 'radial-gradient(circle, rgba(196, 163, 90, 0.08) 0%, transparent 60%)'
            : 'radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 60%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* Corner glows */}
      <motion.div
        animate={{ opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '40%',
          height: '40%',
          borderRadius: '50%',
          background: theme === 'dark'
            ? 'radial-gradient(circle, rgba(196, 163, 90, 0.12) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <motion.div
        animate={{ opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '35%',
          height: '35%',
          borderRadius: '50%',
          background: theme === 'dark'
            ? 'radial-gradient(circle, rgba(196, 163, 90, 0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />
      <motion.div
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '30%',
          height: '30%',
          borderRadius: '50%',
          background: theme === 'dark'
            ? 'radial-gradient(circle, rgba(196, 163, 90, 0.08) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />
      <motion.div
        animate={{ opacity: [0.12, 0.2, 0.12] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        style={{
          position: 'absolute',
          bottom: '-8%',
          right: '-8%',
          width: '35%',
          height: '35%',
          borderRadius: '50%',
          background: theme === 'dark'
            ? 'radial-gradient(circle, rgba(196, 163, 90, 0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
          filter: 'blur(55px)',
          pointerEvents: 'none',
        }}
      />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          maxWidth: '680px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: hasMessages ? '20px' : '32px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header - Minimizes when chatting */}
        <motion.div
          animate={{ 
            scale: hasMessages ? 0.85 : 1,
            marginBottom: hasMessages ? -10 : 0,
          }}
          transition={{ duration: 0.4 }}
          style={{ textAlign: 'center' }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              marginBottom: '28px',
            }}
          >
            <span style={{ 
              fontFamily: 'var(--font-syncopate), sans-serif',
              fontSize: '14px', 
              letterSpacing: '3px', 
              color: theme === 'dark' ? colors.gold : '#8b5cf6',
              fontWeight: 700,
              textTransform: 'uppercase',
            }}>
              Ayaan Izhar
            </span>
          </motion.div>

          <h1
            style={{
              fontFamily: 'var(--font-syncopate), sans-serif',
              fontSize: hasMessages ? 'clamp(18px, 3vw, 24px)' : 'clamp(22px, 3.5vw, 32px)',
              fontWeight: 400,
              color: colors.text,
              margin: 0,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              transition: 'all 0.4s ease',
              lineHeight: 1.3,
            }}
          >
            {hasMessages ? 'Ask anything' : 'Ask me anything'}
          </h1>
          
          {!hasMessages && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.5 }}
              style={{
                fontSize: '13px',
                color: colors.textMuted,
                marginTop: '16px',
                fontWeight: 400,
                letterSpacing: '1px',
              }}
            >
              skills • experience • projects • availability
            </motion.p>
          )}
        </motion.div>

        {/* Chat messages */}
        <AnimatePresence>
          {hasMessages && (
            <motion.div
              ref={chatContainerRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                width: '100%',
                maxHeight: '45vh',
                overflowY: 'auto',
                padding: '4px',
                scrollbarWidth: 'thin',
                scrollbarColor: `${accentColor} 0.2) transparent`,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    style={{
                      display: 'flex',
                      justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '85%',
                        padding: '14px 18px',
                        borderRadius: message.role === 'user' 
                          ? '20px 20px 6px 20px' 
                          : '20px 20px 20px 6px',
                        background: message.role === 'user'
                          ? theme === 'dark'
                            ? 'rgba(196, 163, 90, 0.15)'
                            : 'rgba(139, 92, 246, 0.12)'
                          : theme === 'dark'
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'rgba(0, 0, 0, 0.04)',
                        border: 'none',
                        color: colors.text,
                        fontSize: '14px',
                        lineHeight: 1.7,
                        backdropFilter: 'blur(10px)',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {message.content}
                    </div>
                  </motion.div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ display: 'flex', justifyContent: 'flex-start' }}
                  >
                    <div
                      style={{
                        padding: '14px 20px',
                        borderRadius: '20px 20px 20px 6px',
                        background: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                        border: 'none',
                        display: 'flex',
                        gap: '6px',
                        alignItems: 'center',
                      }}
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ 
                            scale: [1, 1.3, 1],
                            opacity: [0.4, 1, 0.4],
                          }}
                          transition={{ 
                            duration: 0.8, 
                            repeat: Infinity, 
                            delay: i * 0.15,
                            ease: 'easeInOut',
                          }}
                          style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                            background: theme === 'dark' ? colors.gold : '#8b5cf6',
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input area */}
        <motion.form
          onSubmit={handleSubmit}
          animate={{ scale: isFocused ? 1.02 : 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            width: '100%',
            position: 'relative',
            marginTop: hasMessages ? 0 : '10px',
          }}
        >
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              minHeight: '56px',
              background: theme === 'dark'
                ? 'rgba(255, 255, 255, 0.03)'
                : 'rgba(0, 0, 0, 0.03)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: 'none',
              transition: 'all 0.3s ease',
              boxShadow: isFocused 
                ? `0 0 0 1px ${accentColor} 0.15), 0 20px 50px -15px rgba(0,0,0,0.4)` 
                : `0 0 0 1px ${accentColor} 0.05), 0 8px 30px -15px rgba(0,0,0,0.2)`,
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Ask anything..."
              disabled={isLoading}
              style={{
                width: '100%',
                height: '100%',
                padding: '18px 60px 18px 24px',
                background: 'transparent',
                border: 'none',
                color: colors.text,
                fontSize: '15px',
                outline: 'none',
                letterSpacing: '0.2px',
                lineHeight: '1.4',
                boxSizing: 'border-box',
              }}
            />
            <motion.button
              type="submit"
              disabled={isLoading || !input.trim()}
              whileTap={{ scale: 0.95 }}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                transformOrigin: 'center center',
                width: '44px',
                height: '44px',
                padding: '0',
                borderRadius: '50%',
                border: 'none',
                background: 'transparent',
                color: isLoading || !input.trim() 
                  ? colors.textMuted 
                  : theme === 'dark' ? colors.gold : '#8b5cf6',
                fontSize: '14px',
                fontWeight: 600,
                cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: isLoading || !input.trim() ? 0.3 : 1,
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
              }}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  style={{ width: '20px', height: '20px', border: '2px solid transparent', borderTopColor: 'currentColor', borderRadius: '50%' }}
                />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
              )}
            </motion.button>
          </div>
        </motion.form>

        {/* Suggested questions - Only show when no messages */}
        <AnimatePresence>
          {!hasMessages && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.5 }}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                justifyContent: 'center',
                marginTop: '8px',
              }}
            >
              {SUGGESTED_QUESTIONS.map((question, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ opacity: 1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => sendMessage(question)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '20px',
                    background: 'transparent',
                    border: 'none',
                    color: colors.textMuted,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                    opacity: 0.6,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = colors.text;
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = colors.textMuted;
                    e.currentTarget.style.opacity = '0.6';
                  }}
                >
                  {question}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>

      {/* Explore Portfolio button - Outside main wrapper for reliable clicks */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        style={{ 
          marginTop: hasMessages ? '24px' : '50px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 100,
        }}
      >
        <button
          onClick={() => {
            if (onEnterPortfolio) {
              onEnterPortfolio();
            } else {
              document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            if (onEnterPortfolio) {
              onEnterPortfolio();
            } else {
              document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          style={{
            padding: '16px 32px',
            border: 'none',
            background: 'transparent',
            color: colors.textMuted,
            fontFamily: 'var(--font-syncopate), sans-serif',
            fontSize: '11px',
            fontWeight: 400,
            cursor: 'pointer',
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            opacity: 0.5,
            transition: 'opacity 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}
        >
          <span>Explore Portfolio</span>
          <motion.svg
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </motion.svg>
        </button>
      </motion.div>

      {/* Bottom fade indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 2 }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '100px',
          background: theme === 'dark'
            ? 'linear-gradient(to top, rgba(10, 10, 10, 0.8), transparent)'
            : 'linear-gradient(to top, rgba(250, 250, 250, 0.8), transparent)',
          pointerEvents: 'none',
        }}
      />
    </section>
  );
}
