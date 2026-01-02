
import React from 'react';
import { SwirlIcon } from '../constants.tsx';
import { motion } from 'framer-motion';

export const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-h1 font-bold mb-8">The Dosalabs Philosophy</h1>
          <div className="space-y-6 text-body text-grayMedium mb-10 leading-relaxed">
            <p>
              At Dosalabs, we believe great food begins with great technique — and that starts in your kitchen. We all eat out more than we should: hurried lunches, low-quality ingredients, and oil-heavy versions of our favorite classics. But what if you could cook food that tastes better than most restaurants and is truly nourishing?
            </p>
            <p>
              Traditional Indian recipes often fail at home because they were designed for open wood flames, humid climates, and cookware that doesn’t match modern kitchens. The result? Flat dosas, gummy idlis, oily vadas, and bland sambars.
            </p>
            <p>
              Dosalabs was born in Montclair, New Jersey, where we saw this exact problem again and again — brilliant flavors, frustrated cooks. So we flipped the script: instead of giving you a card with ingredients, we teach you to read your batter, feel your pan, and master heat zones so you cook with confidence, not guesswork.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-grayBorder pt-10">
            <div>
              <p className="text-4xl font-bold mb-2 text-ink">2.5k+</p>
              <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Home Cooks Helped</p>
              <p className="text-sm text-grayMedium leading-snug italic">Who now get crispy dosas without burning batter.</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2 text-ink">12</p>
              <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Core Lab Techniques</p>
              <p className="text-sm text-grayMedium leading-snug">Fermentation, heat control, pan mastery, shaping, and tempering.</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="aspect-square bg-graySubtle rounded-card overflow-hidden shadow-2xl border border-grayBorder"
        >
          <img 
            src="https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?q=80&w=1470&auto=format&fit=crop" 
            alt="Founder cooking in the lab" 
            className="w-full h-full object-cover" 
          />
        </motion.div>
      </div>

      <div className="bg-darkSurface text-white p-12 md:p-20 rounded-card relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-accent opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
         
         <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-h2 font-bold mb-12">Our Commitment</h2>
            <div className="space-y-12 text-left">
               <div className="flex gap-6">
                 <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center flex-shrink-0">
                    <SwirlIcon className="w-6 h-6 text-accent" />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold mb-2 text-white">Inclusivity-first</h3>
                   <p className="text-gray-400 leading-relaxed">Our labs are designed for any stove—induction, electric coil, or commercial gas. We adapt the science to your environment.</p>
                 </div>
               </div>
               <div className="flex gap-6">
                 <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center flex-shrink-0">
                    <SwirlIcon className="w-6 h-6 text-accent" />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold mb-2 text-white">Hygiene & Safety</h3>
                   <p className="text-gray-400 leading-relaxed">All in-home chefs are ServSafe certified and strictly follow local health protocols. Your kitchen is treated as a professional lab.</p>
                 </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
