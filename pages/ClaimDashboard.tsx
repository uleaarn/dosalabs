import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase.ts';
import { motion } from 'framer-motion';

export const ClaimDashboard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const leadId = searchParams.get('leadId');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!leadId || !email) {
      setError('Invalid or expired claim link.');
    }
  }, [leadId, email]);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, email!, password);
      const user = userCredential.user;

      // 2. Fetch Lead Data (to get the name)
      const leadRef = doc(db, 'leads', leadId!);
      const leadSnap = await getDoc(leadRef);
      const leadData = leadSnap.exists() ? leadSnap.data() : { name: 'Guest' };

      // 3. Create User Profile
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        name: leadData.name,
        role: 'GUEST',
        leadId: leadId,
        createdAt: serverTimestamp(),
        enrollmentStatus: 'PENDING'
      });

      // 4. Update Lead Status
      await updateDoc(leadRef, {
        status: 'DASHBOARD_CLAIMED',
        claimedAt: serverTimestamp()
      });

      // 5. Update Auth Profile
      await updateProfile(user, { displayName: leadData.name });

      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to claim dashboard.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-graySubtle p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-[32px] border border-grayBorder shadow-2xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Claim Your Dashboard</h1>
          <p className="text-grayMedium">Finish setting up your account for {email}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleClaim} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-grayMedium">New Password</label>
            <input 
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border border-grayBorder rounded-xl outline-none focus:border-accent"
              placeholder="Min. 8 characters"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-grayMedium">Confirm Password</label>
            <input 
              required
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-4 border border-grayBorder rounded-xl outline-none focus:border-accent"
              placeholder="Repeat password"
            />
          </div>

          <button 
            type="submit"
            disabled={loading || !leadId}
            className={`w-full py-4 bg-ink text-white rounded-full font-bold shadow-lg transition-all ${loading ? 'opacity-50' : 'hover:bg-opacity-90'}`}
          >
            {loading ? 'Setting up...' : 'Claim My Dashboard'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};