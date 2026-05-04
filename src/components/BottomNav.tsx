import React from 'react';
import { Home, Users, FolderArchive, Upload } from 'lucide-react';

export default function BottomNav() {
  const navigate = (path: string) => {
    const event = new CustomEvent('navigate', { detail: path });
    window.dispatchEvent(event);
  };

  const currentPath = window.location.pathname;

  const items = [
    { icon: <Home size={24} />, label: 'ראשי', path: '/' },
    { icon: <Users size={24} />, label: 'אמנים', path: '/artists' },
    { icon: <FolderArchive size={24} />, label: 'ארכיון', path: '/archive' },
    { icon: <Upload size={24} />, label: 'העלאה', path: '/upload' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex items-center justify-around h-16 lg:hidden z-50 px-2 pb-safe">
      {items.map((item) => {
        const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
        return (
          <button 
            key={item.path} 
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors cursor-pointer ${isActive ? 'text-brand-pink' : 'text-slate-400 hover:text-brand-teal'}`}
          >
            {item.icon}
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
