import React from 'react';
import { HEBREW_MONTHS } from '../constants';
import { Calendar, ArrowLeft } from 'lucide-react';

export default function Months() {
  const navigate = (path: string) => {
    const event = new CustomEvent('navigate', { detail: path });
    window.dispatchEvent(event);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-brand-pink/10 rounded-full flex items-center justify-center text-brand-pink mb-4">
           <Calendar size={32} />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">לחנים לכל חודש ולכל חג</h1>
        <p className="text-slate-500 max-w-lg">בחר את החודש המבוקש ותקבל רינגטונים, פיוטים ושירים שמתאימים בדיוק לאווירת החג או התקופה.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {HEBREW_MONTHS.map(month => (
          <button 
            key={month}
            // Logic to navigate to a filtered view by month (we can use GeneralList with a URL structure like /month/:monthName)
            onClick={() => navigate(`/month/${month}`)}
            className="group flex items-center justify-between p-6 bg-white rounded-3xl shadow-sm border border-slate-100 hover:border-brand-pink/30 hover:shadow-md transition-all text-right cursor-pointer"
          >
            <span className="text-xl font-bold text-slate-700 group-hover:text-brand-pink transition-colors">
              חודש {month}
            </span>
            <span className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-pink group-hover:text-white transition-colors">
              <ArrowLeft size={18} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
