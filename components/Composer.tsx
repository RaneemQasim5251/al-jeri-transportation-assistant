import React, { useState } from 'react';
import { SendIcon, MicIcon, MicOffIcon } from './Icons';
import { ChatMode, Language } from '../types';
import { translations } from '../i18n';

interface ComposerProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  mode: ChatMode;
  onModeChange: () => void;
  isApiReady: boolean;
  isListening: boolean;
  language: Language;
}

const Composer: React.FC<ComposerProps> = ({
  onSendMessage,
  isLoading,
  mode,
  onModeChange,
  isApiReady,
  isListening,
  language,
}) => {
  const [inputText, setInputText] = useState('');
  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const isTextMode = mode === 'text';

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
      <div className="flex-1 relative">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isTextMode ? t.inputPlaceholder : t.inputPlaceholderListening}
          className="w-full px-4 py-2 ps-4 pe-12 border border-asphalt-gray-200 dark:border-asphalt-gray-700 rounded-full bg-asphalt-gray-100 dark:bg-asphalt-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-aljeri-green transition-shadow"
          disabled={!isApiReady || isLoading || !isTextMode}
        />
        <button
          type="submit"
          className="absolute inset-y-0 end-2 flex items-center p-2 rounded-full text-aljeri-blue hover:bg-aljeri-blue/10 disabled:text-gray-400 disabled:hover:bg-transparent transition-colors"
          disabled={!isApiReady || isLoading || !inputText.trim() || !isTextMode}
          aria-label="Send message"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </div>
      <button
        type="button"
        onClick={onModeChange}
        className={`p-3 rounded-full transition-all duration-300 ${
          isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-aljeri-green text-white hover:bg-aljeri-green/90'
        } disabled:bg-gray-400 disabled:cursor-not-allowed`}
        disabled={!isApiReady}
        aria-label={isListening ? "Stop listening" : "Start voice chat"}
      >
        {isListening ? <MicOffIcon className="w-5 h-5" /> : <MicIcon className="w-5 h-5" />}
      </button>
    </form>
  );
};

export default Composer;
