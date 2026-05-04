import React from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
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
  viewMode?: 'grid' | 'list';
}

export default function SectionSlider({ title, subtitle, ringtones, viewAllHref, onPlay, playingId, icon, viewMode = 'grid' }: SectionSliderProps) {
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

  const navigate = (path: string) => {
    const event = new CustomEvent('navigate', { detail: path });
    window.dispatchEvent(event);
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
        <button 
          onClick={() => navigate(viewAllHref)}
          className={`text-sm font-bold border-b-2 transition-all flex items-center gap-1 cursor-pointer ${title.includes('החדשים') ? 'text-brand-teal border-brand-teal' : 'text-brand-pink border-brand-pink'}`}
        >
          לכל {title.replace(/[^א-ת\s]/g, '').trim().split(' ')[0]}
          <ArrowLeft size={16} />
        </button>
      </div>

      <div className="group relative">
        <div 
          ref={scrollRef}
          className={`${viewMode === 'list' ? 'flex flex-col gap-3' : 'flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x px-1'}`}
        >
          {ringtones.map((ringtone) => (
            <div key={ringtone.id} className={`${viewMode === 'list' ? 'w-full' : 'min-w-[280px] max-w-[280px] snap-start'}`}>
              <RingtoneCard 
                ringtone={ringtone} 
                viewMode={viewMode}
                onPlay={onPlay} 
                isPlaying={playingId === ringtone.driveId} 
              />
            </div>
          ))}
        </div>

        {viewMode === 'grid' && (
          <>
            <button 
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white shadow-xl rounded-full p-2 text-slate-600 hover:text-brand-pink opacity-0 group-hover:opacity-100 transition-opacity z-10 hidden lg:block cursor-pointer"
            >
              <ChevronRight size={24} />
            </button>
            <button 
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white shadow-xl rounded-full p-2 text-slate-600 hover:text-brand-pink opacity-0 group-hover:opacity-100 transition-opacity z-10 hidden lg:block cursor-pointer"
            >
              <ChevronLeft size={24} />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
