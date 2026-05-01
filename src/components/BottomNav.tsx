import React from 'react';
import { Home, Users, FolderArchive, Upload } from 'lucide-react';

export default function BottomNav() {
  const items = [
    { icon: <Home size={24} />, label: 'ראשי', href: '/' },
    { icon: <Users size={24} />, label: 'אמנים', href: '/artists' },
    { icon: <FolderArchive size={24} />, label: 'ארכיון', href: '/archive' },
    { icon: <Upload size={24} />, label: 'העלאה', href: '/upload' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex items-center justify-around h-16 md:hidden z-50">
      {items.map((item) => (
        <a 
          key={item.href} 
          href={item.href}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-brand-pink transition-colors px-4"
        >
          {item.icon}
          <span className="text-[10px] font-bold">{item.label}</span>
        </a>
      ))}
    </nav>
  );
}
