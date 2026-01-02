
import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BlogPost } from '../types.ts';

import blogData from '../data/blog.ts';

export const BlogPostDetail = () => {
  const { slug } = useParams();
  const post = blogData.find((p) => p.slug === slug);

  if (!post) {
    return <Navigate to="/404" />;
  }

  // Find other posts for a "Next Read" section
  const otherPosts = blogData.filter((p) => p.id !== post.id).slice(0, 2);

  return (
    <article className="bg-white min-h-screen pb-32">
      {/* Post Header */}
      <header className="pt-20 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-grayMedium hover:text-accent transition-colors mb-12">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
            Back to Lab Notes
          </Link>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-bold text-accent uppercase tracking-[0.2em] mb-4"
          >
            {post.date}
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-h1 font-bold leading-tight mb-8"
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
          className="aspect-video rounded-card overflow-hidden bg-grayLight border border-grayBorder shadow-sm"
        >
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="prose prose-lg prose-ink max-w-none">
          <p className="text-xl text-grayMedium font-medium leading-relaxed mb-12 italic border-l-4 border-accent pl-8 py-2">
            {post.excerpt}
          </p>
          <div className="text-body text-ink leading-relaxed space-y-8 whitespace-pre-line">
            {post.content}
            {/* Added more dummy content for visual depth if the post content is short */}
            {post.content.length < 500 && (
              <>
                <h2 className="text-2xl font-bold mt-12 mb-6">Technique First</h2>
                <p>
                  In the Dosa Lab, we believe that understanding the "why" is more important than memorizing the "how". 
                  When you understand the chemical reactions occurring during fermentation—how the lactic acid bacteria 
                  interact with the starches in the rice—you gain the freedom to cook in any environment. 
                  Whether you're in a humid apartment in Jersey City or a dry house in Montclair during mid-winter, 
                  the principles remain the same.
                </p>
                <div className="bg-graySubtle p-10 rounded-card border border-grayBorder my-12">
                  <h4 className="font-bold mb-4">Pro Tip: Thermal Mass</h4>
                  <p className="text-sm text-grayMedium">
                    Always allow your tawa to pre-heat for at least 4-5 minutes on medium heat. 
                    A common mistake is rushing to spread the first dosa on a surface that hasn't reached 
                    thermal equilibrium, leading to sticking or uneven browning.
                  </p>
                </div>
                <p>
                  As we continue to experiment with different grain ratios and fermentation timelines, 
                  we'll keep sharing our findings here. The journey to the perfect dosa is ongoing, 
                  and every lab session brings new insights into this ancient, scientific craft.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Post Footer / Share */}
        <footer className="mt-24 pt-12 border-t border-grayBorder flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-ink text-white rounded-full flex items-center justify-center font-bold">DL</div>
            <div>
              <p className="text-sm font-bold">Dosalabs Editorial</p>
              <p className="text-xs text-grayMedium">Technique Research Team</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="text-xs font-bold uppercase tracking-widest border border-grayBorder px-6 py-3 rounded-full hover:bg-graySubtle transition-all">Share Link</button>
            <Link to="/contact-booking" className="text-xs font-bold uppercase tracking-widest bg-ink text-white px-6 py-3 rounded-full hover:bg-opacity-90 transition-all">Join a Lab</Link>
          </div>
        </footer>
      </div>

      {/* Related Posts */}
      {otherPosts.length > 0 && (
        <section className="bg-graySubtle mt-32 py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-sm font-bold uppercase tracking-widest text-grayMedium mb-12 text-center">More from the Lab</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {otherPosts.map((other) => (
                <Link key={other.id} to={`/blog/${other.slug}`} className="group bg-white p-8 rounded-card border border-grayBorder hover:shadow-xl transition-all">
                  <p className="text-xs font-bold text-accent mb-2">{other.date}</p>
                  <h4 className="text-xl font-bold mb-4 group-hover:text-accent transition-colors">{other.title}</h4>
                  <p className="text-sm text-grayMedium line-clamp-2">{other.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
};
