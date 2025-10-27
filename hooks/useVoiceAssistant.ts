import { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { checkApiKey } from '../constants';
import { Language } from '../types';

// Audio decoding helpers from Gemini documentation
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


// Audio encoding helper
function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function useVoiceAssistant(systemInstruction: string, onTurnComplete: (user: string, assistant: string) => void, language: Language) {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [userTranscription, setUserTranscription] = useState('');
  const [assistantTranscription, setAssistantTranscription] = useState('');
  
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef(0);

  const userTranscriptionRef = useRef('');
  const assistantTranscriptionRef = useRef('');

  const stopSession = useCallback(() => {
    if (sessionPromiseRef.current) {
        sessionPromiseRef.current.then(session => session.close()).catch(console.error);
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (scriptProcessorRef.current) scriptProcessorRef.current.disconnect();
    if (sourceNodeRef.current) sourceNodeRef.current.disconnect();
    if (audioContextRef.current?.state !== 'closed') audioContextRef.current.close();
    if (outputAudioContextRef.current?.state !== 'closed') outputAudioContextRef.current.close();
    
    audioQueueRef.current.forEach(source => source.stop());
    audioQueueRef.current.clear();

    setIsSessionActive(false);
    sessionPromiseRef.current = null;
    setUserTranscription('');
    setAssistantTranscription('');
    userTranscriptionRef.current = '';
    assistantTranscriptionRef.current = '';
    nextStartTimeRef.current = 0;
  }, []);
  
  // Cleanup on unmount
  useEffect(() => stopSession, [stopSession]);


  const startSession = useCallback(async () => {
    if (isSessionActive || !checkApiKey()) return;

    setIsSessionActive(true);

    try {
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      sessionPromiseRef.current = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: systemInstruction,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: language === 'ar' ? 'Kore' : 'Puck' } }
          }
        },
        callbacks: {
          onopen: () => {
            const inputAudioContext = audioContextRef.current!;
            sourceNodeRef.current = inputAudioContext.createMediaStreamSource(mediaStreamRef.current!);
            scriptProcessorRef.current = inputAudioContext.createScriptProcessor(4096, 1, 1);

            scriptProcessorRef.current.onaudioprocess = (event) => {
              const inputData = event.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob: Blob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromiseRef.current?.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            sourceNodeRef.current.connect(scriptProcessorRef.current);
            scriptProcessorRef.current.connect(inputAudioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
             if (message.serverContent?.inputTranscription) {
                userTranscriptionRef.current += message.serverContent.inputTranscription.text;
                setUserTranscription(userTranscriptionRef.current);
            }
            if (message.serverContent?.outputTranscription) {
                assistantTranscriptionRef.current += message.serverContent.outputTranscription.text;
                setAssistantTranscription(assistantTranscriptionRef.current);
            }

            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && outputAudioContextRef.current) {
                const audioContext = outputAudioContextRef.current;
                const audioBuffer = await decodeAudioData(decode(audioData), audioContext, 24000, 1);
                
                const source = audioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContext.destination);

                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioContext.currentTime);
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;

                source.addEventListener('ended', () => audioQueueRef.current.delete(source));
                audioQueueRef.current.add(source);
            }
            
            if(message.serverContent?.interrupted){
                audioQueueRef.current.forEach(source => source.stop());
                audioQueueRef.current.clear();
                nextStartTimeRef.current = 0;
            }

            if (message.serverContent?.turnComplete) {
                const fullInput = userTranscriptionRef.current.trim();
                const fullOutput = assistantTranscriptionRef.current.trim();
                if (fullInput && fullOutput) onTurnComplete(fullInput, fullOutput);
                userTranscriptionRef.current = '';
                assistantTranscriptionRef.current = '';
                setUserTranscription('');
                setAssistantTranscription('');
            }
          },
          onerror: (e: ErrorEvent) => { console.error('Live session error:', e); stopSession(); },
          onclose: () => stopSession(),
        },
      });
    } catch (error) {
      console.error('Failed to start voice session:', error);
      setIsSessionActive(false);
    }
  }, [isSessionActive, systemInstruction, stopSession, onTurnComplete, language]);

  return { isSessionActive, userTranscription, assistantTranscription, startSession, stopSession };
}
