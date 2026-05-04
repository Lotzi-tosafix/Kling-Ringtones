import React, { createContext, useContext, useState, useRef } from 'react';

interface AudioContextType {
  playingId: string | null;
  play: (driveId: string) => void;
  pause: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = (playableId: string) => {
    if (playingId === playableId) {
      pause();
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    setPlayingId(playableId);
    
    // Check if it's a full URL (Firebase Storage) or a Drive ID
    const streamUrl = playableId.startsWith('http') 
        ? playableId 
        : `https://drive.google.com/uc?export=download&id=${playableId}`;
    
    if (!audioRef.current) {
      audioRef.current = new Audio(streamUrl);
    } else {
      audioRef.current.src = streamUrl;
    }
    
    audioRef.current.play().catch(console.error);
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayingId(null);
  };

  return (
    <AudioContext.Provider value={{ playingId, play, pause }}>
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudio must be used within AudioProvider");
  return context;
}
