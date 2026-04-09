/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { Star, MapPin, Clock, Award, UtensilsCrossed, Heart, Menu, X, Instagram, MessageCircle, Globe, LogIn, LogOut, Plus, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { auth, db } from "./firebase";
import { 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  deleteDoc, 
  doc,
  serverTimestamp,
  getDocFromServer
} from "firebase/firestore";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  // We don't want to crash the app, but we want to log it for debugging
}

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

interface GalleryImage {
  id: string;
  url: string;
  createdAt: any;
}

export default function App() {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Admin Login State
  const [loginName, setLoginName] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const images = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GalleryImage[];
      setGallery(images);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "gallery");
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. ");
        }
      }
    }
    testConnection();
  }, []);

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsMenuOpen(false);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    
    // Custom logic for 'sam' / 'sam2006'
    if (loginName === "sam" && loginPass === "sam2006") {
      // In a real app, we'd use custom tokens or a specific user.
      // For this demo, we'll try to sign in with a placeholder or just set local state
      // but to satisfy Firebase rules, we need a real auth session.
      // We'll use the email login as the primary secure way.
      setLoginError("Please use 'Sign in with Google' or Email for secure access.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, loginName, loginPass);
      setIsAdminOpen(false);
    } catch (err: any) {
      setLoginError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setIsAdminOpen(false);
    } catch (err: any) {
      setLoginError(err.message);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setErrorMessage("Cloudinary is not configured. Please add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to your secrets.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      
      if (data.secure_url) {
        try {
          await addDoc(collection(db, "gallery"), {
            url: data.secure_url,
            createdAt: serverTimestamp()
          });
        } catch (dbErr) {
          handleFirestoreError(dbErr, OperationType.WRITE, "gallery");
          setErrorMessage("Failed to save image to database. Check permissions.");
        }
      } else if (data.error) {
        setErrorMessage(`Upload error: ${data.error.message}`);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setErrorMessage("Upload failed. Check console for details.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (id: string) => {
    try {
      await deleteDoc(doc(db, "gallery", id));
      setImageToDelete(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `gallery/${id}`);
      setErrorMessage("Failed to delete image. You might not have permission.");
    }
  };

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
            <a href="#about" className="hover:text-bakery-gold transition-colors">{t('nav.about')}</a>
            <a href="#why-us" className="hover:text-bakery-gold transition-colors">{t('nav.whyUs')}</a>
            <a href="#gallery" className="hover:text-bakery-gold transition-colors">{t('nav.gallery')}</a>
            <a href="#reviews" className="hover:text-bakery-gold transition-colors">{t('nav.reviews')}</a>
            <a href="#visit" className="hover:text-bakery-gold transition-colors">{t('nav.visit')}</a>
            
            <div className="flex items-center gap-2 border-l border-bakery-brown/20 pl-6">
              <button onClick={() => changeLanguage('en')} className={`hover:text-bakery-gold ${i18n.language === 'en' ? 'text-bakery-gold' : ''}`}>EN</button>
              <button onClick={() => changeLanguage('fr')} className={`hover:text-bakery-gold ${i18n.language === 'fr' ? 'text-bakery-gold' : ''}`}>FR</button>
              <button onClick={() => changeLanguage('ar')} className={`hover:text-bakery-gold ${i18n.language === 'ar' ? 'text-bakery-gold' : ''}`}>AR</button>
            </div>

            <button 
              onClick={() => user ? handleLogout() : setIsAdminOpen(true)}
              className="flex items-center gap-2 bg-bakery-brown text-bakery-cream px-4 py-2 rounded-full text-xs hover:bg-bakery-brown/90 transition-all"
            >
              {user ? <LogOut size={14} /> : <LogIn size={14} />}
              {user ? t('nav.admin') : t('nav.admin')}
            </button>
          </div>

          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-bakery-cream border-b border-bakery-brown/10 px-6 py-8 flex flex-col gap-6 text-center uppercase tracking-widest font-medium"
            >
              <a href="#about" onClick={() => setIsMenuOpen(false)}>{t('nav.about')}</a>
              <a href="#why-us" onClick={() => setIsMenuOpen(false)}>{t('nav.whyUs')}</a>
              <a href="#gallery" onClick={() => setIsMenuOpen(false)}>{t('nav.gallery')}</a>
              <a href="#reviews" onClick={() => setIsMenuOpen(false)}>{t('nav.reviews')}</a>
              <a href="#visit" onClick={() => setIsMenuOpen(false)}>{t('nav.visit')}</a>
              
              <div className="flex justify-center gap-6 py-4 border-y border-bakery-brown/10">
                <button onClick={() => changeLanguage('en')}>EN</button>
                <button onClick={() => changeLanguage('fr')}>FR</button>
                <button onClick={() => changeLanguage('ar')}>AR</button>
              </div>

              <button 
                onClick={() => { user ? handleLogout() : setIsAdminOpen(true); setIsMenuOpen(false); }}
                className="flex items-center justify-center gap-2 bg-bakery-brown text-bakery-cream py-4 rounded-xl"
              >
                {user ? <LogOut size={16} /> : <LogIn size={16} />}
                {user ? "Sign Out" : "Admin Login"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
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
            {t('hero.tagline')}
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
              {t('hero.cta')}
            </a>
            <a 
              href="#about" 
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-10 py-4 rounded-full text-sm uppercase tracking-[0.2em] font-bold transition-all"
            >
              {t('hero.story')}
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
            <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">{t('about.title')}</h2>
            <p className="text-lg md:text-xl leading-relaxed text-bakery-brown/80 font-light max-w-2xl mx-auto">
              {t('about.text')}
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
              <h3 className="text-2xl font-serif mb-4">{t('whyUs.ingredients')}</h3>
              <p className="text-bakery-cream/70 font-light">{t('whyUs.ingredientsText')}</p>
            </motion.div>

            <motion.div variants={fadeIn} className="text-center p-8 border border-bakery-cream/10 rounded-3xl hover:bg-bakery-cream/5 transition-colors">
              <div className="w-16 h-16 bg-bakery-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="text-bakery-gold w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif mb-4">{t('whyUs.service')}</h3>
              <p className="text-bakery-cream/70 font-light">{t('whyUs.serviceText')}</p>
            </motion.div>

            <motion.div variants={fadeIn} className="text-center p-8 border border-bakery-cream/10 rounded-3xl hover:bg-bakery-cream/5 transition-colors">
              <div className="w-16 h-16 bg-bakery-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="flex items-center gap-1">
                  <Star className="text-bakery-gold w-6 h-6 fill-bakery-gold" />
                  <span className="text-xl font-bold text-bakery-gold">4.2</span>
                </div>
              </div>
              <h3 className="text-2xl font-serif mb-4">{t('whyUs.favorite')}</h3>
              <p className="text-bakery-cream/70 font-light">{t('whyUs.favoriteText')}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-32 px-6 bg-bakery-cream">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif mb-4">{t('nav.gallery')}</h2>
            <div className="w-20 h-1 bg-bakery-gold mx-auto rounded-full opacity-30" />
          </motion.div>

          {user && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12 p-8 bg-bakery-brown/5 rounded-3xl border-2 border-dashed border-bakery-gold/30 text-center">
              <input 
                type="file" 
                id="gallery-upload" 
                className="hidden" 
                onChange={handleFileUpload}
                accept="image/*"
              />
              <label 
                htmlFor="gallery-upload" 
                className="cursor-pointer flex flex-col items-center gap-4 group"
              >
                <div className="w-16 h-16 bg-bakery-gold/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  {isUploading ? <Loader2 className="animate-spin text-bakery-gold" /> : <Plus className="text-bakery-gold" />}
                </div>
                <div className="font-bold uppercase tracking-widest text-sm text-bakery-brown">
                  {isUploading ? "Uploading..." : "Add New Photo"}
                </div>
              </label>
            </motion.div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.length > 0 ? (
              gallery.map((img, idx) => (
                <motion.div 
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-bakery-brown/5"
                >
                  <img 
                    src={img.url} 
                    alt="Gallery" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  {user && (
                    <button 
                      onClick={() => setImageToDelete(img.id)}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </motion.div>
              ))
            ) : (
              // Placeholder images if gallery is empty
              [1,2,3,4].map((i) => (
                <div key={i} className="aspect-square rounded-2xl bg-bakery-brown/5 animate-pulse" />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-32 px-6 bg-bakery-gold/5 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif mb-4">{t('reviews.title')}</h2>
            <div className="flex justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < 4 ? 'fill-bakery-gold text-bakery-gold' : 'text-bakery-gold/30'}`} />
              ))}
            </div>
            <p className="text-bakery-brown/60 uppercase tracking-widest text-xs">{t('reviews.count')}</p>
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
      <section id="visit" className="py-32 px-6 bg-bakery-cream">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeIn}>
              <h2 className="text-4xl md:text-5xl font-serif mb-8">{t('visit.title')}</h2>
              <p className="text-xl text-bakery-brown/70 mb-12 font-light">
                {t('visit.text')}
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-bakery-gold/10 rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin className="text-bakery-gold" />
                  </div>
                  <div>
                    <h4 className="font-bold uppercase tracking-widest text-sm mb-1">{t('visit.address')}</h4>
                    <p className="text-bakery-brown/80">928 Av. Melouiya, Salé, Morocco</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-bakery-gold/10 rounded-2xl flex items-center justify-center shrink-0">
                    <Clock className="text-bakery-gold" />
                  </div>
                  <div>
                    <h4 className="font-bold uppercase tracking-widest text-sm mb-1">{t('visit.hours')}</h4>
                    <p className="text-bakery-brown/80">{t('visit.hoursText')}</p>
                  </div>
                </div>
              </div>

              <a 
                href="https://maps.google.com/?q=928+Av.+Melouiya,+Salé,+Morocco"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-12 bg-bakery-brown text-bakery-cream px-10 py-4 rounded-full text-sm uppercase tracking-widest font-bold hover:bg-bakery-brown/90 transition-all"
              >
                {t('visit.directions')}
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
          
          <div className="flex justify-center gap-12 mb-12">
            <a 
              href="https://www.instagram.com/maisonmounred?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
              target="_blank" 
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-12 h-12 bg-bakery-cream/10 rounded-full flex items-center justify-center group-hover:bg-bakery-gold transition-colors">
                <Instagram size={20} />
              </div>
              <span className="text-[10px] uppercase tracking-widest">Instagram</span>
            </a>
            
            <a 
              href="https://wa.me/212766555535" 
              target="_blank" 
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-12 h-12 bg-bakery-cream/10 rounded-full flex items-center justify-center group-hover:bg-green-600 transition-colors">
                <MessageCircle size={20} />
              </div>
              <span className="text-[10px] uppercase tracking-widest">WhatsApp</span>
            </a>
          </div>

          <div className="w-full h-[1px] bg-bakery-cream/10 mb-12" />
          <p className="text-bakery-cream/40 text-xs tracking-widest">
            © 2025 MounRed Bakery — Salé, Morocco. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {isAdminOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-bakery-brown/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-bakery-cream w-full max-w-md p-10 rounded-[2.5rem] shadow-2xl relative"
            >
              <button 
                onClick={() => setIsAdminOpen(false)}
                className="absolute top-6 right-6 text-bakery-brown/40 hover:text-bakery-brown"
              >
                <X />
              </button>
              
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-bakery-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="text-bakery-gold" />
                </div>
                <h3 className="text-2xl font-serif">Admin Access</h3>
                <p className="text-sm text-bakery-brown/60 mt-2">Sign in to manage your gallery</p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Email / Name</label>
                  <input 
                    type="text" 
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                    className="w-full bg-white border border-bakery-brown/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bakery-gold/50"
                    placeholder="sam"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Password</label>
                  <input 
                    type="password" 
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    className="w-full bg-white border border-bakery-brown/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bakery-gold/50"
                    placeholder="sam2006"
                  />
                </div>

                {loginError && <p className="text-red-500 text-xs text-center">{loginError}</p>}

                <button 
                  type="submit"
                  className="w-full bg-bakery-brown text-bakery-cream py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-bakery-brown/90 transition-all"
                >
                  Login
                </button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-bakery-brown/10"></div></div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest text-bakery-brown/40"><span className="bg-bakery-cream px-4">Or</span></div>
              </div>

              <button 
                onClick={handleGoogleLogin}
                className="w-full bg-white border border-bakery-brown/10 text-bakery-brown py-4 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-bakery-brown/5 transition-all"
              >
                <Globe size={18} />
                Sign in with Google
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {imageToDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-bakery-brown/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-bakery-cream w-full max-w-sm p-8 rounded-[2rem] shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="text-red-500" />
              </div>
              <h3 className="text-xl font-serif mb-2">Delete Photo?</h3>
              <p className="text-sm text-bakery-brown/60 mb-8">This action cannot be undone.</p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setImageToDelete(null)}
                  className="flex-1 bg-bakery-brown/5 text-bakery-brown py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-bakery-brown/10 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleDeleteImage(imageToDelete)}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message Toast */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[120] bg-red-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3"
          >
            <span className="text-sm font-medium">{errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="p-1 hover:bg-white/20 rounded-full">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
