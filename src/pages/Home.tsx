import React, { useState, useEffect } from 'react';
import SectionSlider from '../components/SectionSlider';
import { Music, Sparkles, Flame, Mic, ArrowLeft } from 'lucide-react';
import { useAudio } from '../hooks/useAudio';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Ringtone } from '../types';
import { motion } from 'motion/react';

import { ARTISTS } from '../data/artists';

export default function Home() {
  const { playingId, play } = useAudio();
  const [newest, setNewest] = useState<Ringtone[]>([]);
  const [popular, setPopular] = useState<Ringtone[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    // Load preferred view mode
    const savedMode = localStorage.getItem('kling-view-mode') as 'grid' | 'list';
    if (savedMode) setViewMode(savedMode);

    const handleViewModeChanged = (e: any) => {
      if (e.detail) setViewMode(e.detail);
    };
    window.addEventListener('kling-view-mode-changed', handleViewModeChanged);

    // Fetch Newest Published

    const newestQuery = query(
      collection(db, 'ringtones'),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const unsubNewest = onSnapshot(newestQuery, (snapshot) => {
      setNewest(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ringtone)));
      setLoading(false);
    });

    // Fetch Popular
    const popularQuery = query(
      collection(db, 'ringtones'),
      where('status', '==', 'published'),
      orderBy('downloadCount', 'desc'),
      limit(10)
    );

    const unsubPopular = onSnapshot(popularQuery, (snapshot) => {
      setPopular(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ringtone)));
    });

    return () => {
      unsubNewest();
      unsubPopular();
      window.removeEventListener('kling-view-mode-changed', handleViewModeChanged);
    };
  }, []);

  const navigate = (path: string) => {
    const event = new CustomEvent('navigate', { detail: path });
    window.dispatchEvent(event);
  };

  // Use a specific selection of famous artists for the home page carousel
  const topArtistNames = ['ישי ריבו', 'אברהם פריד', 'חנן בן ארי', 'מרדכי בן דוד', 'נפתלי קמפה', 'בנצי שטיין'];
  const popularArtists = topArtistNames
    .map(name => ARTISTS.find(a => a.name === name))
    .filter(Boolean) as { name: string, imageUrl: string }[];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-16">
      {/* 3 Main Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          onClick={() => navigate('/new')}
          className="bg-gradient-to-br from-brand-teal to-teal-600 rounded-3xl p-8 text-right shadow-lg shadow-brand-teal/20 hover:scale-105 transition-transform group relative overflow-hidden flex flex-col justify-between h-40 cursor-pointer"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Sparkles className="text-white mb-2" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">רינגטונים חדשים</h2>
            <p className="text-teal-50 font-medium truncate">הצלילים החמים שיצאו החודש</p>
          </div>
        </button>

        <button 
          onClick={() => navigate('/popular')}
          className="bg-gradient-to-br from-brand-teal to-teal-600 rounded-3xl p-8 text-right shadow-lg shadow-brand-teal/20 hover:scale-105 transition-transform group relative overflow-hidden flex flex-col justify-between h-40 cursor-pointer"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Flame className="text-white mb-2" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">רינגטונים פופולריים</h2>
            <p className="text-teal-50 font-medium truncate">הכי מורדים באתר</p>
          </div>
        </button>

        <button 
          onClick={() => navigate('/artists')}
          className="bg-gradient-to-br from-brand-teal to-teal-600 rounded-3xl p-8 text-right shadow-lg shadow-brand-teal/20 hover:scale-105 transition-transform group relative overflow-hidden flex flex-col justify-between h-40 cursor-pointer"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Mic className="text-white mb-2" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">אמנים</h2>
            <p className="text-teal-50 font-medium truncate">חיפוש לפי האמן האהוב עליך</p>
          </div>
        </button>
      </div>

      {/* Sections (Centered content approach inside wrappers) */}
      <div className="flex flex-col gap-16 items-center">
        <div className="w-full flex justify-center">
          <div className="w-full">
            <SectionSlider 
              title="החדשים ביותר" 
              icon={<Sparkles className="text-brand-teal" size={24} />}
              subtitle="הצלילים החמים שיצאו החודש"
              ringtones={newest}
              viewAllHref="/new"
              onPlay={play}
              playingId={playingId || undefined}
              viewMode={viewMode}
            />
          </div>
        </div>

        <div className="w-full flex justify-center">
          <div className="w-full">
            <SectionSlider 
              title="הפופולריים ביותר" 
              icon={<Flame className="text-brand-pink" size={24} />}
              subtitle="הרינגטונים שכולם מורידים עכשיו"
              ringtones={popular}
              viewAllHref="/popular"
              onPlay={play}
              playingId={playingId || undefined}
              viewMode={viewMode}
            />
          </div>
        </div>

        <div className="w-full flex justify-center">
          <section className="w-full">
            <div className="flex justify-between items-end mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <Mic className="text-indigo-500" size={24} />
                  <h2 className="text-2xl font-bold text-gray-700">אמנים פופולריים</h2>
                </div>
              </div>
              <button onClick={() => navigate('/artists')} className="text-sm font-bold text-brand-pink border-b-2 border-brand-pink flex items-center gap-1 cursor-pointer transition-all hover:text-brand-pink/80">לכל האמנים <ArrowLeft size={16} /></button>
            </div>
            <div className="flex gap-8 overflow-x-auto pb-4 no-scrollbar justify-start sm:justify-center">
              {popularArtists.map((artist) => (
                <button key={artist.name} onClick={() => navigate(`/artist/${artist.name}`)} className="flex flex-col items-center space-y-3 cursor-pointer group shrink-0">
                  <div className="w-20 h-20 rounded-full border-2 border-gray-100 p-1 group-hover:border-brand-teal transition-all">
                    <img src={artist.imageUrl} alt={artist.name} className="w-full h-full rounded-full object-cover filter group-hover:brightness-105 transition-all" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 group-hover:text-brand-pink transition-colors">{artist.name}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      {loading && newest.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="text-brand-teal"
          >
            <Music size={48} />
          </motion.div>
          <p className="text-slate-400 font-medium">טוען רינגטונים משגעים...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && newest.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-100 flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
            <Music size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-800">עדיין אין כאן כלום...</h3>
            <p className="text-slate-500">האתר נמצא בהקמה. בקרוב יעלו לכאן אלפי רינגטונים.</p>
          </div>
          <button onClick={() => navigate('/upload')} className="bg-brand-teal text-white px-6 py-2 rounded-full font-bold shadow-lg shadow-brand-teal/20 hover:scale-105 transition-transform cursor-pointer">
            תהיה הראשון להעלות!
          </button>
        </div>
      )}
    </div>
  );
}
