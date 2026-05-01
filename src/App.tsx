import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Admin from './pages/Admin';
import { Toaster } from 'react-hot-toast';
import { AudioProvider } from './hooks/useAudio';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // Simple Router Simulation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.slice(1);
      setCurrentPage(path || 'home');
    };

    window.addEventListener('popstate', handlePopState);
    handlePopState();

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'admin':
        return <Admin />;
      default:
        return <Home />;
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
                <li className="flex items-center text-brand-pink font-bold cursor-pointer group">
                  <span className="ml-3 group-hover:scale-125 transition-transform">🏠</span> 
                  ראשי
                </li>
                <li className="flex items-center text-gray-500 hover:text-brand-teal transition-colors cursor-pointer group">
                  <span className="ml-3 group-hover:scale-125 transition-transform">🎤</span> 
                  אמנים
                </li>
                <li className="flex items-center text-gray-500 hover:text-brand-teal transition-colors cursor-pointer group">
                  <span className="ml-3 group-hover:scale-125 transition-transform">🗂️</span> 
                  ארכיון
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
               <span className="ml-2">🔥</span> 
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
