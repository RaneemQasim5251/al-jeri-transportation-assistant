import React from 'react';

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  isTyping: boolean;
}

export interface QuickActionConfig {
  id: string;
  icon: React.ReactElement;
}

export type ChatMode = 'text' | 'voice';
export type Language = 'en' | 'ar';
