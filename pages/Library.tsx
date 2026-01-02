import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const videos = [
  { id: 1, title: 'The Perfect Spread', duration: '4:20', free: true },
  { id: 2, title: 'Batter Consistency 101', duration: '12:00', free: false },
  { id: 3, title: 'Fermentation Science', duration: '45:00', free: false },
  { id: 4, title: 'Seasoning Your Tawa', duration: '08:30', free: false },
];

export const Library = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('dl_library_unlocked');
    if (saved === 'true') setIsUnlocked(true);
  }, []);

  const handleUnlock = () => {
    setIsUnlocked(true);
    localStorage.setItem('dl_library_unlocked', 'true');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="mb-20 text-center max-w-3xl mx-auto">
        <h1 className="text-h1 font-bold mb-6">Lab Library</h1>
        <p className="text-body text-grayMedium">Master the mechanics of South Indian cuisine through our archive of technique breakdowns, lab logs, and free previews.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        {videos.map(v => (
          <div key={v.id} className="group cursor-pointer">
            <div className={`relative aspect-video rounded-card mb-4 overflow-hidden bg-grayLight border border-grayBorder ${!v.free && !isUnlocked ? 'grayscale brightness-50 contrast-75' : ''}`}>
              <img src={`https://picsum.photos/seed/lib${v.id}/400/225`} alt={v.title} className="w-full h-full object-cover" loading="lazy" />
              {(v.free || isUnlocked) && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-ink bg-opacity-40">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-ink pl-1" aria-label="Play video">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>
              )}
              {!v.free && !isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
                   <div className="bg-white p-3 rounded-full shadow-lg border border-grayBorder text-ink" aria-hidden="true">
                     <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                   </div>
                </div>
              )}
            </div>
            <div className="flex justify-between items-start">
               <div>
                 <h3 className="font-bold text-sm mb-1">{v.title}</h3>
                 <p className="text-xs text-grayMedium">{v.duration}</p>
               </div>
               {v.free ? (
                 <span className="text-[10px] font-bold uppercase tracking-widest text-green-600 bg-green-50 px-2 py-1 rounded">Free Preview</span>
               ) : (
                 !isUnlocked && <span className="text-[10px] font-bold uppercase tracking-widest text-accent bg-accent bg-opacity-10 px-2 py-1 rounded">Unlocked with Lab</span>
               )}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {!isUnlocked && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-ink text-white p-12 rounded-card text-center max-w-2xl mx-auto shadow-2xl relative overflow-hidden"
          >
             <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-6">Unlock Full Access</h2>
              <p className="text-grayLight mb-10">Deep-dive technical videos are reserved for our Lab members and Kit subscribers.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                 <Link to="/contact-booking" className="bg-white text-ink px-10 py-4 rounded-full font-bold hover:scale-[1.02] transition-transform">Book a Lab</Link>
                 <Link to="/subscriptions-kits" className="bg-transparent border border-grayMedium px-10 py-4 rounded-full font-bold hover:bg-grayMedium transition-colors">Shop Kits</Link>
              </div>
              <button onClick={handleUnlock} className="mt-8 text-xs text-gray-500 hover:text-white transition-colors underline decoration-accent underline-offset-4">Demo: Already booked? Enter ID</button>
             </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-accent opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" aria-hidden="true"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};