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
    <div className="flex items-center justify-between p-4 bg-asphalt-gray-100 dark:bg-asphalt-gray-800 rounded-t-2xl border-b border-asphalt-gray-200 dark:border-asphalt-gray-700">
      <div className="flex items-center gap-3">
        <div className="bg-aljeri-green p-2 rounded-full">
          <TruckIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-lg text-aljeri-blue dark:text-white">{t.title}</h2>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t.status}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-full">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-0.5 text-xs rounded-full ${language === 'en' ? 'bg-aljeri-blue text-white' : 'text-gray-600 dark:text-gray-300'}`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('ar')}
            className={`px-2 py-0.5 text-xs rounded-full ${language === 'ar' ? 'bg-aljeri-blue text-white' : 'text-gray-600 dark:text-gray-300'}`}
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
