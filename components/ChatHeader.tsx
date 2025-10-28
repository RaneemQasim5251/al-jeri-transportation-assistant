import React from 'react';
import { CloseIcon, TruckIcon } from './Icons';
import { Language } from '../types';
import { translations } from '../i18n';

interface ChatHeaderProps {
  onClose: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose, language, setLanguage }) => {
  const t = translations[language];

  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-aljeri-blue to-aljeri-green rounded-t-2xl shadow-md">
      <div className="flex items-center gap-3">
        <div className="bg-aljeri-green p-2 rounded-full">
          <TruckIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-lg text-white">{t.title}</h2>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <p className="text-sm text-white/90">{t.status}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full p-1">
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-all ${language === 'en' ? 'bg-white text-aljeri-blue shadow-sm' : 'text-white hover:bg-white/10'}`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('ar')}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-all ${language === 'ar' ? 'bg-white text-aljeri-blue shadow-sm' : 'text-white hover:bg-white/10'}`}
          >
            ع
          </button>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
          aria-label="Close chat"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
