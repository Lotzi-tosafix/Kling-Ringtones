import React from 'react';

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center font-bold text-4xl select-none tracking-tight ${className}`}>
      <span className="text-brand-pink relative z-10">ק</span>
      <span className="text-brand-teal text-[3.5rem] leading-[0] -mt-4 -mr-2 ml-0 relative z-0">♪</span>
      <span className="text-brand-pink relative z-10">ינג</span>
    </div>
  );
}
