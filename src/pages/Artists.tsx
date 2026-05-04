import React, { useState } from 'react';
import { ARTISTS } from '../data/artists';
import { Search, Users } from 'lucide-react';

export default function Artists() {
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = (path: string) => {
    const event = new CustomEvent('navigate', { detail: path });
    window.dispatchEvent(event);
  };

  const filteredArtists = ARTISTS.filter(artist => 
    artist.name.includes(searchTerm)
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-brand-teal/10 rounded-full flex items-center justify-center text-brand-teal">
               <Users size={20} />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">כל האמנים</h1>
          </div>
          <p className="text-slate-500">בחרו את האמן האהוב עליכם ותקבלו את כל הרינגטונים שלו במקום אחד.</p>
        </div>

        <div className="relative w-full md:w-72 shrink-0">
          <input 
            type="text" 
            placeholder="חיפוש אמן..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-full pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-shadow shadow-sm"
          />
          <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {filteredArtists.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-lg text-slate-500 font-medium">לא נמצאו אמנים התואמים לחיפוש.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredArtists.map(artist => (
            <button 
              key={artist.name} 
              onClick={() => navigate(`/artist/${artist.name}`)}
              className="group flex flex-col items-center p-4 bg-white rounded-2xl border border-slate-50 shadow-sm hover:shadow-md hover:border-brand-teal/20 transition-all text-center cursor-pointer"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-slate-50 overflow-hidden mb-4 group-hover:scale-105 transition-transform duration-300">
                <img 
                  src={artist.imageUrl} 
                  alt={artist.name} 
                  className="w-full h-full object-cover filter brightness-95 group-hover:brightness-105 transition-all" 
                />
              </div>
              <h3 className="font-bold text-slate-700 text-sm md:text-base group-hover:text-brand-pink transition-colors">
                {artist.name}
              </h3>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
