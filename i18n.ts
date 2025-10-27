import React from 'react';
import { ServicesIcon, TruckIcon, BranchIcon, ContactIcon } from './components/Icons';
import { QuickActionConfig } from './types';

// FIX: Replaced JSX with React.createElement to support usage in a .ts file.
// JSX syntax is not supported in files with a .ts extension, which caused parsing errors.
export const QUICK_ACTION_CONFIG: QuickActionConfig[] = [
  { id: 'services', icon: React.createElement(ServicesIcon, { className: "h-4 w-4" }) },
  { id: 'fleet', icon: React.createElement(TruckIcon, { className: "h-4 w-4" }) },
  { id: 'branches', icon: React.createElement(BranchIcon, { className: "h-4 w-4" }) },
  { id: 'contact', icon: React.createElement(ContactIcon, { className: "h-4 w-4" }) },
];

export const translations = {
  ar: {
    title: 'مساعد الجري',
    status: 'متصل',
    initialMessage: 'يا هلا والله! أنا مساعد الجري للنقليات. أقدر أوضح لك خدماتنا مثل نقل الوقود أو السيارات، أو أطلعك على فروعنا. وش تبي تعرف اليوم؟',
    inputPlaceholder: 'اكتب رسالتك...',
    inputPlaceholderListening: 'أستمع...',
    quickActions: {
      services: { label: 'الخدمات', prompt: 'ما هي الخدمات التي تقدمونها؟' },
      fleet: { label: 'أسطولنا', prompt: 'حدثني عن حجم أسطولكم.' },
      branches: { label: 'الفروع', prompt: 'أين تقع فروعكم؟' },
      contact: { label: 'تواصل معنا', prompt: 'كيف يمكنني التواصل معكم؟' },
    },
    error: 'عفواً، حدث خطأ ما. الرجاء المحاولة مرة أخرى.',
    apiKeyError: 'مفتاح الواجهة البرمجية (API key) غير مُعد. الرجاء التأكد من إعداده في متغيرات البيئة لاستخدام المساعد.'
  },
  en: {
    title: 'Al Jeri Assistant',
    status: 'Online',
    initialMessage: "Hi there! I'm Al Jeri Transportation's assistant. I can tell you about our services, fleet, and branches. What would you like to know today?",
    inputPlaceholder: 'Type your message...',
    inputPlaceholderListening: 'Listening...',
    quickActions: {
      services: { label: 'Services', prompt: 'What services do you offer?' },
      fleet: { label: 'Our Fleet', prompt: 'Tell me about your fleet size.' },
      branches: { label: 'Branches', prompt: 'Where are your branches located?' },
      contact: { label: 'Contact', prompt: 'How can I contact you?' },
    },
    error: 'Sorry, I encountered an error. Please try again.',
    apiKeyError: 'API key is not configured. Please ensure it is set in the environment variables to use the assistant.'
  },
};
