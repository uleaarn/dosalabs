import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { BlogPost } from '../types.ts';
import blogData from '../data/blog.ts';

export const BlogPostDetail = () => {
  const { slug } = useParams();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const post = useMemo(() => blogData.find((p) => p.slug === slug), [slug]);

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Calculate reading time
  const readingTime = useMemo(() => {
    if (!post) return 0;
    const wordsPerMinute = 200;
    const noOfWords = post.content.split(/\s/g).length + 400; // +400 for the extra filler content added below
    return Math.ceil(noOfWords / wordsPerMinute);
  }, [post]);

  if (!post) {
    return <Navigate to="/404" />;
  }

  const otherPosts = blogData.filter((p) => p.id !== post.id).slice(0, 2);

  return (
    <article className="bg-white min-h-screen pb-32 relative">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Post Header */}
      <header className="pt-20 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-grayMedium hover:text-accent transition-colors mb-12 group"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="group-hover:-translate-x-1 transition-transform">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Lab Notes
          </Link>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]"
            >
              {post.date}
            </motion.p>
            <div className="w-1 h-1 bg-grayBorder rounded-full" />
            <p className="text-[10px] font-bold text-grayMedium uppercase tracking-[0.2em]">
              {readingTime} Min Read
            </p>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-h1 font-bold leading-[1.1] tracking-tight mb-8"
          >
            {post.title}
          </motion.h1>
        </div>
      </header>

      {/* Hero Image */}
      <div className="max-w-5xl mx-auto px-6 mb-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="aspect-video rounded-card overflow-hidden bg-grayLight border border-grayBorder shadow-xl relative"
        >
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/5" />
        </motion.div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Sidebar - Social Share (Hidden on small screens) */}
        <aside className="hidden lg:block lg:col-span-2">
          <div className="sticky top-40 space-y-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-grayMedium mb-6">Share</p>
            <div className="flex flex-col gap-4">
              {['Twitter', 'Facebook', 'LinkedIn', 'Copy'].map((platform) => (
                <button 
                  key={platform}
                  className="w-10 h-10 rounded-full border border-grayBorder flex items-center justify-center text-grayMedium hover:text-accent hover:border-accent transition-all group"
                  title={`Share on ${platform}`}
                >
                  <span className="sr-only">{platform}</span>
                  <div className="w-4 h-4 bg-current rounded-sm opacity-20 group-hover:opacity-40" />
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Content Column */}
        <div className="lg:col-span-8">
          <div className="prose prose-lg prose-ink max-w-none">
            <p className="text-xl text-grayMedium font-medium leading-relaxed mb-16 italic border-l-4 border-accent pl-8 py-2 bg-accent/5 rounded-r-lg">
              {post.excerpt}
            </p>
            
            <div className="text-body text-ink leading-[1.8] space-y-10 whitespace-pre-line font-serif lg:text-lg">
              {post.content}
              
              {/* Dynamic Content Expansion for Detail */}
              <h2 className="text-3xl font-bold mt-16 mb-8 text-ink font-sans tracking-tight">The Science of Consistency</h2>
              <p>
                In the Dosa Lab, we believe that understanding the "why" is more important than memorizing the "how". 
                When you understand the chemical reactions occurring during fermentation—how the lactic acid bacteria 
                interact with the starches in the rice—you gain the freedom to cook in any environment. 
              </p>
              
              <div className="bg-graySubtle p-12 rounded-card border border-grayBorder my-16 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.45l8.27 14.3H3.73L12 5.45zM11 16h2v2h-2v-2zm0-7h2v5h-2V9z"/></svg>
                </div>
                <h4 className="font-bold mb-4 text-accent uppercase tracking-widest text-xs">Lab Note: Thermal Equilibrium</h4>
                <p className="text-sm text-grayMedium leading-relaxed">
                  Always allow your tawa to pre-heat for at least 4-5 minutes on medium heat. 
                  A common mistake is rushing to spread the first dosa on a surface that hasn't reached 
                  thermal equilibrium. This leads to the batter "dragging" instead of gliding.
                </p>
              </div>

              <p>
                Whether you're in a humid apartment in Jersey City or a dry house in Montclair during mid-winter, 
                the principles of osmotic pressure and bacterial growth remain constant. We focus on these 
                universals so you can produce a perfect lattice texture every time.
              </p>
              
              <h3 className="text-2xl font-bold mt-12 mb-6 font-sans">Next Steps</h3>
              <p>
                As we continue to experiment with different grain ratios and fermentation timelines, 
                we'll keep sharing our findings here. The journey to the perfect dosa is ongoing, 
                and every lab session brings new insights into this ancient, scientific craft.
              </p>
            </div>
          </div>

          {/* Post Footer / Author Bio */}
          <footer className="mt-32 pt-16 border-t border-grayBorder flex flex-col sm:flex-row items-center justify-between gap-12">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-ink text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">DL</div>
              <div>
                <p className="text-sm font-bold text-ink mb-1">Dosalabs Editorial</p>
                <p className="text-xs text-grayMedium leading-relaxed uppercase tracking-widest font-medium">Technique Research Team</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="text-[10px] font-bold uppercase tracking-widest border border-grayBorder px-8 py-3.5 rounded-full hover:bg-graySubtle transition-all active:scale-[0.98]">
                Copy Article Link
              </button>
              <Link to="/contact-booking" className="text-[10px] font-bold uppercase tracking-widest bg-ink text-white px-8 py-3.5 rounded-full hover:bg-accent transition-all shadow-md active:scale-[0.98]">
                Join a Live Lab
              </Link>
            </div>
          </footer>
        </div>

        {/* Right Sidebar - Newsletter/CTA (Hidden on smaller screens) */}
        <aside className="hidden lg:block lg:col-span-2">
          <div className="sticky top-40 bg-graySubtle p-6 rounded-2xl border border-grayBorder">
            <p className="text-xs font-bold uppercase tracking-widest text-ink mb-4">Stay Updated</p>
            <p className="text-[11px] text-grayMedium leading-relaxed mb-6">Get the latest lab results and technique logs delivered weekly.</p>
            <input 
              type="email" 
              placeholder="Email..." 
              className="w-full bg-white border border-grayBorder p-3 rounded-lg text-xs mb-3 focus:outline-none focus:border-accent"
            />
            <button className="w-full bg-ink text-white text-[10px] font-bold uppercase tracking-widest py-3 rounded-lg hover:bg-accent transition-colors">
              Subscribe
            </button>
          </div>
        </aside>
      </div>

      {/* Related Posts Section */}
      {otherPosts.length > 0 && (
        <section className="bg-graySubtle mt-32 py-32 px-6 border-y border-grayBorder">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-4">Next in the Lab</h3>
              <h4 className="text-3xl font-bold tracking-tight">More Field Reports</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {otherPosts.map((other) => (
                <Link 
                  key={other.id} 
                  to={`/blog/${other.slug}`} 
                  className="group bg-white p-10 rounded-card border border-grayBorder hover:shadow-2xl hover:border-accent/30 transition-all duration-500 flex flex-col h-full"
                >
                  <p className="text-[10px] font-bold text-accent mb-4 uppercase tracking-widest">{other.date}</p>
                  <h5 className="text-2xl font-bold mb-6 group-hover:text-accent transition-colors leading-tight">{other.title}</h5>
                  <p className="text-sm text-grayMedium line-clamp-2 leading-relaxed mb-8 flex-grow">{other.excerpt}</p>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-ink inline-flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                    Read Report
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
};