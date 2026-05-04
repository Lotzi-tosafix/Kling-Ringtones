import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Ringtone } from '../types';
import RingtoneCard from '../components/RingtoneCard';
import { Archive as ArchiveIcon, RefreshCw, CheckSquare, DownloadCloud } from 'lucide-react';
import JSZip from 'jszip';

export default function Archive() {
  const [ringtones, setRingtones] = useState<Ringtone[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isZipping, setIsZipping] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const ref = query(collection(db, 'ringtones'), where('status', '==', 'published'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(ref);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Ringtone);
        setRingtones(data);
      } catch (error) {
        console.error('Error fetching list:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === ringtones.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(ringtones.map(r => r.id!)));
    }
  };

  const downloadZip = async () => {
    if (selectedIds.size === 0) return;
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const selectedRingtones = ringtones.filter(r => selectedIds.has(r.id!));

      // In a real app we'd fetch the actual MP3 streams using the storage URL or drive ID
      // However due to CORS, this might be tricky to do purely client-side without a proxy,
      // But we will attempt fetching the blob if possible.
      // If fetching fails due to CORS, JSZip will throw.

      const promises = selectedRingtones.map(async (ringtone) => {
        try {
          // Attempt to fetch file. If it fails, we ignore it or show error.
          let fetchUrl = '';
          if (ringtone.storageUrl) {
            fetchUrl = ringtone.storageUrl;
          } else if (ringtone.driveId) {
             // For public Google Drive UI links: this usually gets blocked by CORS.
             fetchUrl = `https://drive.google.com/uc?export=download&id=${ringtone.driveId}`;
          }

          if (fetchUrl) {
            const response = await fetch(fetchUrl);
            const blob = await response.blob();
            const filename = `${ringtone.artist} - ${ringtone.title}.mp3`.replace(/[/\\?%*:|"<>]/g, '-');
            zip.file(filename, blob);
          }
        } catch (e) {
             console.error('Failed to add to zip:', ringtone.title, e);
        }
      });

      await Promise.all(promises);

      const content = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'kling-ringtones.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error creating zip:', error);
      alert('אירעה שגיאה ביצירת קובץ ה-ZIP. ייתכן שיש חסימת CORS.');
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-brand-pink/10 rounded-full flex items-center justify-center text-brand-pink">
               <ArchiveIcon size={20} />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">ארכיון הרינגטונים</h1>
          </div>
          <p className="text-slate-500">ניתן למצוא כאן את כל הרינגטונים, לסמן כמה ביחד ולהוריד בקובץ מכווץ (ZIP).</p>
        </div>

        {ringtones.length > 0 && (
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 shrink-0">
             <button 
               onClick={handleSelectAll}
               className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-600 font-medium text-sm"
             >
               <CheckSquare size={18} className={selectedIds.size === ringtones.length ? 'text-brand-pink' : 'text-slate-400'} />
               {selectedIds.size === ringtones.length ? 'בטל בחירה' : 'בחר הכל'}
             </button>
             <button 
               onClick={downloadZip}
               disabled={selectedIds.size === 0 || isZipping}
               className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-colors font-bold text-sm ${selectedIds.size === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-brand-teal text-white hover:bg-teal-600 shadow-md shadow-brand-teal/20'}`}
             >
               {isZipping ? <RefreshCw size={18} className="animate-spin" /> : <DownloadCloud size={18} />}
               הורד {selectedIds.size > 0 ? selectedIds.size : ''} קבצים (ZIP)
             </button>
          </div>
        )}
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
            <div key={ringtone.id} className="relative group">
              {/* Checkbox overlay */}
              <div 
                className="absolute top-2 left-2 z-10 w-8 h-8 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleSelect(ringtone.id!)}
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${selectedIds.has(ringtone.id!) ? 'bg-brand-pink border-brand-pink' : 'bg-white border-2 border-slate-300'}`}>
                   {selectedIds.has(ringtone.id!) && <CheckSquare size={14} className="text-white" />}
                </div>
              </div>
              <div 
                className={`transition-all rounded-2xl ${selectedIds.has(ringtone.id!) ? 'ring-2 ring-brand-pink shadow-md scale-[0.98]' : ''}`}
                onClick={() => {
                  // If we click anywhere on the card when selecting multiple, let's select it
                  if (selectedIds.size > 0) {
                     handleSelect(ringtone.id!);
                  }
                }}
              >
                <RingtoneCard ringtone={ringtone} viewMode="grid" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
