import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { submitCatering } from '../lib/mockApi.ts';

// Keep these in sync with functions/index.js -> CATERING
const PRICE_PER_PERSON = 25;
const CHEF_FEE = 200;
const MIN_GUESTS = 30;

const APPETIZER_GROUPS: { label: string; items: string[] }[] = [
  { label: 'Vegan', items: ['Idli', 'Medu Vada', 'Veg Samosa', 'Mirchi Bajji', 'Lasuni Gobi', 'Keerai Vada', 'Dollar Idli'] },
  { label: 'Vegetarian', items: ['Vada Pav', 'Dabeli', 'Podi Idli', 'Paneer 65'] },
  { label: 'Non-Veg', items: ['Chicken Pakoda', 'Chilli Chicken', 'Kozhi Varuval'] }
];
const DOSA_VARIETIES = ['Plain', 'Masala', 'Mysore Masala', 'Onion', 'Ghee Roast', 'Podi', 'Cheese'];
const RICE = ['Lemon Rice', 'Tamarind Rice', 'Coconut Rice', 'Curd Rice', 'Vegetable Biryani'];
const DESSERTS = ['Gulab Jamun', 'Shakori Rasmalai', 'Mango Rasmalai', 'Moong Dal Halwa', 'Gajar Ka Halwa', 'Ravva Kesari', 'Semiya Payasam'];

const HERO_IMG =
  'https://firebasestorage.googleapis.com/v0/b/dosalabs-95e1b.firebasestorage.app/o/Dosa%20Mastery%20Lab.jpg?alt=media&token=d3da3ed1-89c5-46db-85dc-ffde7658daec';

const usd = (n: number) => `$${n.toLocaleString('en-US')}`;

const inputClass =
  'w-full p-4 border border-grayBorder rounded-xl outline-none focus:ring-1 focus:ring-accent bg-white';

