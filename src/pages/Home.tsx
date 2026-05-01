import React, { useState, useEffect } from 'react';
import SectionSlider from '../components/SectionSlider';
import { HEBREW_MONTHS, CURRENT_YEAR } from '../constants';
import { Music, Zap, Flame, Users } from 'lucide-react';
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

  useEffect(() => {
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
    };
  }, []);

  // Use a specific selection of famous artists for the home page carousel
  const topArtistNames = ['ישי ריבו', 'אברהם פריד', 'חנן בן ארי', 'מרדכי בן דוד', 'נפתלי קמפה', 'בנצי שטיין'];
  const popularArtists = topArtistNames
    .map(name => ARTISTS.find(a => a.name === name))
    .filter(Boolean) as { name: string, imageUrl: string }[];

  return (
    <div className="max-w-7xl mx-auto px-8 py-6 space-y-10">
      {/* Months Pills */}
      <div className="h-14 bg-white/50 border border-gray-100 rounded-2xl flex items-center px-4 space-x-reverse space-x-3 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-xs font-bold text-gray-400 ml-4 whitespace-nowrap">חודשים:</span>
        <button className="bg-brand-teal text-white px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap">כל השנה</button>
        {HEBREW_MONTHS.map((month) => (
          <button 
            key={month}
            className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors whitespace-nowrap"
          >
            {month}
          </button>
        ))}
        <a href="/months" className="text-brand-pink text-xs font-bold mr-4 whitespace-nowrap">לכל החודשים...</a>
      </div>

      {/* Hero / Promo - Artist Carousel */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-700 flex items-center gap-2">🎤 אמנים פופולריים</h2>
          </div>
          <a href="/artists" className="text-sm font-bold text-brand-pink border-b-2 border-brand-pink">לכל האמנים ➔</a>
        </div>
        <div className="flex gap-8 overflow-x-auto pb-4 no-scrollbar">
          {popularArtists.map((artist) => (
            <a key={artist.name} href={`/artist/${artist.name}`} className="flex flex-col items-center space-y-3 cursor-pointer group shrink-0">
              <div className="w-20 h-20 rounded-full border-2 border-gray-100 p-1 group-hover:border-brand-teal transition-all">
                <img src={artist.imageUrl} alt={artist.name} className="w-full h-full rounded-full object-cover filter group-hover:brightness-105 transition-all" />
              </div>
              <span className="text-xs font-bold text-slate-700 group-hover:text-brand-pink transition-colors">{artist.name}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Sections */}
      <SectionSlider 
        title="✨ החדשים ביותר" 
        subtitle="הצלילים החמים שיצאו החודש"
        ringtones={newest}
        viewAllHref="/new"
        onPlay={play}
        playingId={playingId || undefined}
      />

      <SectionSlider 
        title="🔥 הפופולריים ביותר" 
        subtitle="הרינגטונים שכולם מורידים עכשיו"
        ringtones={popular}
        viewAllHref="/popular"
        onPlay={play}
        playingId={playingId || undefined}
      />

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
          <button className="bg-brand-teal text-white px-6 py-2 rounded-full font-bold shadow-lg shadow-brand-teal/20 hover:scale-105 transition-transform">
            תהיה הראשון להעלות!
          </button>
        </div>
      )}
    </div>
  );
}
