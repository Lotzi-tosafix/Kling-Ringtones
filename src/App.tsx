import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Upload from './pages/Upload';
import GeneralList from './pages/GeneralList';
import Artists from './pages/Artists';
import Archive from './pages/Archive';
import { Toaster } from 'react-hot-toast';
import { Home as HomeIcon, Upload as UploadIcon, Mic, FolderArchive, Flame } from 'lucide-react';
import { AudioProvider } from './hooks/useAudio';
import { collection, query, orderBy, where, limit } from 'firebase/firestore';
import { db } from './lib/firebase';

import Months from './pages/Months';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [routeParam, setRouteParam] = useState('');

  // Simple Router Simulation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.slice(1);
      const parts = path.split('/');
      setCurrentPage(parts[0] || 'home');
      if (parts[1]) {
        setRouteParam(decodeURIComponent(parts[1]));
      } else {
        setRouteParam('');
      }
    };

    // Listen to our custom navigation event as well
    const handleNavigation = (e: CustomEvent) => {
      window.history.pushState(null, '', e.detail);
      handlePopState();
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('navigate', handleNavigation as EventListener);
    handlePopState();

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('navigate', handleNavigation as EventListener);
    }
  }, []);

  const navigate = (path: string) => {
    const event = new CustomEvent('navigate', { detail: path });
    window.dispatchEvent(event);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'admin':
        return <Admin />;
      case 'upload':
        return <Upload />;
      case 'archive':
        return <Archive />;
      case 'artists':
        return <Artists />;
      case 'months':
        return <Months />;
      case 'month':
        return <GeneralList title={`רינגטונים לחודש ${routeParam}`} initialQueryFn={() => query(collection(db, 'ringtones'), where('month', '==', routeParam), where('status', '==', 'published'), orderBy('createdAt', 'desc'))} />
      case 'artist':
        return <GeneralList title={`רינגטונים של ${routeParam}`} initialQueryFn={() => query(collection(db, 'ringtones'), where('artist', '==', routeParam), where('status', '==', 'published'), orderBy('createdAt', 'desc'))} />
      case 'new':
        return <GeneralList title="החדשים ביותר" initialQueryFn={() => query(collection(db, 'ringtones'), where('status', '==', 'published'), orderBy('createdAt', 'desc'), limit(50))} />
      case 'popular':
        return <GeneralList title="הפופולריים ביותר" initialQueryFn={() => query(collection(db, 'ringtones'), where('status', '==', 'published'), orderBy('downloadCount', 'desc'), limit(50))} />
      default:
        return (
          <div className="py-20 text-center px-4">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">404 - העמוד לא נמצא</h1>
            <button onClick={() => navigate('/')} className="inline-block bg-brand-pink text-white px-6 py-2 rounded-full font-bold">חזרה לדף הבית</button>
          </div>
        );
    }
  };

  return (
    <AudioProvider>
      <div dir="rtl" className="min-h-screen flex flex-col bg-bg-light text-text-main">
        <Toaster position="top-center" />
        <Header />
        
        <div className="flex-1 max-w-7xl mx-auto w-full flex overflow-hidden">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:flex w-64 border-l border-gray-100 bg-white/30 flex-col p-8 space-y-10">
            <div>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">ניווט מהיר</h3>
              <ul className="space-y-6">
                <li onClick={() => navigate('/')} className={`flex items-center ${currentPage === 'home' ? 'text-brand-pink font-bold' : 'text-gray-500 hover:text-brand-teal'} cursor-pointer group transition-colors`}>
                  <HomeIcon size={18} className="ml-3 group-hover:scale-125 transition-transform" /> 
                  ראשי
                </li>
                <li onClick={() => navigate('/upload')} className={`flex items-center ${currentPage === 'upload' ? 'text-brand-pink font-bold' : 'text-gray-500 hover:text-brand-teal'} cursor-pointer group transition-colors`}>
                  <UploadIcon size={18} className="ml-3 group-hover:scale-125 transition-transform" /> 
                  העלאת רינגטון
                </li>
                <li onClick={() => navigate('/artists')} className={`flex items-center ${currentPage === 'artists' ? 'text-brand-pink font-bold' : 'text-gray-500 hover:text-brand-teal'} cursor-pointer group transition-colors`}>
                  <Mic size={18} className="ml-3 group-hover:scale-125 transition-transform" /> 
                  אמנים
                </li>
                <li onClick={() => navigate('/archive')} className={`flex items-center ${currentPage === 'archive' ? 'text-brand-pink font-bold' : 'text-gray-500 hover:text-brand-teal'} cursor-pointer group transition-colors`}>
                  <FolderArchive size={18} className="ml-3 group-hover:scale-125 transition-transform" /> 
                  ארכיון (הורדת ZIP)
                </li>
              </ul>
            </div>
            
            <div className="mt-auto p-5 bg-gradient-to-br from-brand-teal/10 to-brand-pink/10 rounded-2xl border border-white shadow-sm">
              <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                <strong>קלינג</strong> - הבית לרינגטונים חסידיים. כל השירים שאתם אוהבים, מותאמים לנייד שלכם.
              </p>
            </div>
          </aside>

          <main className="flex-1 pb-20 lg:pb-0 min-w-0">
            {renderPage()}
          </main>
        </div>

        <footer className="h-16 bg-white border-t border-gray-100 flex items-center justify-between px-8 shrink-0 z-40">
          <div className="text-[10px] text-gray-400 font-medium">
            כל הזכויות שמורות לקלינג &copy; 2024 | <span className="underline cursor-pointer hover:text-brand-pink transition-colors">מדיניות פרטיות</span> | <span className="underline cursor-pointer hover:text-brand-pink transition-colors">תנאי שימוש</span>
          </div>
          <div className="hidden sm:flex space-x-reverse space-x-6">
             <div className="flex items-center text-[10px] text-gray-400 font-bold">
               <span className="w-2 h-2 bg-green-500 rounded-full ml-2"></span> 
               124 משתמשים מחוברים
             </div>
             <div className="flex items-center text-[10px] text-gray-400 font-bold">
               <Flame size={14} className="ml-1 text-brand-pink" /> 
               45,200 הורדות סה"כ
             </div>
          </div>
        </footer>

        <BottomNav />
      </div>
    </AudioProvider>
  );
}

export default App;
