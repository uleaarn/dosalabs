import React, { useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase.ts';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SwirlIcon } from '../constants.tsx';

export const GuestDashboard = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const profileSnap = await getDoc(doc(db, 'users', user.uid));
        if (profileSnap.exists()) {
          setUserProfile(profileSnap.data());
        }
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-graySubtle">
        <div className="animate-pulse text-accent font-bold uppercase tracking-[0.3em]">Initializing Lab...</div>
      </div>
    );
  }

  const isEnrolled = userProfile?.enrollmentStatus === 'PAID' || userProfile?.enrollmentStatus === 'ENROLLED';

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 min-h-screen">
      <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-2 block">Guest Dashboard</span>
          <h1 className="text-4xl font-bold">Welcome, {userProfile?.name}</h1>
        </div>
        <button 
          onClick={() => auth.signOut()}
          className="text-xs font-bold uppercase tracking-widest text-grayMedium hover:text-ink transition-colors underline decoration-accent underline-offset-4"
        >
          Sign Out
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Status */}
        <div className="lg:col-span-8 space-y-12">
          <section className="bg-white border border-grayBorder rounded-card p-10 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-grayMedium mb-8 flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              Laboratory Status
            </h2>
            
            {!isEnrolled ? (
              <div className="space-y-6">
                <div className="bg-graySubtle p-8 rounded-xl border border-grayBorder border-dashed">
                  <h3 className="text-2xl font-bold mb-4">Your booking is being finalized.</h3>
                  <p className="text-grayMedium leading-relaxed max-w-xl">
                    Our Chef is currently reviewing your lab requirements and kitchen notes. We'll notify you via email as soon as your schedule is confirmed and the invoice is ready.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-8 pt-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-2">Lead ID</p>
                    <p className="font-mono text-sm">{userProfile?.leadId || 'DL-PENDING'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-2">Step</p>
                    <p className="font-bold text-sm">Review Phase (1/3)</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-ink text-white p-8 rounded-xl shadow-lg">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-accent mb-4">Upcoming Session</h3>
                    <p className="text-2xl font-bold mb-2">Dosa Mastery Lab</p>
                    <p className="text-gray-400 text-sm">Saturday, Nov 12 • 10:00 AM ET</p>
                    <button className="mt-8 w-full py-3 bg-white text-ink rounded-full font-bold text-sm hover:bg-accent hover:text-white transition-all">
                      Join Zoom Lab
                    </button>
                  </div>
                  <div className="border border-grayBorder p-8 rounded-xl">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-accent mb-4">Active Invoice</h3>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-2xl font-bold">$129.00</p>
                        <p className="text-grayMedium text-xs">Status: Paid</p>
                      </div>
                      <button className="text-xs font-bold uppercase tracking-widest underline underline-offset-4">Download PDF</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="bg-graySubtle p-10 rounded-card border border-grayBorder">
            <h2 className="text-sm font-bold uppercase tracking-widest text-grayMedium mb-8">Messages from the Chef</h2>
            <div className="space-y-6">
              <div className="flex gap-6">
                <div className="w-10 h-10 bg-white rounded-full border border-grayBorder flex items-center justify-center flex-shrink-0">
                  <SwirlIcon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-bold mb-1">Dosalabs Editorial Team</p>
                  <p className="text-xs text-grayMedium mb-4">Oct 24, 2024</p>
                  <p className="text-sm text-ink leading-relaxed bg-white p-6 rounded-xl border border-grayBorder">
                    "Welcome to the Lab! We've received your inquiry. While we review your kitchen notes, please take a moment to watch our 'Batter Consistency 101' preview in the Library to prepare for the technical side of the session."
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white border border-grayBorder rounded-card p-8 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-accent mb-6">Preparation Checklist</h3>
            <ul className="space-y-4">
              {[
                { label: 'Claim Dashboard', done: true },
                { label: 'Email Verification', done: auth.currentUser?.emailVerified },
                { label: 'Review Prep Packet', done: false },
                { label: 'Sourcing Ingredients', done: false },
                { label: 'Calibrate Kitchen Heat', done: false }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${item.done ? 'bg-green-100 border-green-200 text-green-600' : 'bg-grayLight border-grayBorder'}`}>
                    {item.done && <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className={`text-sm font-medium ${item.done ? 'text-grayMedium line-through opacity-60' : 'text-ink'}`}>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-ink text-white p-8 rounded-card border border-gray-800">
            <h3 className="text-sm font-bold uppercase tracking-widest text-accent mb-4">Help Center</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">Need technical assistance with your batter or schedule?</p>
            <a href="mailto:lab@dosalabs.io" className="block w-full py-3 bg-gray-800 text-center rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-700 transition-colors">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};