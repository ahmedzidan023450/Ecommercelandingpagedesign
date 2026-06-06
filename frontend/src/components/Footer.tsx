import React from 'react';
import { Package } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-gray-400 py-8 border-t-[6px] border-amber-500 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <img src="/favicon.jpeg" alt="Logo" className="w-12 h-12 rounded-xl object-cover shadow-sm border border-amber-500/50" />
          <span className="text-xl font-black text-white tracking-wider">Roya Furniture institution</span>
        </div>
        <p className="font-bold text-sm mb-2 text-gray-300">الخيار الأفضل لتأثيث منزلك بأحدث الموديلات وبأسعار منافسة.</p>
        <p className="text-xs opacity-70">جميع الحقوق محفوظة &copy; {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
