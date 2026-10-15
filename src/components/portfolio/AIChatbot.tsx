'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, CornerDownLeft } from 'lucide-react';
import { playSound } from '@/utils/sound';
import type { Profile } from '@/types/database.types';

interface AIChatbotProps {
  profile: Profile;
  themeColor: string;
  soundEnabled: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

export default function AIChatbot({ profile, themeColor, soundEnabled }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize chatbot
  useEffect(() => {
    setMessages([
      {
        id: 'init',
        sender: 'ai',
        text: `Hi there! I am ${profile.full_name}'s AI profile assistant. Ask me anything about their technical skills, career history, or featured projects!`,
      },
    ]);
  }, [profile]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const toggleChat = () => {
    playSound('click', soundEnabled);
    setIsOpen(!isOpen);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const generateResponse = (userMsg: string): string => {
    const text = userMsg.toLowerCase().trim();

    // 1. BIO / ABOUT KEYWORDS
    if (
      text.includes('about') ||
      text.includes('who are you') ||
      text.includes('yourself') ||
      text.includes('bio') ||
      text.includes('introduce') ||
      text.includes('summary')
    ) {
      return `Here is a summary of ${profile.full_name}'s professional background:\n\n"${
        profile.bio || 'Not provided.'
      }"\n\nThey currently operate under the title: ${profile.professional_title || 'Software Engineer'}.`;
    }

    // 2. SKILLS KEYWORDS
    if (
      text.includes('skill') ||
      text.includes('tech') ||
      text.includes('stack') ||
      text.includes('language') ||
      text.includes('framework') ||
      text.includes('database') ||
      text.includes('code')
    ) {
      const skills = profile.skills || [];
      if (skills.length === 0) return `${profile.full_name} has not listed any skills yet.`;
      
      const categories: Record<string, string[]> = {};
      skills.forEach((s) => {
        const cat = s.category || 'General';
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(s.skill_name);
      });

      let res = `Here are the core technical competencies of ${profile.full_name}:\n\n`;
      Object.keys(categories).forEach((cat) => {
        res += `• **${cat}**: ${categories[cat].join(', ')}\n`;
      });
      return res;
    }

    // 3. PROJECTS KEYWORDS
    if (
      text.includes('project') ||
      text.includes('work') ||
      text.includes('built') ||
      text.includes('app') ||
      text.includes('website')
    ) {
      const projects = profile.projects || [];
      if (projects.length === 0) return `${profile.full_name} hasn't compiled their projects record yet.`;

      let res = `Here are some of ${profile.full_name}'s featured projects:\n\n`;
      projects.slice(0, 3).forEach((p, idx) => {
        res += `**[${idx + 1}] ${p.title}**\n${p.description}\n\n`;
      });
      if (projects.length > 3) res += `You can see more details by scrolling to the Featured Projects section!`;
      return res;
    }

    // 4. CONTACT / HIRE KEYWORDS
    if (
      text.includes('contact') ||
      text.includes('email') ||
      text.includes('hire') ||
      text.includes('social') ||
      text.includes('linkedin') ||
      text.includes('resume')
    ) {
      const links = profile.social_links || [];
      let res = `You can connect with ${profile.full_name} via the following channels:\n\n`;
      links.forEach((l) => {
        res += `• **${l.platform}**: ${l.url}\n`;
      });
      if (profile.resume_url) {
        res += `\nYou can also download their resume: ${profile.resume_url}`;
      }
      return res;
    }

    // 5. HELLO/GREETINGS
    if (
      text === 'hi' ||
      text === 'hello' ||
      text === 'hey' ||
      text === 'greetings'
    ) {
      return `Hello! How can I help you today? You can ask about my skills, projects, or professional summary.`;
    }

    // 6. DEFAULT FALLBACK
    return `I'm not fully sure about "${userMsg}". As ${profile.full_name}'s AI assistant, I'm best at describing their:
• **Technical Stack** (try asking: "what are your skills?")
• **Projects** (try asking: "tell me about your projects")
• **Bio** (try asking: "who are you?")
• **Contact Info** (try asking: "how can I contact you?")`;
  };

  const sendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Play click sound
    playSound('click', soundEnabled);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const responseText = generateResponse(textToSend);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: responseText,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
      playSound('success', soundEnabled);
    }, 1200);
  };

