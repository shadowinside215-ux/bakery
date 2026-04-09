/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Star, MapPin, Clock, Award, UtensilsCrossed, Heart, Menu, X } from "lucide-react";
import { useState } from "react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8 }
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen selection:bg-bakery-gold selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bakery-cream/80 backdrop-blur-md border-b border-bakery-brown/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-serif font-bold tracking-tight text-bakery-brown">
            MounRed
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest font-medium">
            <a href="#about" className="hover:text-bakery-gold transition-colors">About</a>
            <a href="#why-us" className="hover:text-bakery-gold transition-colors">Why Us</a>
            <a href="#reviews" className="hover:text-bakery-gold transition-colors">Reviews</a>
            <a href="#visit" className="hover:text-bakery-gold transition-colors">Visit Us</a>
          </div>

          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="md:hidden bg-bakery-cream border-b border-bakery-brown/10 px-6 py-8 flex flex-col gap-6 text-center uppercase tracking-widest font-medium"
          >
            <a href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
            <a href="#why-us" onClick={() => setIsMenuOpen(false)}>Why Us</a>
            <a href="#reviews" onClick={() => setIsMenuOpen(false)}>Reviews</a>
            <a href="#visit" onClick={() => setIsMenuOpen(false)}>Visit Us</a>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-bakery-brown/40 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=2000" 
            alt="Fresh bread" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="relative z-20 text-center px-6 max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-7xl md:text-9xl font-serif text-bakery-cream mb-6 drop-shadow-2xl"
          >
            MounRed
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl md:text-2xl text-bakery-cream/90 font-light italic mb-10 tracking-wide"
          >
            "Sweet, Fresh & Perfect — Salé's Finest Bakery"
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a 
              href="#visit" 
              className="bg-bakery-gold hover:bg-bakery-gold/90 text-white px-10 py-4 rounded-full text-sm uppercase tracking-[0.2em] font-bold transition-all transform hover:scale-105"
            >
              Find Us
            </a>
            <a 
              href="#about" 
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-10 py-4 rounded-full text-sm uppercase tracking-[0.2em] font-bold transition-all"
            >
              Our Story
            </a>
          </motion.div>
        </div>

        {/* Decorative Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-bakery-cream/60"
        >
          <div className="w-[1px] h-12 bg-bakery-cream/40 mx-auto mb-2" />
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6 bg-bakery-cream">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeIn}>
            <UtensilsCrossed className="w-10 h-10 mx-auto mb-8 text-bakery-gold opacity-60" />
            <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">Crafting Moments of Joy</h2>
            <p className="text-lg md:text-xl leading-relaxed text-bakery-brown/80 font-light max-w-2xl mx-auto">
              MounRed is a beloved neighborhood bakery in Salé, Morocco, known for its irresistible baked goods, 
              exceptional quality, and warm service. Every product is crafted with care — from our golden 
              pastries to our freshly baked bread.
            </p>
            <div className="mt-12 flex justify-center">
              <div className="w-24 h-[1px] bg-bakery-gold/30" />
              <div className="mx-4 text-bakery-gold">❦</div>
              <div className="w-24 h-[1px] bg-bakery-gold/30" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-us" className="py-32 px-6 bg-bakery-brown text-bakery-cream">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-12"
          >
            <motion.div variants={fadeIn} className="text-center p-8 border border-bakery-cream/10 rounded-3xl hover:bg-bakery-cream/5 transition-colors">
              <div className="w-16 h-16 bg-bakery-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="text-bakery-gold w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif mb-4">Quality Ingredients</h3>
              <p className="text-bakery-cream/70 font-light">Only the freshest and finest go into every product we bake daily.</p>
            </motion.div>

            <motion.div variants={fadeIn} className="text-center p-8 border border-bakery-cream/10 rounded-3xl hover:bg-bakery-cream/5 transition-colors">
              <div className="w-16 h-16 bg-bakery-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="text-bakery-gold w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif mb-4">Outstanding Service</h3>
              <p className="text-bakery-cream/70 font-light">Warm, friendly, and always welcoming to our Salé community.</p>
            </motion.div>

            <motion.div variants={fadeIn} className="text-center p-8 border border-bakery-cream/10 rounded-3xl hover:bg-bakery-cream/5 transition-colors">
              <div className="w-16 h-16 bg-bakery-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="flex items-center gap-1">
                  <Star className="text-bakery-gold w-6 h-6 fill-bakery-gold" />
                  <span className="text-xl font-bold text-bakery-gold">4.2</span>
                </div>
              </div>
              <h3 className="text-2xl font-serif mb-4">Customer Favorite</h3>
              <p className="text-bakery-cream/70 font-light">Proudly rated 4.2/5 by 44 happy customers and counting.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-32 px-6 bg-bakery-cream overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif mb-4">What Our Customers Say</h2>
            <div className="flex justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < 4 ? 'fill-bakery-gold text-bakery-gold' : 'text-bakery-gold/30'}`} />
              ))}
            </div>
            <p className="text-bakery-brown/60 uppercase tracking-widest text-xs">Based on 44 reviews</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Ziad Laqlioual",
                text: "A very good bakery, all of the products are good. I totally invite people to taste their baked goods. Nice work!!",
                stars: 5
              },
              {
                name: "Hajar Bousaal",
                text: "Best one.",
                stars: 5
              },
              {
                name: "احمد الرمادي",
                text: "Excellent taste, outstanding service, and high quality.",
                stars: 5
              }
            ].map((review, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-white p-10 rounded-[2rem] shadow-xl shadow-bakery-brown/5 border border-bakery-brown/5 relative"
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-bakery-gold rounded-full flex items-center justify-center text-white text-2xl font-serif">
                  "
                </div>
                <div className="flex gap-1 mb-6">
                  {[...Array(review.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-bakery-gold text-bakery-gold" />
                  ))}
                </div>
                <p className="text-bakery-brown/80 mb-8 italic leading-relaxed">"{review.text}"</p>
                <div className="font-bold text-bakery-brown uppercase tracking-widest text-sm">{review.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visit Us Section */}
      <section id="visit" className="py-32 px-6 bg-bakery-gold/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeIn}>
              <h2 className="text-4xl md:text-5xl font-serif mb-8">Visit Us</h2>
              <p className="text-xl text-bakery-brown/70 mb-12 font-light">
                Come visit us and experience the taste that everyone's talking about. 
                We're waiting for you with fresh batches every morning.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-bakery-gold/10 rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin className="text-bakery-gold" />
                  </div>
                  <div>
                    <h4 className="font-bold uppercase tracking-widest text-sm mb-1">Address</h4>
                    <p className="text-bakery-brown/80">928 Av. Melouiya, Salé, Morocco</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-bakery-gold/10 rounded-2xl flex items-center justify-center shrink-0">
                    <Clock className="text-bakery-gold" />
                  </div>
                  <div>
                    <h4 className="font-bold uppercase tracking-widest text-sm mb-1">Hours</h4>
                    <p className="text-bakery-brown/80">Open Daily: 7:00 AM - 10:00 PM</p>
                  </div>
                </div>
              </div>

              <a 
                href="https://maps.google.com/?q=928+Av.+Melouiya,+Salé,+Morocco"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-12 bg-bakery-brown text-bakery-cream px-10 py-4 rounded-full text-sm uppercase tracking-widest font-bold hover:bg-bakery-brown/90 transition-all"
              >
                Get Directions
              </a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="h-[500px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white"
            >
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3306.46789454848!2d-6.8083!3d34.0333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDAyJzAwLjAiTiA2wrA0OCcyOS45Ilc!5e0!3m2!1sen!2sma!4v1620000000000!5m2!1sen!2sma" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bakery-brown text-bakery-cream py-20 px-6 border-t border-bakery-cream/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-3xl font-serif mb-8 tracking-tight">MounRed</div>
          <p className="text-bakery-cream/60 text-sm uppercase tracking-[0.3em] mb-12">
            Made with 🤎 and flour
          </p>
          <div className="flex justify-center gap-8 mb-12">
            <a href="#" className="hover:text-bakery-gold transition-colors">Instagram</a>
            <a href="#" className="hover:text-bakery-gold transition-colors">Facebook</a>
            <a href="#" className="hover:text-bakery-gold transition-colors">WhatsApp</a>
          </div>
          <div className="w-full h-[1px] bg-bakery-cream/10 mb-12" />
          <p className="text-bakery-cream/40 text-xs tracking-widest">
            © 2025 MounRed Bakery — Salé, Morocco. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
