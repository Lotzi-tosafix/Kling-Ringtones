import React, { useState, useEffect } from 'react';
import { db, storage, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Upload as UploadIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ARTISTS } from '../data/artists';

export default function Upload() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [category, setCategory] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'audio/mpeg' && !selectedFile.name.endsWith('.mp3')) {
        setErrorMessage('אנא בחר קובץ MP3 בלבד');
        return;
      }
      setErrorMessage('');
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !artist || !category) {
      setErrorMessage('אנא מלא את כל השדות החובה בטופס');
      return;
    }

    if (!user) {
      setErrorMessage('עליך להתחבר כדי להעלות רינגטונים');
      return;
    }

    setIsUploading(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      // 1. Upload to Storage
      const fileRef = ref(storage, `temp_uploads/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          console.error('Storage upload error:', error);
          setErrorMessage('שגיאה בהעלאת הקובץ לשרת');
          setIsUploading(false);
          setStatus('error');
        },
        async () => {
          // 2. Get Download URL
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

          // 3. Save to Firestore (pending)
          await addDoc(collection(db, 'ringtones'), {
            title,
            artist,
            category,
            status: 'pending',
            storageUrl: downloadUrl,
            originalFileName: file.name,
            uploaderId: user.uid,
            uploaderName: user.displayName || 'Anonymous',
            createdAt: serverTimestamp(),
            downloadCount: 0,
            playCount: 0
          });

          setStatus('success');
          setIsUploading(false);
          setFile(null);
          setTitle('');
          setArtist('');
          setCategory('');
          setProgress(0);
        }
      );
    } catch (error) {
      console.error('Firestore save error:', error);
      setErrorMessage('אירעה שגיאה בשמירת הנתונים');
      setIsUploading(false);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-brand-pink/10 rounded-full flex items-center justify-center text-brand-pink mb-4">
            <UploadIcon size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">העלאת רינגטון חדש</h1>
          <p className="text-slate-500 mt-2 text-center">
            העלה רינגטון אל המאגר שלנו. לאחר אישור מנהל הרינגטון יפורסם ויהיה זמין להורדה לכולם.
          </p>
        </div>

        {status === 'success' ? (
          <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-2xl flex flex-col items-center text-center">
            <CheckCircle size={48} className="mb-4" />
            <h3 className="font-bold text-xl mb-2">תודה רבה! העלאה הושלמה.</h3>
            <p>הרינגטון המתין לאישור מנהל, תעקבו אחרי העדכונים!</p>
            <button 
              onClick={() => setStatus('idle')}
              className="mt-6 px-6 py-2 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition"
            >
              העלה רינגטון נוסף
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {!user && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-start gap-3">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <p className="text-sm">שים לב: עליך להתחבר לחשבון לפני שתוכל להעלות קבצים.</p>
              </div>
            )}

            {errorMessage && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
                <AlertCircle size={18} />
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">קובץ MP3 *</label>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 hover:bg-slate-50 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  accept="audio/mp3,audio/mpeg" 
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
                <div className="flex flex-col items-center pointer-events-none">
                  {file ? (
                    <div className="text-brand-teal font-medium flex items-center gap-2">
                      <CheckCircle size={20} />
                      <span dir="ltr">{file.name}</span>
                    </div>
                  ) : (
                    <>
                      <UploadIcon size={24} className="text-slate-400 mb-2" />
                      <span className="text-slate-500 font-medium">לחץ כאן בחרו קובץ</span>
                      <span className="text-slate-400 text-xs mt-1">עד 10MB</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">כותרת / שם השיר *</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="לדוגמה: אהבת תורה..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-pink/50 focus:bg-white transition-all font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">אמן *</label>
                <input 
                  type="text" 
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="לדוגמה: ישי ריבו..."
                  list="artist-list"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-pink/50 focus:bg-white transition-all font-medium"
                  required
                />
                <datalist id="artist-list">
                  {ARTISTS.map(a => (
                    <option key={a.name} value={a.name} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">קטגוריה *</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-pink/50 focus:bg-white transition-all font-medium"
                  required
                >
                  <option value="" disabled>בחר קטגוריה</option>
                  <option value="ווקאלי">ווקאלי</option>
                  <option value="מוזיקלי">מוזיקלי</option>
                  <option value="קצבי">קצבי</option>
                  <option value="שקט">שקט</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isUploading || !user}
              className={`w-full py-4 rounded-xl flex items-center justify-center font-bold text-white transition-all ${
                isUploading || !user ? 'bg-slate-300 cursor-not-allowed' : 'bg-brand-pink hover:bg-pink-600 shadow-md hover:shadow-lg'
              }`}
            >
              {isUploading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  מעלה ({Math.round(progress)}%)...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UploadIcon size={20} />
                  שליחה לאישור
                </span>
              )}
            </button>

            {isUploading && (
              <div className="w-full bg-slate-100 rounded-full h-2 mb-4 overflow-hidden">
                <div className="bg-brand-teal h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