  return (
    <>
      {/* Floating Chat Bubble FAB */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-24 z-40 p-4 rounded-full text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
        style={{
          background: `linear-gradient(135deg, ${themeColor}, #0ea5e9)`,
          boxShadow: `0 8px 30px -5px ${themeColor}50`,
        }}
        title="Chat with AI Assistant"
      >
        <MessageSquare size={22} />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-40 w-[350px] sm:w-[380px] h-[485px] bg-[#ffffff] border border-[#d8e7f0] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{
              boxShadow: `0 20px 40px -15px rgba(19, 124, 194, 0.2)`,
            }}
          >
            {/* Header */}
            <div
              className="px-4.5 py-3.5 flex items-center justify-between text-[#0f1419] border-b border-[#d8e7f0] bg-[#ebf3f3]"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: themeColor }}
                >
                  <Bot size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold leading-none text-[#0f1419]">Profile AI Agent</h4>
                  <span className="text-[9px] text-[#00b87a] mt-1 inline-block font-medium">● Online & Ready</span>
                </div>
              </div>
              <button
                onClick={toggleChat}
                className="p-1 rounded-lg text-[#536471] hover:text-[#0f1419] hover:bg-[#E3ECF6] transition-all cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f7f8f8] custom-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-6.5 h-6.5 rounded-full shrink-0 flex items-center justify-center text-white text-[9px] font-bold`}
                    style={{
                      background:
                        msg.sender === 'ai'
                          ? `linear-gradient(135deg, ${themeColor}, #1e9df1)`
                          : `linear-gradient(135deg, #137cc2, #0ea5e9)`,
                    }}
                  >
                    {msg.sender === 'ai' ? <Bot size={12} /> : <User size={12} />}
                  </div>

                  {/* Message bubble */}
                  <div
                    className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-[#137cc2] text-white rounded-tr-none shadow-sm shadow-[#137cc2]/30'
                        : 'bg-[#ffffff] text-[#0f1419] border border-[#d8e7f0] rounded-tl-none shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start gap-2.5">
                  <div
                    className="w-6.5 h-6.5 rounded-full shrink-0 flex items-center justify-center text-white text-[9px] font-bold"
                    style={{ background: `linear-gradient(135deg, ${themeColor}, #1e9df1)` }}
                  >
                    <Bot size={12} />
                  </div>
                  <div className="bg-[#ffffff] border border-[#d8e7f0] p-3 rounded-2xl rounded-tl-none flex items-center gap-1 shadow-xs">
                    <span className="w-1.5 h-1.5 bg-[#137cc2] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#137cc2] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#137cc2] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              <div ref={scrollRef} />
            </div>

            {/* Suggestions list (only show if AI isn't typing) */}
            {!isTyping && (
              <div className="px-4 py-2 border-t border-[#d8e7f0] bg-[#ebf3f3] flex flex-wrap gap-1.5 shrink-0">
                {[
                  'What are your skills?',
                  'Tell me about your projects',
                  'Who are you?',
                  'How to contact you?',
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSuggestionClick(s)}
                    className="px-2 py-1 rounded-md bg-[#ffffff] border border-[#d8e7f0] text-[#536471] hover:text-[#137cc2] hover:border-[#1da1f2] hover:bg-[#E3ECF6] transition-all text-[9px] font-semibold cursor-pointer shadow-xs"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <div className="border-t border-[#d8e7f0] p-3.5 bg-[#ffffff] flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  playSound('keypress', soundEnabled);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage(input);
                  }
                }}
                placeholder="Ask something about me..."
                className="flex-1 bg-transparent text-[#0f1419] border-none outline-none focus:ring-0 text-xs p-0 placeholder-[#8d9eb1] caret-[#137cc2]"
              />
              <button
                onClick={() => sendMessage(input)}
                className="p-1.5 rounded-lg text-[#137cc2] hover:text-[#1e9df1] hover:bg-[#E3ECF6] transition-all cursor-pointer"
                title="Send Message"
              >
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
