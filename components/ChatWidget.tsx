import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message, ChatMode, Language } from '../types';
import { getSystemPrompt, checkApiKey } from '../constants';
import { translations } from '../i18n';
import { GoogleGenAI, Chat } from '@google/genai';
import ChatHeader from './ChatHeader';
import MessageArea from './MessageArea';
import Composer from './Composer';
import QuickActions from './QuickActions';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onClose }) => {
  const [language, setLanguage] = useState<Language>('ar');
  const [messages, setMessages] = useState<Message[]>([]);
  const [chat, setChat] = useState<Chat | null>(null);
  const [mode, setMode] = useState<ChatMode>('text');
  const [isLoading, setIsLoading] = useState(false);
  const [isApiReady, setIsApiReady] = useState(false);
  
  const t = translations[language];

  const {
    isSessionActive,
    userTranscription,
    assistantTranscription,
    startSession,
    stopSession,
  } = useVoiceAssistant(getSystemPrompt(language), (user, assistant) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString() + '-user', role: 'user', content: user, isTyping: false },
      { id: Date.now().toString() + '-model', role: 'model', content: assistant, isTyping: false },
    ]);
  }, language);
  
  useEffect(() => {
    // Set initial message when language changes or widget opens
    setMessages([{ id: '1', role: 'model', content: t.initialMessage, isTyping: false }]);
  }, [language, t.initialMessage]);
  
  useEffect(() => {
    if (isOpen) {
      const apiKeyPresent = checkApiKey();
      setIsApiReady(apiKeyPresent);

      if (apiKeyPresent) {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const chatSession = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: getSystemPrompt(language),
          },
        });
        setChat(chatSession);
      } else {
        // Prevent adding multiple error messages
        setMessages(prev => {
            if (prev.some(m => m.id === 'api-key-error')) {
                return prev;
            }
            return [...prev, {id: 'api-key-error', role: 'model', content: t.apiKeyError, isTyping: false}];
        });
      }
    } else {
        // Cleanup when widget closes
        if(isSessionActive) stopSession();
        setMode('text');
    }
  }, [isOpen, language, isSessionActive, stopSession, t.apiKeyError]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading || !chat || !isApiReady) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: text, isTyping: false };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    const modelTypingMessage: Message = { id: 'typing', role: 'model', content: '', isTyping: true };
    setMessages(prev => [...prev, modelTypingMessage]);

    try {
      const result = await chat.sendMessageStream({ message: text });
      let streamedText = '';
      for await (const chunk of result) {
        streamedText += chunk.text;
        setMessages(prev =>
          prev.map(m => (m.id === 'typing' ? { ...m, content: streamedText } : m))
        );
      }
      setMessages(prev =>
        prev.map(m => (m.id === 'typing' ? { ...m, id: Date.now().toString(), isTyping: false } : m))
      );
    } catch (error) {
      console.error('Gemini API error:', error);
       setMessages(prev =>
        prev.map(m => (m.id === 'typing' ? { ...m, id: Date.now().toString(), content: t.error, isTyping: false } : m))
      );
    } finally {
      setIsLoading(false);
    }
  }, [chat, isLoading, isApiReady, t.error]);

  const handleQuickAction = (prompt: string) => {
    handleSendMessage(prompt);
  };
  
  const handleModeChange = () => {
    if(mode === 'text') {
        setMode('voice');
        startSession();
    } else {
        setMode('text');
        stopSession();
    }
  }

  return (
    <div
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className={`fixed bottom-5 right-5 w-[calc(100%-40px)] h-[calc(100%-60px)] md:w-[420px] md:h-[600px] flex flex-col bg-white dark:bg-asphalt-gray-800 rounded-2xl shadow-2xl transition-all duration-300 ease-in-out ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
      style={{boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2), 0 20px 40px -10px rgba(0,0,0,0.2)'}}
    >
      <ChatHeader onClose={onClose} language={language} setLanguage={setLanguage} />
      <MessageArea messages={messages} liveUser={userTranscription} liveAssistant={assistantTranscription} />
      <div className="p-4 border-t border-asphalt-gray-200 dark:border-asphalt-gray-800">
        <QuickActions language={language} onAction={handleQuickAction} disabled={isLoading || !isApiReady || mode === 'voice'} />
        <Composer
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          mode={mode}
          onModeChange={handleModeChange}
          isApiReady={isApiReady}
          isListening={isSessionActive}
          language={language}
        />
      </div>
    </div>
  );
};

export default ChatWidget;