export const Catering = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState<{ cateringId: string; total: number; emailStatus: string } | null>(null);

  const bookingRequestId = useMemo(
    () => `cat_${Math.random().toString(36).substr(2, 12)}_${Date.now()}`,
    []
  );

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    guests: MIN_GUESTS,
    city: '',
    appetizers: [] as string[],
    rice: RICE[0],
    dessert: DESSERTS[0],
    notes: ''
  });

  const guestsValid = Number.isFinite(form.guests) && form.guests >= MIN_GUESTS;
  const total = (guestsValid ? form.guests : 0) * PRICE_PER_PERSON + CHEF_FEE;

  const set = (field: string, value: unknown) => setForm(prev => ({ ...prev, [field]: value }));

  const scrollToForm = () =>
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const toggleAppetizer = (item: string) => {
    setForm(prev => {
      const has = prev.appetizers.includes(item);
      if (has) return { ...prev, appetizers: prev.appetizers.filter(a => a !== item) };
      if (prev.appetizers.length >= 2) return prev; // cap at 2
      return { ...prev, appetizers: [...prev.appetizers, item] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestsValid) {
      alert(`Live Dosa Catering has a ${MIN_GUESTS}-guest minimum.`);
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await submitCatering({
        bookingRequestId,
        name: form.name,
        email: form.email,
        phone: form.phone,
        eventDate: form.eventDate,
        guests: form.guests,
        city: form.city,
        appetizers: form.appetizers,
        rice: form.rice,
        dessert: form.dessert,
        notes: form.notes
      });
      if (response.success) {
        setResult({
          cateringId: response.cateringId,
          total: response.totalCents ? response.totalCents / 100 : total,
          emailStatus: response.emailStatus
        });
        setSuccess(true);
        window.scrollTo(0, 0);
      } else {
        alert(response.error || 'Something went wrong. Please try again.');
      }
    } catch {
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success && result) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-grayBorder p-12 rounded-card shadow-2xl text-center"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Request Received!</h1>
          <p className="text-grayMedium mb-2 font-medium">
            Request ID: <span className="font-mono font-bold text-ink">{result.cateringId}</span>
          </p>
          {(result.emailStatus === 'SENT' || result.emailStatus === 'QUEUED') && (
            <p className="text-green-600 text-[11px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 mb-8">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
              Confirmation sent to {form.email}
            </p>
          )}
          <div className="bg-graySubtle p-10 rounded-2xl text-left mb-10 border border-grayBorder">
            <h3 className="font-bold mb-6 text-[10px] uppercase tracking-[0.3em] text-accent">Your Event</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-grayMedium">Date:</span>
                <span className="font-bold text-ink">{form.eventDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-grayMedium">Guests:</span>
                <span className="font-bold text-ink">{form.guests}</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-grayBorder">
                <span className="font-bold">Estimated total:</span>
                <span className="font-bold text-lg text-ink">{usd(result.total)}</span>
              </div>
            </div>
          </div>
          <p className="text-grayMedium text-sm mb-10 leading-relaxed">
            We'll confirm your date within 24 hours. This estimate holds your spot — it's not a charge.
            We'll arrange a small deposit when we reach out.
          </p>
          <Link
            to="/"
            className="inline-block bg-ink text-white px-10 py-4 rounded-full font-bold hover:bg-accent transition-all shadow-md text-[10px] uppercase tracking-widest"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Live dosa station" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-ink/80" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 py-28 md:py-36 text-center text-white">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent mb-6"
          >
            On-Site Catering · New Jersey & Tri-State
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.05]"
          >
            Live Dosa Catering
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Our chef sets up a live station and makes fresh, sizzling dosas right in front of your
            guests — the showstopper for weddings, birthdays, and corporate events.
          </motion.p>
          <div className="inline-flex flex-wrap items-center justify-center gap-3 mb-10">
            <span className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 text-sm font-bold">
              {usd(PRICE_PER_PERSON)} <span className="text-white/60 font-medium">/ person</span>
            </span>
            <span className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 text-sm font-bold">
              + {usd(CHEF_FEE)} <span className="text-white/60 font-medium">chef fee</span>
            </span>
            <span className="bg-accent/90 rounded-full px-6 py-3 text-sm font-bold">
              {MIN_GUESTS}-guest minimum
            </span>
          </div>
          <div>
            <button
              type="button"
              onClick={scrollToForm}
              className="inline-block bg-white text-ink px-10 py-4 rounded-full font-bold hover:bg-accent hover:text-white transition-all shadow-xl text-[11px] uppercase tracking-[0.2em] active:scale-[0.98]"
            >
              Book This Date
            </button>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-h2 font-bold mb-4">One Simple Package</h2>
          <p className="text-grayMedium max-w-2xl mx-auto">
            No confusing tiers. Every guest gets the full spread, and the dosas never stop.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-grayBorder rounded-card p-8 bg-white">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-6">Included per guest</h3>
            <ul className="space-y-4 text-sm">
              {[
                '2 Appetizers (your choice)',
                'Live, unlimited dosas — made to order',
                '1 Rice dish (your choice)',
                '1 Dessert (your choice)',
                'Chutneys & sambar'
              ].map(item => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                  <span className="text-grayMedium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-grayBorder rounded-card p-8 bg-graySubtle">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-6">Live dosa varieties</h3>
            <div className="flex flex-wrap gap-2">
              {DOSA_VARIETIES.map(d => (
                <span key={d} className="bg-white border border-grayBorder rounded-full px-4 py-2 text-xs font-bold text-grayMedium">
                  {d}
                </span>
              ))}
            </div>
            <p className="text-xs text-grayMedium mt-6 leading-relaxed">
              Vegan, vegetarian & non-veg appetizer options. We happily customize for Jain and allergy needs — just add a note in your booking.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-graySubtle border-y border-grayBorder">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-h2 font-bold mb-4">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { n: '01', t: 'Pick your date & headcount', d: 'Tell us when, where, and how many. See your exact price instantly — no waiting for a quote.' },
              { n: '02', t: 'We confirm within 24 hours', d: 'We lock your date and arrange a small deposit. You choose your final menu with us.' },
              { n: '03', t: 'The chef cooks live', d: 'We arrive with the station and equipment. Your guests watch fresh dosas hit the tawa all night.' }
            ].map(step => (
              <div key={step.n}>
                <div className="text-accent font-bold text-3xl mb-4">{step.n}</div>
                <h3 className="text-lg font-bold mb-3">{step.t}</h3>
                <p className="text-grayMedium text-sm leading-relaxed">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking form */}
      <section id="book" className="max-w-3xl mx-auto px-6 py-24 scroll-mt-24">
        <div className="text-center mb-12">
          <h2 className="text-h2 font-bold mb-4">Book Your Live Dosa Station</h2>
          <p className="text-grayMedium">Fill this out and you're booked — we'll confirm your date within 24 hours.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-grayMedium mb-3">Full name</label>
              <input required value={form.name} onChange={e => set('name', e.target.value)} type="text" placeholder="Priya Sharma" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-grayMedium mb-3">Phone</label>
              <input required value={form.phone} onChange={e => set('phone', e.target.value)} type="tel" placeholder="(973) 000-0000" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-grayMedium mb-3">Email</label>
              <input required value={form.email} onChange={e => set('email', e.target.value)} type="email" placeholder="priya@example.com" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-grayMedium mb-3">Event city / venue</label>
              <input value={form.city} onChange={e => set('city', e.target.value)} type="text" placeholder="Edison, NJ" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-grayMedium mb-3">Event date</label>
              <input required value={form.eventDate} onChange={e => set('eventDate', e.target.value)} type="date" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-grayMedium mb-3">Number of guests</label>
              <input
                required
                value={form.guests}
                onChange={e => set('guests', parseInt(e.target.value, 10) || 0)}
                type="number"
                min={MIN_GUESTS}
                className={inputClass}
              />
              {!guestsValid && (
                <p className="text-red-500 text-xs mt-2 font-medium">Minimum {MIN_GUESTS} guests.</p>
              )}
            </div>
          </div>

          {/* Appetizers */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-grayMedium mb-4">
              Appetizers <span className="text-accent">(choose 2)</span>
            </label>
            <div className="space-y-5">
              {APPETIZER_GROUPS.map(group => (
                <div key={group.label}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-grayMedium/60 mb-2.5">{group.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map(a => {
                      const selected = form.appetizers.includes(a);
                      const disabled = !selected && form.appetizers.length >= 2;
                      return (
                        <button
                          type="button"
                          key={a}
                          onClick={() => toggleAppetizer(a)}
                          disabled={disabled}
                          className={`px-4 py-2.5 rounded-full text-xs font-bold border transition-all ${
                            selected
                              ? 'bg-ink text-white border-ink'
                              : disabled
                              ? 'bg-grayLight text-grayMedium/40 border-grayBorder cursor-not-allowed'
                              : 'bg-white text-grayMedium border-grayBorder hover:border-accent'
                          }`}
                        >
                          {a}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-grayMedium mb-3">Rice dish</label>
              <select value={form.rice} onChange={e => set('rice', e.target.value)} className={inputClass}>
                {RICE.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-grayMedium mb-3">Dessert</label>
              <select value={form.dessert} onChange={e => set('dessert', e.target.value)} className={inputClass}>
                {DESSERTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-grayMedium mb-3">
              Notes <span className="text-grayMedium/60 normal-case tracking-normal">(allergies, Jain, venue details)</span>
            </label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} placeholder="Anything we should know…" className={inputClass} />
          </div>

          {/* Live price */}
          <div className="bg-graySubtle border border-grayBorder rounded-card p-8">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-grayMedium">
                <span>{usd(PRICE_PER_PERSON)} × {guestsValid ? form.guests : 0} guests</span>
                <span>{usd((guestsValid ? form.guests : 0) * PRICE_PER_PERSON)}</span>
              </div>
              <div className="flex justify-between text-grayMedium">
                <span>Chef fee</span>
                <span>{usd(CHEF_FEE)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-grayBorder items-center">
                <span className="font-bold text-ink uppercase tracking-widest text-xs">Estimated total</span>
                <span className="font-bold text-3xl text-ink">{usd(total)}</span>
              </div>
            </div>
            <p className="text-[11px] text-grayMedium mt-4 leading-relaxed">
              An estimate to hold your date — not a charge. Final menu and a small deposit are arranged when we confirm.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !guestsValid}
            className="w-full bg-ink text-white py-5 rounded-full font-bold hover:bg-accent transition-all shadow-lg active:scale-[0.99] text-[11px] uppercase tracking-[0.2em] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Booking…' : `Book This Date · ${usd(total)}`}
          </button>
        </form>
      </section>
    </div>
  );
};
