import React from 'react';
import { Message as MessageType } from '../types';
import { UserIcon, TruckIcon } from './Icons';

interface MessageProps {
  message: MessageType;
  isLive?: boolean;
}

const TypingIndicator: React.FC = () => (
  <div className="flex items-center gap-1">
    <span className="h-2 w-2 bg-aljeri-blue/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
    <span className="h-2 w-2 bg-aljeri-blue/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
    <span className="h-2 w-2 bg-aljeri-blue/50 rounded-full animate-bounce"></span>
  </div>
);

const Message: React.FC<MessageProps> = ({ message, isLive = false }) => {
  const isUser = message.role === 'user';

  const containerClasses = `flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`;
  const bubbleClasses = `max-w-xs md:max-w-md px-4 py-3 rounded-2xl ${
    isUser
      ? 'bg-aljeri-blue text-white ltr:rounded-br-lg rtl:rounded-bl-lg'
      : 'bg-asphalt-gray-100 dark:bg-asphalt-gray-800 text-gray-800 dark:text-gray-200 ltr:rounded-bl-lg rtl:rounded-br-lg'
  } ${isLive ? 'opacity-70' : ''}`;
  const iconClasses = `w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
    isUser ? 'bg-aljeri-green text-white' : 'bg-asphalt-gray-200 dark:bg-asphalt-gray-700 text-aljeri-blue dark:text-white'
  }`;

  const Icon = isUser ? UserIcon : TruckIcon;

  return (
    <div className={containerClasses}>
      {!isUser && (
        <div className={iconClasses}>
          <Icon className="w-5 h-5" />
        </div>
      )}
      <div className={bubbleClasses}>
        {message.isTyping ? <TypingIndicator /> : <p className="whitespace-pre-wrap">{message.content}</p>}
      </div>
      {isUser && (
        <div className={iconClasses}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};

export default Message;
