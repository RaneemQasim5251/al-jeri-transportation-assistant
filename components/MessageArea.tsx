
import React, { useRef, useEffect } from 'react';
import { Message as MessageType } from '../types';
import Message from './Message';

interface MessageAreaProps {
  messages: MessageType[];
  liveUser?: string;
  liveAssistant?: string;
}

const MessageArea: React.FC<MessageAreaProps> = ({ messages, liveUser, liveAssistant }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, liveUser, liveAssistant]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-asphalt-gray-900">
      {messages.map((msg) => (
        <Message key={msg.id} message={msg} />
      ))}
      {liveUser && <Message message={{id: 'live-user', role: 'user', content: liveUser, isTyping: false}} isLive={true} />}
      {liveAssistant && <Message message={{id: 'live-assistant', role: 'model', content: liveAssistant, isTyping: false}} isLive={true} />}
    </div>
  );
};

export default MessageArea;
