import React, { useState, useEffect } from 'react';
import { Search, Menu, X, Upload, MessageCircle, User, LogOut, LayoutGrid, List } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../hooks/useAuth';
import { signInWithGoogle, logout } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';

export default function Header() {
  const { user, profile } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const savedMode = localStorage.getItem('kling-view-mode') as 'grid' | 'list';
    if (savedMode) setViewMode(savedMode);

    const handleViewModeChanged = (e: any) => {
      if (e.detail && (e.detail === 'grid' || e.detail === 'list')) {
        setViewMode(e.detail);
      }
    };
    window.addEventListener('kling-view-mode-changed', handleViewModeChanged);
    return () => window.removeEventListener('kling-view-mode-changed', handleViewModeChanged);
  }, []);

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    localStorage.setItem('kling-view-mode', mode);
    window.dispatchEvent(new CustomEvent('kling-view-mode-changed', { detail: mode }));
  };

  const navItems = [
    { label: 'אמנים', href: '/artists' },
    { label: 'ארכיון', href: '/archive' },
    { label: 'העלה רינגטון', href: '/upload', icon: <Upload size={18} /> },
    { label: 'צור קשר', href: '/contact', icon: <MessageCircle size={18} /> },
  ];

  return (
    <>
      <header className="h-20 sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shrink-0">
        <div className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden p-2 hover:bg-black/5 rounded-full transition-colors cursor-pointer"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
          <a href="/" className="hover:opacity-80 transition-opacity">
            <Logo className="text-3xl" />
          </a>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <a 
              key={item.href} 
              href={item.href}
              className="text-sm font-medium text-slate-600 hover:text-brand-pink transition-colors flex items-center gap-1"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex-1 max-w-xl mx-8 hidden md:block">
          <div className="relative group">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-teal transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="חפש שיר, אמן או סגנון..."
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pr-12 pl-4 focus:ring-2 focus:ring-brand-teal/50 transition-all outline-none text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex bg-gray-50 border border-gray-100 rounded-lg p-1">
            <button
              onClick={() => handleViewModeChange('grid')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-brand-teal/10 text-brand-teal' : 'text-gray-400 hover:text-gray-600'}`}
              title="תצוגת רשת"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => handleViewModeChange('list')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-brand-teal/10 text-brand-teal' : 'text-gray-400 hover:text-gray-600'}`}
              title="תצוגת שורות"
            >
              <List size={16} />
            </button>
          </div>
          {user ? (
            <div className="flex items-center gap-3">
              {profile?.role === 'admin' && (
                <a href="/admin" className="hidden sm:block text-[10px] font-bold text-brand-pink bg-brand-pink/10 px-2 py-1 rounded">ADMIN</a>
              )}
              <button onClick={logout} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors cursor-pointer" title="התנתק">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button 
              onClick={signInWithGoogle}
              className="bg-brand-teal text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-md shadow-brand-teal/20 hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <User size={18} />
              <span className="hidden sm:inline">התחבר עם גוגל</span>
            </button>
          )}
        </div>
      </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-64 bg-white z-[60] lg:hidden shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-8">
                <Logo />
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-slate-100 rounded-full cursor-pointer">
                  <X size={24} />
                </button>
              </div>
              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <a 
                    key={item.href} 
                    href={item.href}
                    className="text-lg font-medium text-slate-700 hover:text-brand-pink flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
