
import React, { useState } from 'react';
import ChatWidget from './components/ChatWidget';
import { ChatIcon } from './components/Icons';

const App: React.FC = () => {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  const toggleWidget = () => {
    setIsWidgetOpen(prev => !prev);
  };

  return (
    <div className="bg-asphalt-gray-100 dark:bg-asphalt-gray-900 min-h-screen w-full font-sans transition-colors">
      <div className="absolute bottom-5 right-5 z-50">
        {!isWidgetOpen && (
          <button
            onClick={toggleWidget}
            className="bg-aljeri-blue text-white rounded-full p-4 shadow-lg hover:bg-aljeri-blue/90 focus:outline-none focus:ring-2 focus:ring-aljeri-green focus:ring-offset-2 transition-transform transform hover:scale-110"
            aria-label="Open Chat"
          >
            <ChatIcon className="h-8 w-8" />
          </button>
        )}
      </div>
      <ChatWidget isOpen={isWidgetOpen} onClose={toggleWidget} />
    </div>
  );
};

export default App;
