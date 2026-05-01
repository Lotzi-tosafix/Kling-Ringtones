import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Ringtone } from '../types';
import RingtoneCard from './RingtoneCard';

interface SectionSliderProps {
  title: string;
  subtitle?: string;
  ringtones: Ringtone[];
  viewAllHref: string;
  onPlay?: (driveId: string) => void;
  playingId?: string;
  icon?: React.ReactNode;
}

export default function SectionSlider({ title, subtitle, ringtones, viewAllHref, onPlay, playingId, icon }: SectionSliderProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-6">
      <div className="flex items-end justify-between mb-6">
        <div className="space-y-1">
          <h2 className={`text-2xl font-bold flex items-center gap-2 ${title.includes('החדשים') ? 'text-brand-pink' : 'text-slate-700'}`}>
            {icon}
            {title}
          </h2>
          {subtitle && <p className="text-gray-400 text-xs">{subtitle}</p>}
        </div>
        <a 
          href={viewAllHref}
          className={`text-sm font-bold border-b-2 transition-all ${title.includes('החדשים') ? 'text-brand-teal border-brand-teal' : 'text-brand-pink border-brand-pink'}`}
        >
          לכל {title.split(' ')[0]} ➔
        </a>
      </div>

      <div className="group relative">
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x px-1"
        >
          {ringtones.map((ringtone) => (
            <div key={ringtone.id} className="min-w-[280px] max-w-[280px] snap-start">
              <RingtoneCard 
                ringtone={ringtone} 
                viewMode="grid" 
                onPlay={onPlay} 
                isPlaying={playingId === ringtone.driveId} 
              />
            </div>
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white shadow-xl rounded-full p-2 text-slate-600 hover:text-brand-pink opacity-0 group-hover:opacity-100 transition-opacity z-10 hidden lg:block"
        >
          <ChevronRight size={24} />
        </button>
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white shadow-xl rounded-full p-2 text-slate-600 hover:text-brand-pink opacity-0 group-hover:opacity-100 transition-opacity z-10 hidden lg:block"
        >
          <ChevronLeft size={24} />
        </button>
      </div>
    </section>
  );
}
