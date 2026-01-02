
import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { SwirlIcon } from '../constants.tsx';
// Fix: Added missing AnimatePresence import from framer-motion
import { motion, AnimatePresence } from 'framer-motion';
import { ClassItem } from '../types.ts';

import classesData from '../data/classes.ts';

// Static mock reviews for the technical labs
const MOCK_REVIEWS = [
  {
    id: 1,
    name: "Aisha M.",
    date: "March 12, 2024",
    rating: 5,
    text: "The 'bubble test' for batter aeration was a total game-changer for me. I've tried dozens of YouTube recipes, but none explained the physics of the batter like this lab did. Finally made restaurant-quality idlis in my Brooklyn apartment.",
    verified: true
  },
  {
    id: 2,
    name: "David K.",
    date: "February 28, 2024",
    rating: 5,
    text: "I was struggling with my cast iron pan sticking every single time. The section on seasoning and thermal mass was exactly what I needed. The chef helped me troubleshoot my specific burner settings live.",
    verified: true
  },
  {
    id: 2,
    name: "Leila S.",
    date: "January 15, 2024",
    rating: 4,
    text: "Great pace and very clear instructions. The fermentation troubleshooting guide is now pinned to my fridge. Only wish the class was 15 minutes longer to cover more chutney variations!",
    verified: true
  }
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-accent fill-accent' : 'text-grayLight fill-grayLight'}`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

export const ClassDetail = () => {
  const { slug } = useParams();
  const lab = classesData.find(c => c.slug === slug);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);

  if (!lab) {
    return <Navigate to="/404" />;
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-graySubtle pt-20 pb-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-6"
          >
            {lab.type} Lab
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-h1 font-bold mb-4"
          >
            {lab.name}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-medium text-ink mb-8 max-w-2xl italic"
          >
            {lab.tagline}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/contact-booking" className="bg-ink text-white px-10 py-4 rounded-full font-bold hover:bg-opacity-90 transition-all shadow-xl">
              Book {lab.name}
            </Link>
            {lab.type === 'online' && (
              <Link to="/in-home" className="bg-white border border-grayBorder text-ink px-10 py-4 rounded-full font-bold hover:bg-graySubtle transition-all">
                Request In-Home Demo
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-3 gap-20">
        <div className="lg:col-span-2 space-y-20">
          {/* Overview */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-grayMedium mb-8 border-b border-grayBorder pb-4">Overview</h2>
            <p className="text-body text-grayMedium leading-relaxed">
              {lab.description}
            </p>
          </div>

          {/* Masteries */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-grayMedium mb-8 border-b border-grayBorder pb-4">What You’ll Master</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lab.masteryList.map((item, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <SwirlIcon className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <span className="text-body text-ink font-medium leading-tight">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Inclusions */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-grayMedium mb-8 border-b border-grayBorder pb-4">What’s Included</h2>
            <ul className="space-y-4">
              {lab.includedList.map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-grayMedium">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* How It Works */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-grayMedium mb-8 border-b border-grayBorder pb-4">How It Works</h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <span className="text-4xl font-bold text-grayLight">01</span>
                <div>
                  <h4 className="font-bold mb-2">Registration</h4>
                  <p className="text-sm text-grayMedium">Sign up online. You'll receive your Zoom link (for online) or arrival details (for in-home) instantly via email.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <span className="text-4xl font-bold text-grayLight">02</span>
                <div>
                  <h4 className="font-bold mb-2">Preparation</h4>
                  <p className="text-sm text-grayMedium">Review our shopping list, equipment checklist, and prep guide. We ensure you're ready to start before the clock ticks.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <span className="text-4xl font-bold text-grayLight">03</span>
                <div>
                  <h4 className="font-bold mb-2">The Lab</h4>
                  <p className="text-sm text-grayMedium">At class time, cook along with the chef in real-time. Ask questions, troubleshoot live, and get instant feedback.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients Section */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-grayMedium mb-8 border-b border-grayBorder pb-4">Ingredients Laboratory</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
              {lab.ingredients.map((ingredient, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b border-graySubtle group">
                  <span className="text-body text-ink font-medium">{ingredient}</span>
                  <div className="w-2 h-2 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Prep List (Focus on Equipment) */}
          <div className="bg-darkSurface text-white p-12 rounded-card">
            <h3 className="text-xl font-bold mb-10 text-center">Equipment & Tools Checklist</h3>
            <div className="max-w-2xl mx-auto">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-accent mb-6">Required Lab Equipment</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {lab.equipment.map((eq, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-grayLight border-b border-gray-800 pb-3">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 flex-shrink-0" />
                      {eq}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="pt-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12 border-b border-grayBorder pb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Lab Reviews</h2>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-graySubtle px-3 py-1 rounded-full border border-grayBorder">
                    <span className="text-sm font-bold">4.9</span>
                    <StarRating rating={5} />
                  </div>
                  <span className="text-xs font-medium text-grayMedium uppercase tracking-widest">Based on 142 bookings</span>
                </div>
              </div>
              <button 
                onClick={() => setShowReviewPrompt(true)}
                className="text-sm font-bold text-accent border border-accent border-opacity-30 px-6 py-3 rounded-full hover:bg-accent hover:text-white transition-all"
              >
                Write a Review
              </button>
            </div>

            <AnimatePresence>
              {showReviewPrompt && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mb-12"
                >
                  <div className="bg-graySubtle p-8 rounded-card border border-grayBorder text-center">
                    <p className="font-bold mb-2">Technical Submission System Coming Soon</p>
                    <p className="text-sm text-grayMedium mb-6">We're building a new way for you to share your lab results and photos of your lattice work. Stay tuned!</p>
                    <button onClick={() => setShowReviewPrompt(false)} className="text-xs font-bold uppercase tracking-widest underline decoration-accent underline-offset-4">Close</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-8">
              {MOCK_REVIEWS.map((review) => (
                <div key={review.id} className="p-8 border border-grayBorder rounded-card hover:bg-graySubtle transition-colors group">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-accent bg-opacity-10 flex items-center justify-center text-accent font-bold">
                        {review.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-ink">{review.name}</p>
                          {review.verified && (
                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">Verified</span>
                          )}
                        </div>
                        <p className="text-xs text-grayMedium">{review.date}</p>
                      </div>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-grayMedium leading-relaxed text-sm">
                    "{review.text}"
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <button className="text-sm font-bold text-grayMedium hover:text-ink transition-colors flex items-center gap-2 mx-auto uppercase tracking-widest">
                View all technique reports
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar / Quick Stats */}
        <div className="space-y-8">
          <div className="sticky top-32 border border-grayBorder rounded-card p-10 bg-white shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest text-accent mb-8">Lab Stats</h3>
            <div className="space-y-8">
              <div>
                <p className="text-xs text-grayMedium uppercase font-bold mb-1">Price</p>
                <p className="text-3xl font-bold text-ink">Starting at ${lab.price}</p>
                <p className="text-[10px] text-grayMedium mt-2">Final price updates based on format, headcount, and distance.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-grayMedium uppercase font-bold mb-1">Duration</p>
                  <p className="text-lg font-bold">{lab.duration}</p>
                </div>
                <div>
                  <p className="text-xs text-grayMedium uppercase font-bold mb-1">Format</p>
                  <p className="text-lg font-bold capitalize">{lab.type}</p>
                </div>
              </div>
              <div className="pt-8 border-t border-grayBorder">
                <Link to="/contact-booking" className="block w-full text-center bg-ink text-white py-4 rounded-full font-bold mb-4 hover:shadow-lg transition-all">
                  Book Lab Now
                </Link>
                <p className="text-center text-[11px] text-grayMedium">Limited seats available for upcoming weekends.</p>
              </div>
            </div>
          </div>

          <div className="border border-grayBorder rounded-card p-10 bg-graySubtle">
            <h3 className="text-sm font-bold uppercase tracking-widest text-ink mb-6">Good To Know</h3>
            <ul className="space-y-4">
              {lab.goodToKnow.map((note, i) => (
                <li key={i} className="text-xs text-grayMedium leading-relaxed italic">
                  — {note}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
