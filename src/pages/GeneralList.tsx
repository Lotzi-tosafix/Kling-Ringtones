import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { Ringtone } from '../types';
import RingtoneCard from '../components/RingtoneCard';
import { RefreshCw, Search } from 'lucide-react';

export default function GeneralList({ title, initialQueryFn }: { title: string, initialQueryFn: () => any }) {
  const [ringtones, setRingtones] = useState<Ringtone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const ref = initialQueryFn();
        const snapshot = await getDocs(ref);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }) as Ringtone);
        setRingtones(data);
      } catch (error) {
        console.error('Error fetching list:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [initialQueryFn]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">{title}</h1>
          <p className="text-slate-500">כל מה שיש לנו להציע כאן, ניתן להאזין ולהוריד בקלות.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <RefreshCw className="animate-spin text-brand-pink" size={32} />
        </div>
      ) : ringtones.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-lg text-slate-500 font-medium">לא נמצאו רינגטונים.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ringtones.map(ringtone => (
            <RingtoneCard key={ringtone.id} ringtone={ringtone} viewMode="grid" />
          ))}
        </div>
      )}
    </div>
  );
}
