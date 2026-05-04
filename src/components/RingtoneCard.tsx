import React, { useState, useRef } from 'react';
import { Play, Pause, Download, Music, Calendar } from 'lucide-react';
import { Ringtone } from '../types';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { getArtistImage } from '../data/artists';

interface RingtoneCardProps {
  ringtone: Ringtone;
  viewMode: 'grid' | 'list';
  onPlay?: (driveId: string) => void;
  isPlaying?: boolean;
}

const RingtoneCard: React.FC<RingtoneCardProps> = ({ ringtone, viewMode, onPlay, isPlaying }) => {
  const handleDownload = async () => {
    // Increment download count in Firestore
    try {
      if (ringtone.id) {
        const ringtoneRef = doc(db, 'ringtones', ringtone.id);
        await updateDoc(ringtoneRef, {
          downloadCount: increment(1)
        });
      }
      
      const downloadUrl = ringtone.storageUrl || `https://drive.google.com/uc?export=download&id=${ringtone.driveId}`;
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error("Error downloading:", error);
    }
  };

  const artistImageUrl = getArtistImage(ringtone.artist);
  const playableId = ringtone.driveId || ringtone.storageUrl;

  if (viewMode === 'list') {
    return (
      <div className="bg-white border border-gray-50 rounded-2xl p-4 flex items-center justify-between gap-4 hover:shadow-md transition-shadow group shrink-0">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {playableId && (
            <button 
              onClick={() => onPlay?.(playableId)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg shrink-0 cursor-pointer ${isPlaying ? 'bg-brand-pink text-white scale-110 shadow-brand-pink/20' : 'bg-brand-teal text-white shadow-brand-teal/20 group-hover:scale-105'}`}
            >
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
            </button>
          )}
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-100 hidden sm:block">
            <img src={artistImageUrl} alt={ringtone.artist} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-sm text-slate-800 truncate">{ringtone.title}</h4>
            <p className="text-xs text-gray-500 truncate">{ringtone.artist}</p>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-2">
          <span className="bg-gray-100 text-[10px] px-2 py-0.5 rounded text-gray-400 font-medium">#{ringtone.year} #{ringtone.month}</span>
        </div>

        <button 
          onClick={handleDownload}
          className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors shrink-0 cursor-pointer"
        >
          <Download size={16} />
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 hover:shadow-md transition-shadow relative group flex flex-col gap-3"
    >
      <div className="flex items-center gap-3 mb-1">
        <div className="relative">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-transparent group-hover:border-brand-teal/30 transition-all">
            <img src={artistImageUrl} alt={ringtone.artist} className="w-full h-full object-cover filter group-hover:brightness-105" />
          </div>
          {playableId && (
            <button 
              onClick={() => onPlay?.(playableId)}
              className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-white shadow-md transition-all cursor-pointer ${isPlaying ? 'bg-brand-pink scale-110' : 'bg-brand-teal hover:scale-105'}`}
            >
              {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" className="ml-0.5" />}
            </button>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-sm text-slate-800 truncate">{ringtone.title}</h4>
          <p className="text-xs text-brand-teal font-medium truncate">{ringtone.artist}</p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-gray-50">
        <span className="bg-gray-100 text-[10px] px-2 py-0.5 rounded text-gray-400 font-medium whitespace-nowrap">#{ringtone.year} #{ringtone.month}</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400 font-medium">{ringtone.downloadCount}</span>
          <button 
            onClick={handleDownload}
            className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-brand-teal transition-colors cursor-pointer"
          >
            <Download size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default RingtoneCard;
