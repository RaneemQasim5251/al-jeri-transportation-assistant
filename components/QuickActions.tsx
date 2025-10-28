import React from 'react';
import { Language } from '../types';
import { translations, QUICK_ACTION_CONFIG } from '../i18n';

interface QuickActionsProps {
  language: Language;
  onAction: (prompt: string) => void;
  disabled: boolean;
}

const QuickActions: React.FC<QuickActionsProps> = ({ language, onAction, disabled }) => {
  const t = translations[language];

  return (
    <div className="flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 scrollbar-hide">
      {QUICK_ACTION_CONFIG.map((action) => {
        const actionText = t.quickActions[action.id as keyof typeof t.quickActions];
        if (!actionText) return null;

        return (
          <button
            key={action.id}
            onClick={() => onAction(actionText.prompt)}
            disabled={disabled}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-aljeri-blue dark:text-white bg-gradient-to-r from-aljeri-blue/10 to-aljeri-green/10 hover:from-aljeri-blue/20 hover:to-aljeri-green/20 rounded-full whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border border-aljeri-blue/10 dark:border-white/10"
          >
            {action.icon}
            <span>{actionText.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default QuickActions;
