import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, updateDoc, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { Ringtone } from '../types';
import { Check, X, Trash2, Play, ExternalLink, Database } from 'lucide-react';
import toast from 'react-hot-toast';
import { seedRingtones } from '../lib/seed';

export default function Admin() {
  const [pending, setPending] = useState<Ringtone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'ringtones'), where('status', '==', 'pending'));
    const unsub = onSnapshot(q, (snapshot) => {
      setPending(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ringtone)));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleSeed = async () => {
    if (!window.confirm('האם להוסיף נתוני דוגמה?')) return;
    try {
      await seedRingtones();
      toast.success('נתוני דוגמה נוספו!');
    } catch (e) {
      toast.error('שגיאה בהוספת נתונים');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await updateDoc(doc(db, 'ringtones', id), {
        status: 'published',
        updatedAt: new Date()
      });
      toast.success('רינגטון אושר בהצלחה!');
    } catch (e) {
      toast.error('שגיאה באישור');
    }
  };

  const handleReject = async (id: string, driveId: string) => {
    if (!window.confirm('האם אתה בטוח שברצונך לדחות ולמחוק?')) return;
    try {
      await updateDoc(doc(db, 'ringtones', id), {
        status: 'rejected',
        updatedAt: new Date()
      });
      toast.success('רינגטון נדחה');
    } catch (e) {
      toast.error('שגיאה בדחייה');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">פאנל ניהול - ממתינים לאישור</h1>
        <button 
          onClick={handleSeed}
          className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors text-sm"
        >
          <Database size={16} />
          <span>הוסף נתוני דוגמה</span>
        </button>
      </div>
      
      {loading ? (
        <p>טוען...</p>
      ) : pending.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-slate-100">
          <p className="text-slate-500 font-medium text-lg">אין רינגטונים הממתינים לאישור כרגע.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pending.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                   <Music size={20} />
                </div>
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.artist} | {item.year} - {item.month}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a 
                  href={`https://drive.google.com/file/d/${item.driveId}/view`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"
                  title="צפה בדרייב"
                >
                  <ExternalLink size={20} />
                </a>
                <button 
                  onClick={() => handleApprove(item.id)}
                  className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
                  title="אשר"
                >
                  <Check size={20} />
                </button>
                <button 
                  onClick={() => handleReject(item.id, item.driveId)}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                  title="דחה ומחק"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const Music = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
);
