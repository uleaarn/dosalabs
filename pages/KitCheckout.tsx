
import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import kitsData from '../data/kits.ts';

const PICKUP_SLOTS = [
  "Friday 4pm - 6pm", "Saturday 9am - 11am", "Saturday 4pm - 6pm", "Sunday 9am - 11am"
];

export const KitCheckout = () => {
  const { kitId } = useParams();
  const kit = kitsData.find(k => k.id === kitId);
  
  const [success, setSuccess] = useState(false);
  const [orderId] = useState(`ORD-${Math.floor(100000 + Math.random() * 900000)}`);
  
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'NJ',
    zip: '',
    pickupSlot: PICKUP_SLOTS[0],
    notes: ''
  });

  if (!kit) {
    return <Navigate to="/subscriptions-kits" />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    window.scrollTo(0, 0);
  };

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  if (success) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-grayBorder p-12 rounded-card shadow-2xl text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-4xl font-bold mb-4">Order Received!</h1>
          <p className="text-grayMedium mb-2">Order ID: <span className="font-mono font-bold text-ink">{orderId}</span></p>
          <p className="text-grayMedium mb-10 max-w-md mx-auto">
            We've sent a confirmation to <strong>{form.email}</strong>. 
            {kit.delivery === 'pickup' 
              ? ` Your kit will be ready for pickup at our Montclair Lab during the ${form.pickupSlot} window.`
              : ` Your ${kit.name} will be dispatched within 48 hours.`
            }
          </p>
          
          <div className="bg-graySubtle p-8 rounded-xl text-left mb-10 border border-grayBorder">
            <h3 className="font-bold mb-4 text-xs uppercase tracking-widest text-accent">Order Summary</h3>
            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <span className="text-grayMedium">Item:</span> <span className="font-bold text-right">{kit.name}</span>
              <span className="text-grayMedium">Method:</span> <span className="font-bold text-right capitalize">{kit.delivery}</span>
              {kit.delivery === 'pickup' && (
                <>
                  <span className="text-grayMedium">Pickup Window:</span> <span className="font-bold text-right">{form.pickupSlot}</span>
                </>
              )}
              <span className="text-grayMedium border-t border-grayBorder pt-2">Total Paid:</span> <span className="font-bold text-right border-t border-grayBorder pt-2 text-lg">${kit.price}</span>
            </div>
          </div>

          <Link to="/" className="inline-block bg-ink text-white px-10 py-4 rounded-full font-bold hover:bg-opacity-90 transition-all">
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-16 min-h-[800px]">
      <div className="flex-grow">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Checkout</h1>
          <p className="text-grayMedium">Complete your order for the <span className="text-ink font-bold">{kit.name}</span>.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white border border-grayBorder p-8 rounded-card shadow-sm space-y-6">
            <h2 className="text-xl font-bold border-b border-graySubtle pb-4">1. Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider">Full Name</label>
                <input required value={form.fullName} onChange={e => updateField('fullName', e.target.value)} type="text" placeholder="Sarah Jenkins" className="w-full p-4 border border-grayBorder rounded-xl outline-none focus:border-accent" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider">Email Address</label>
                <input required value={form.email} onChange={e => updateField('email', e.target.value)} type="email" placeholder="sarah@example.com" className="w-full p-4 border border-grayBorder rounded-xl outline-none focus:border-accent" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider">Mobile Number</label>
              <input required pattern="^(\+1\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$" value={form.phone} onChange={e => updateField('phone', e.target.value)} type="tel" placeholder="(973) 000-0000" className="w-full p-4 border border-grayBorder rounded-xl outline-none focus:border-accent" />
            </div>
          </div>

          <div className="bg-white border border-grayBorder p-8 rounded-card shadow-sm space-y-6">
            <h2 className="text-xl font-bold border-b border-graySubtle pb-4">
              2. {kit.delivery === 'pickup' ? 'Pickup Details' : 'Shipping Address'}
            </h2>
            
            {kit.delivery === 'pickup' ? (
              <div className="space-y-4">
                <p className="text-sm text-grayMedium bg-accent/5 p-4 rounded-xl border border-accent/20">
                  <strong>Pickup Location:</strong> Dosalabs Montclair Lab, 42 Lab St, Montclair, NJ 07042.
                </p>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider">Select Pickup Window</label>
                  <select required value={form.pickupSlot} onChange={e => updateField('pickupSlot', e.target.value)} className="w-full p-4 border border-grayBorder rounded-xl outline-none appearance-none bg-white focus:border-accent">
                    {PICKUP_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider">Street Address</label>
                  <input required value={form.address} onChange={e => updateField('address', e.target.value)} type="text" placeholder="123 Dosa Lane" className="w-full p-4 border border-grayBorder rounded-xl outline-none focus:border-accent" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2 col-span-1">
                    <label className="text-xs font-bold uppercase tracking-wider">City</label>
                    <input required value={form.city} onChange={e => updateField('city', e.target.value)} type="text" placeholder="Montclair" className="w-full p-4 border border-grayBorder rounded-xl outline-none focus:border-accent" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider">State</label>
                    <input required value={form.state} onChange={e => updateField('state', e.target.value)} type="text" placeholder="NJ" className="w-full p-4 border border-grayBorder rounded-xl outline-none focus:border-accent" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider">ZIP Code</label>
                    <input required pattern="[0-9]{5}" maxLength={5} value={form.zip} onChange={e => updateField('zip', e.target.value)} placeholder="07042" className="w-full p-4 border border-grayBorder rounded-xl outline-none focus:border-accent" />
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider">Delivery Instructions (Optional)</label>
              <textarea value={form.notes} onChange={e => updateField('notes', e.target.value)} placeholder="e.g. Leave at the side door..." className="w-full p-4 border border-grayBorder rounded-xl outline-none focus:border-accent min-h-[100px]" />
            </div>
          </div>

          <div className="bg-grayLight p-4 rounded-lg text-center text-[11px] text-grayMedium uppercase tracking-widest font-bold">
            Payment Securely Handled via Stripe
          </div>

          <div className="flex justify-between items-center pt-8 border-t border-grayBorder">
            <Link to="/subscriptions-kits" className="text-sm font-bold underline">Cancel</Link>
            <button type="submit" className="px-12 py-4 bg-ink text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
              Pay ${kit.price} & Place Order
            </button>
          </div>
        </form>
      </div>

      <div className="w-full lg:w-80">
        <div className="sticky top-32 bg-white border border-grayBorder rounded-card p-8 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-widest text-accent mb-6">Order Summary</h3>
          <div className="space-y-4 text-sm mb-8">
            <div className="flex justify-between">
              <span className="text-grayMedium">Item</span>
              <span className="font-bold">{kit.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-grayMedium">Shipping</span>
              <span className="font-bold text-green-600">Free</span>
            </div>
          </div>
          <div className="border-t border-grayBorder pt-6 flex justify-between items-end">
            <span className="text-sm font-medium">Total</span>
            <span className="text-3xl font-bold">${kit.price}</span>
          </div>
          
          <div className="mt-8 pt-8 border-t border-grayBorder space-y-4">
             <div className="flex items-center gap-3 text-xs text-grayMedium">
               <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               <span>Secure Checkout</span>
             </div>
             <div className="flex items-center gap-3 text-xs text-grayMedium">
               <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 12H4M4 12l4-4M4 12l4 4" /></svg>
               <span>Full Refund Policy</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
