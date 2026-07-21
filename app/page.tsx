'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  Shield, 
  Heart, 
  Sparkles, 
  MapPin, 
  Clock, 
  Calendar, 
  Menu, 
  X, 
  Check, 
  CheckCircle, 
  ArrowRight, 
  Star, 
  Eye, 
  BookOpen, 
  Trash2,
  Lock,
  Compass,
  AlertCircle
} from 'lucide-react';

// Types for Appointments
interface Appointment {
  id: string;
  name: string;
  email: string;
  treatment: string;
  date: string;
  time: string;
  notes: string;
  status: 'Pending Review' | 'Confirmed';
  createdAt: string;
}

// Treatments Data
const TREATMENTS = [
  {
    id: 'neuromodulators',
    title: 'Neuromodulators',
    icon: Sparkles,
    shortDesc: 'Botox, Dysport, and Xeomin to soften fine lines and prevent wrinkle formation with expert precision.',
    price: '$14 / Unit',
    duration: '15-30 mins',
    downtime: 'None (avoid exercise for 4 hours)',
    clinicalDetails: 'Highly purified proteins injected into facial muscles to block signals that cause repetitive contractions. Safely prevents static creases from forming, restoring a naturally relaxed, unhurried youthfulness.',
    benefits: [
      'Visibly softens frown lines, forehead lines, and crow\'s feet',
      'Provides a subtle, natural brow lift',
      'Zero downtime, allowing you to return to your day immediately',
      'Preventative benefits against new static wrinkle formation'
    ],
    faq: 'Most clients notice softening within 3 to 7 days, with full results locking in by day 14. Longevity typically ranges from 3 to 4 months depending on individual metabolism.'
  },
  {
    id: 'dermal-fillers',
    title: 'Dermal Fillers',
    icon: Award,
    shortDesc: 'Restore volume, sculpt jawlines, and enhance lips using high-grade hyaluronic acid fillers.',
    price: '$750 / Syringe',
    duration: '45-60 mins',
    downtime: '1-3 days (mild swelling or potential bruising)',
    clinicalDetails: 'Premium, cohesive hyaluronic acid gels engineered to mimic the body\'s natural supportive substance. Meticulously layered into specific tissue planes to recreate youthful structure, refine symmetry, and restore plumpness.',
    benefits: [
      'Restores lost cheek and midface volume instantly',
      'Refines and defines jawline and chin contours',
      'Gently plumps lips while smoothing fine perioral lines',
      'Stimulates secondary natural collagen synthesis'
    ],
    faq: 'Results are visible instantly. Swelling subsides within 48 to 72 hours. High-end dermal fillers typically endure between 9 to 18 months.'
  },
  {
    id: 'hydrafacial',
    title: 'HydraFacial',
    icon: Heart,
    shortDesc: 'A multi-step treatment that cleanses, exfoliates, and extracts while infusing skin with vital serums.',
    price: '$199 / Session',
    duration: '45 mins',
    downtime: 'Zero (immediate radiant glow)',
    clinicalDetails: 'A patented 3-step system utilizing Vortex-Fusion technology to thoroughly vacuum out blackheads and debris, gently peel away surface dullness, and instantly drench the skin in high-potency antioxidants and hyaluronic acid.',
    benefits: [
      'Deeply cleanses and unclogs congested pores',
      'Polishes uneven texture for a silky feel',
      'Drenches cellular layers in nourishing peptides and moisture',
      'Excellent prep for active injectables or lasers'
    ],
    faq: 'The ultimate prep treatment. We recommend one HydraFacial monthly to maintain skin health, cellular turnover, and a consistent glass-like radiance.'
  }
];

// Memberships Data
const MEMBERSHIPS = [
  {
    id: 'glow',
    name: 'GLOW',
    price: '$199',
    frequency: '/mo',
    benefits: [
      'Monthly Signature Facial (HydraFacial or Clinical Peel)',
      '10% Off All Skincare Products',
      'Priority Booking & Booking Guarantee'
    ],
    accent: false
  },
  {
    id: 'radiance',
    name: 'RADIANCE',
    price: '$349',
    frequency: '/mo',
    benefits: [
      'Any 2 Basic Treatments per month',
      '15% Off Injectables & Laser Therapies',
      'VIP Event Access & Early Product Drops',
      'Complimentary B12 Injection at every visit'
    ],
    accent: true
  },
  {
    id: 'elite',
    name: 'ELITE',
    price: '$599',
    frequency: '/mo',
    benefits: [
      'Unlimited Advanced Facials & Custom Peels',
      '20% Off All Injectables & Dermal Fillers',
      'Quarterly Luxury Chemical Peel',
      'Personal Concierge Care & Unlimited Consultations'
    ],
    accent: false
  }
];

// Before & After Gallery Images mapped by Category
// All categories use the real uploaded before/after photos
const BEFORE_SRC = '/ba-before.jpg';
const AFTER_SRC  = '/ba-after.jpg';

const RESULT_GALLERY: Record<string, {
  beforeSrc: string;
  afterSrc: string;
  label: string;
}> = {
  All:     { beforeSrc: BEFORE_SRC, afterSrc: AFTER_SRC, label: 'IPL Skin Rejuvenation (Full Face)' },
  Skin:    { beforeSrc: BEFORE_SRC, afterSrc: AFTER_SRC, label: 'Laser Resurfacing & Pigment Correction' },
  Lips:    { beforeSrc: BEFORE_SRC, afterSrc: AFTER_SRC, label: 'Lip Filler & Hydration Treatment' },
  Jawline: { beforeSrc: BEFORE_SRC, afterSrc: AFTER_SRC, label: 'Jawline Definition & Contouring' },
  Acne:    { beforeSrc: BEFORE_SRC, afterSrc: AFTER_SRC, label: 'Acne Therapy & Skin Clarifying' },
  Laser:   { beforeSrc: BEFORE_SRC, afterSrc: AFTER_SRC, label: 'Laser Skin Tightening & Glow' },
  Body:    { beforeSrc: BEFORE_SRC, afterSrc: AFTER_SRC, label: 'Body Contouring & Skin Firming' },
};

export default function Home() {
  // Mobile Navigation state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll header styling state
  const [isScrolled, setIsScrolled] = useState(false);

  // Before / After Comparison Slider state
  const [sliderPercentage, setSliderPercentage] = useState(50);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const [isSliderDragging, setIsSliderDragging] = useState(false);

  // Selected treatment detail modal state
  const [selectedTreatment, setSelectedTreatment] = useState<typeof TREATMENTS[0] | null>(null);

  // Selected membership plan modal state
  const [selectedPlan, setSelectedPlan] = useState<typeof MEMBERSHIPS[0] | null>(null);

  // Local state for Client Reservations Dashboard
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aura_essence_appointments');
      if (saved) {
        try {
          setAppointments(JSON.parse(saved));
        } catch (e) {
          console.error('Error loading appointments', e);
        }
      }
    }
  }, []);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeResultFilter, setActiveResultFilter] = useState('All');
  const currentResult = RESULT_GALLERY[activeResultFilter] || RESULT_GALLERY.All;

  // Visual Form and Scheduler States
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formTreatment, setFormTreatment] = useState('Neuromodulators');
  const [formMessage, setFormMessage] = useState('');
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00 AM');

  // Sync scroll positioning to style navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Before & After image slider move
  const updateSliderPercentage = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));
    setSliderPercentage(percentage);
  };

  const handleSliderStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsSliderDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    updateSliderPercentage(clientX);
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isSliderDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      updateSliderPercentage(clientX);
    };

    const handleEnd = () => {
      setIsSliderDragging(false);
    };

    if (isSliderDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isSliderDragging]);

  // Toast notifier helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Pre-fill generated dates for scheduling
  // Generates next 5 days excluding Sunday if needed, starting tomorrow
  const getSimulatedDates = () => {
    const dates = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 1; i <= 5; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push({
        dayName: weekdays[d.getDay()],
        dayNum: d.getDate(),
        month: months[d.getMonth()],
        fullString: `${weekdays[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`
      });
    }
    return dates;
  };
  const simulatedDates = getSimulatedDates();

  const timeSlots = ['09:30 AM', '11:00 AM', '01:30 PM', '03:00 PM', '04:30 PM'];

  // Handle Request Appointment Submission
  const handleRequestAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) {
      triggerToast('Please provide your name and email address.');
      return;
    }

    const newAppointment: Appointment = {
      id: Math.random().toString(36).substring(2, 9),
      name: formName,
      email: formEmail,
      treatment: formTreatment,
      date: simulatedDates[selectedDateIndex].fullString,
      time: selectedTimeSlot,
      notes: formMessage,
      status: 'Pending Review',
      createdAt: new Date().toLocaleDateString()
    };

    const updated = [newAppointment, ...appointments];
    setAppointments(updated);
    localStorage.setItem('aura_essence_appointments', JSON.stringify(updated));

    // Clear fields
    setFormName('');
    setFormEmail('');
    setFormMessage('');
    
    triggerToast('Appointment requested successfully! Review it in your console.');
    setIsDashboardOpen(true); // Open the dashboard to see the request
  };

  // Cancel Appointment
  const handleCancelAppointment = (id: string) => {
    const updated = appointments.filter(app => app.id !== id);
    setAppointments(updated);
    localStorage.setItem('aura_essence_appointments', JSON.stringify(updated));
    triggerToast('Your appointment request was cancelled.');
  };

  // Trigger booking from card selection
  const handleBookingShortcut = (treatmentTitle: string) => {
    setFormTreatment(treatmentTitle);
    setSelectedTreatment(null);
    setSelectedPlan(null);
    
    // Smooth scroll down to contact section
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fff8f4] text-[#1d1b19] font-sans antialiased overflow-x-hidden">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#6c5842] text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 border border-white/10 max-w-md w-[90%] font-medium"
            id="toast-alert"
          >
            <CheckCircle className="w-5 h-5 text-[#fed488] shrink-0" />
            <p className="text-sm tracking-wide leading-relaxed">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Appointment Console Shortcut */}
      {mounted && appointments.length > 0 && (
        <button 
          onClick={() => setIsDashboardOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#6c5842] text-white rounded-full p-4 shadow-2xl border border-white/10 hover:bg-[#867159] transition-all flex items-center gap-2 group hover:scale-105 active:scale-95"
          id="appointments-shortcut-btn"
        >
          <Calendar className="w-5 h-5 text-[#fed488]" />
          <span className="text-xs tracking-wider uppercase font-semibold pr-1">My Bookings ({appointments.length})</span>
        </button>
      )}

      {/* Header / Navigation Shell */}
      <header 
        className={`fixed top-0 w-full z-40 transition-all duration-300 ${
          isScrolled 
            ? 'py-4 bg-[#efeae2]/95 backdrop-blur-md border-b border-[#d1c4ba]/30 shadow-sm' 
            : 'py-6 bg-transparent'
        }`} 
        id="top-nav"
      >
        <div className="flex justify-between items-center w-full px-6 md:px-16 max-w-7xl mx-auto">
          {/* Logo & Brand Name */}
          <a href="#" className="flex items-center gap-3.5 group">
              <div className="w-9 h-9 rounded-full bg-[#775a19]/10 flex items-center justify-center border border-[#775a19]/20 shrink-0">
                <Sparkles className="w-5 h-5 text-[#775a19]" />
              </div>
            <div className="flex flex-col">
              <span className="font-display text-base md:text-lg tracking-[0.2em] text-[#35251a] uppercase font-medium leading-none">
                AURA & ESSENCE
              </span>
              <span className="font-sans text-[8px] md:text-[9px] tracking-[0.35em] text-[#7f6f60] uppercase font-semibold mt-1">
                MEDICAL AESTHETICS
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex gap-8 items-center">
            <a href="#treatments" className="font-sans text-xs tracking-widest text-[#4e453d]/80 hover:text-[#6c5842] uppercase font-semibold transition-colors duration-300">
              Treatments
            </a>
            <a href="#about" className="font-sans text-xs tracking-widest text-[#4e453d]/80 hover:text-[#6c5842] uppercase font-semibold transition-colors duration-300">
              About
            </a>
            <a href="#process" className="font-sans text-xs tracking-widest text-[#4e453d]/80 hover:text-[#6c5842] uppercase font-semibold transition-colors duration-300">
              Process
            </a>
            <a href="#pricing" className="font-sans text-xs tracking-widest text-[#4e453d]/80 hover:text-[#6c5842] uppercase font-semibold transition-colors duration-300">
              Pricing
            </a>
            <button 
              onClick={() => setIsDashboardOpen(true)}
              className="font-sans text-xs tracking-widest text-[#4e453d]/80 hover:text-[#6c5842] uppercase font-semibold transition-colors duration-300"
            >
              Console
            </button>
            <a 
              href="#contact" 
              className="px-6 py-2.5 bg-[#6c5842] text-white rounded-full font-sans text-xs tracking-widest uppercase font-semibold hover:bg-[#867159] transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
            >
              Book Now
            </a>
          </nav>

          {/* Burger menu for Mobile */}
          <div className="flex items-center gap-4 md:hidden">
            {appointments.length > 0 && (
              <button 
                onClick={() => setIsDashboardOpen(true)}
                className="relative bg-[#6c5842] text-white p-2 rounded-full shadow-md"
                id="bookings-indicator-mobile"
              >
                <Calendar className="w-4 h-4 text-[#fed488]" />
                <span className="absolute -top-1 -right-1 bg-[#775a19] text-white rounded-full text-[9px] w-4 h-4 flex items-center justify-center font-bold">
                  {appointments.length}
                </span>
              </button>
            )}
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="text-[#6c5842] p-1"
              id="mobile-menu-open-btn"
            >
              <Menu className="w-7 h-7" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Panel Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#1d1b19] z-50"
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-4/5 max-w-xs bg-[#fff8f4] z-50 p-8 flex flex-col justify-between border-l border-[#d1c4ba]/40 shadow-2xl"
              id="mobile-menu-drawer"
            >
              <div>
                <div className="flex justify-between items-center mb-10">
                  <span className="font-display tracking-[0.1em] text-[#6c5842] uppercase text-sm font-semibold">Aura & Essence</span>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#6c5842] p-1"
                    id="mobile-menu-close-btn"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <nav className="flex flex-col gap-6">
                  <a 
                    href="#treatments" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="font-sans text-sm tracking-widest text-[#4e453d] uppercase font-bold border-b border-[#d1c4ba]/10 pb-2"
                  >
                    Treatments
                  </a>
                  <a 
                    href="#about" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="font-sans text-sm tracking-widest text-[#4e453d] uppercase font-bold border-b border-[#d1c4ba]/10 pb-2"
                  >
                    About
                  </a>
                  <a 
                    href="#process" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="font-sans text-sm tracking-widest text-[#4e453d] uppercase font-bold border-b border-[#d1c4ba]/10 pb-2"
                  >
                    Process
                  </a>
                  <a 
                    href="#pricing" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="font-sans text-sm tracking-widest text-[#4e453d] uppercase font-bold border-b border-[#d1c4ba]/10 pb-2"
                  >
                    Pricing
                  </a>
                  <button 
                    onClick={() => { setMobileMenuOpen(false); setIsDashboardOpen(true); }} 
                    className="font-sans text-sm text-left tracking-widest text-[#4e453d] uppercase font-bold border-b border-[#d1c4ba]/10 pb-2 flex items-center justify-between"
                  >
                    <span>My Bookings ({appointments.length})</span>
                    <Calendar className="w-4 h-4 text-[#775a19]" />
                  </button>
                </nav>
              </div>

              <a 
                href="#contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-4 bg-[#6c5842] text-white rounded-full font-sans text-xs tracking-widest uppercase font-semibold hover:bg-[#867159] transition-all shadow-md mt-auto"
              >
                Book Consultation
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-[#efeae2]" id="hero-section">
        <div className="max-w-7xl mx-auto px-5 md:px-16 grid md:grid-cols-12 gap-8 md:gap-16 items-center relative z-10">
          
          {/* Hero text */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="md:col-span-6 flex flex-col items-start text-left"
          >
            <h1 className="font-display text-[2.6rem] sm:text-5xl md:text-6xl lg:text-[4.75rem] text-[#35251a] mb-5 leading-[1.05] font-light">
              Reveal Your <br/>
              Natural <br/>
              <span className="italic font-normal">Confidence</span>
            </h1>

            {/* Elegant Divider */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-[1.5px] w-16 bg-[#bda17a]" />
              <span className="text-[#bda17a] text-xs">✦</span>
            </div>

            <p className="font-sans text-sm md:text-base text-[#5c4e43] mb-8 max-w-md leading-relaxed tracking-wide">
              Expertly tailored treatments that harmonize clinical precision with artistic vision—helping you look and feel authentically, beautifully you.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-10">
              <a 
                href="#contact" 
                className="px-7 py-3.5 bg-[#35251a] text-[#fff8f4] rounded-full font-sans text-xs tracking-widest uppercase font-semibold hover:bg-[#4d3a2d] transition-all text-center shadow-md hover:shadow-lg active:scale-95"
              >
                Book Consultation
              </a>
              <a 
                href="#treatments" 
                className="px-7 py-3.5 border border-[#35251a]/30 text-[#35251a] rounded-full font-sans text-xs tracking-widest uppercase font-semibold hover:bg-[#35251a]/5 transition-all text-center"
              >
                View Treatments
              </a>
            </div>

            {/* Integrated Feature Strip at bottom-left */}
            <div className="hidden lg:grid grid-cols-4 gap-4 pt-10 border-t border-[#35251a]/10 w-full">
              <div className="flex flex-col items-start gap-2">
                <Shield className="w-5 h-5 text-[#bda17a]" />
                <span className="font-sans text-[10px] tracking-widest text-[#35251a] font-bold uppercase leading-none">FDA Approved</span>
                <span className="font-sans text-[11px] text-[#5c4e43]/85 leading-tight">Safe, tested & effective</span>
              </div>
              <div className="flex flex-col items-start gap-2 border-l border-[#35251a]/10 pl-5">
                <Award className="w-5 h-5 text-[#bda17a]" />
                <span className="font-sans text-[10px] tracking-widest text-[#35251a] font-bold uppercase leading-none">Expert Care</span>
                <span className="font-sans text-[11px] text-[#5c4e43]/85 leading-tight">Certified specialists</span>
              </div>
              <div className="flex flex-col items-start gap-2 border-l border-[#35251a]/10 pl-5">
                <Heart className="w-5 h-5 text-[#bda17a]" />
                <span className="font-sans text-[10px] tracking-widest text-[#35251a] font-bold uppercase leading-none">Premium Products</span>
                <span className="font-sans text-[11px] text-[#5c4e43]/85 leading-tight">Top-tier quality</span>
              </div>
              <div className="flex flex-col items-start gap-2 border-l border-[#35251a]/10 pl-5">
                <Star className="w-5 h-5 text-[#bda17a]" />
                <span className="font-sans text-[10px] tracking-widest text-[#35251a] font-bold uppercase leading-none">Natural Results</span>
                <span className="font-sans text-[11px] text-[#5c4e43]/85 leading-tight">Enhance beauty</span>
              </div>
            </div>
          </motion.div>

          {/* Hero image and overlay items */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:col-span-6 relative mt-4 md:mt-0 max-w-[340px] sm:max-w-md mx-auto md:max-w-none w-full flex items-center justify-center"
          >
            {/* Clean portrait frame */}
            <div className="relative w-full aspect-[4/5] md:aspect-[4/5] max-w-[480px] overflow-hidden rounded-2xl shadow-xl bg-[#e8e0d8]">
              <Image 
                alt="Radiant face aesthetic woman" 
                className="object-cover object-top" 
                src="/hero-woman.jpg"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 480px"
              />
            </div>

            {/* Floating Next Opening Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="hidden sm:flex absolute right-0 top-[30%] md:-right-6 bg-[#fffbf8]/90 backdrop-blur-md p-3.5 md:p-5 rounded-2xl shadow-xl border border-[#35251a]/10 max-w-[160px] md:max-w-[200px] flex-col gap-2 z-30"
            >
              <div className="flex gap-3 items-start">
                <div className="bg-[#bda17a]/15 w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border border-[#bda17a]/20">
                  <Calendar className="w-5 h-5 text-[#bda17a]" />
                </div>
                <div>
                  <span className="font-sans text-[9px] tracking-widest font-bold text-[#7f6f60] uppercase block">Next Opening</span>
                  <p className="font-display text-xs md:text-sm text-[#35251a] mt-0.5 font-semibold leading-tight">Tomorrow, 10:30 AM</p>
                  <a href="#contact" className="font-sans text-[9px] tracking-widest text-[#35251a] font-bold mt-2 hover:underline flex items-center gap-1 group uppercase block">
                    <span>Book Now</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Floating Google Review Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="hidden sm:flex absolute right-0 bottom-4 md:-right-8 bg-[#fffbf8] p-2.5 md:p-4 rounded-xl md:rounded-2xl shadow-lg border border-[#35251a]/5 items-center gap-2 md:gap-4 z-30"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.514 5.514 0 0 1 8.5 13a5.514 5.514 0 0 1 5.491-5.514c1.47 0 2.808.57 3.81 1.493l3.076-3.076A9.927 9.927 0 0 0 13.991 3C8.473 3 4 7.473 4 13s4.473 10 9.991 10c5.772 0 10.244-4.664 10.244-10.244a9.124 9.124 0 0 0-.235-2.471H12.24Z" />
              </svg>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-[#dca060] fill-[#dca060]" />
                    ))}
                  </div>
                  <span className="font-sans text-[11px] font-bold text-[#35251a]">4.9/5</span>
                </div>
                <span className="font-sans text-[9px] text-[#7f6f60] mt-0.5 uppercase tracking-wider font-semibold">From 500+ Reviews</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Integrated Feature Strip for Mobile view (shown under content) */}
          <div className="grid grid-cols-2 gap-6 pt-8 border-t border-[#35251a]/10 w-full md:hidden">
            <div className="flex flex-col items-start gap-1.5">
              <Shield className="w-5 h-5 text-[#bda17a]" />
              <span className="font-sans text-[10px] tracking-widest text-[#35251a] font-bold uppercase">FDA Approved</span>
              <span className="font-sans text-[11px] text-[#5c4e43]/80">Safe, tested & effective</span>
            </div>
            <div className="flex flex-col items-start gap-1.5 border-l border-[#35251a]/10 pl-5">
              <Award className="w-5 h-5 text-[#bda17a]" />
              <span className="font-sans text-[10px] tracking-widest text-[#35251a] font-bold uppercase">Expert Care</span>
              <span className="font-sans text-[11px] text-[#5c4e43]/80">Certified specialists</span>
            </div>
          </div>

        </div>
      </section>

      {/* Spacing spacer replacing redundant Feature Strip */}
      <div className="h-4 bg-[#efeae2] border-b border-[#35251a]/5" />

      {/* About Section */}
      <section className="py-16 md:py-24 overflow-hidden" id="about">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="grid md:grid-cols-2 gap-10 md:gap-24 items-center">
            
            {/* Left: Interactive/Overlap Image Group */}
            <div className="relative order-2 md:order-1 pb-6 md:pb-0">
              <div className="aspect-[1.2/1] rounded-2xl overflow-hidden shadow-lg relative border border-[#d1c4ba]/20">
                <Image 
                  alt="Aura & Essence Med Spa Luxury Interior" 
                  className="object-cover hover:scale-105 transition-transform duration-700" 
                  src="/spa-room.jpg"
                  fill
                />
              </div>
              <div className="hidden md:block absolute -bottom-6 -right-6 w-2/3 aspect-square bg-[#f3ede9] border border-[#d1c4ba]/30 rounded-2xl -z-10 shadow-sm" />
            </div>

            {/* Right: Text with numbers list */}
            <div className="order-1 md:order-2 flex flex-col items-start">
              <span className="font-sans text-xs tracking-[0.25em] text-[#775a19] uppercase font-bold mb-3">Our Philosophy</span>
              <h2 className="font-display text-3xl md:text-4xl text-[#6c5842] mb-6 font-light leading-tight">
                Artistry Meets Medicine
              </h2>
              <p className="font-sans text-sm md:text-base text-[#4e453d] mb-8 leading-relaxed">
                Founded by Dr. Elena Vance, Aura & Essence was born from a desire to bridge the gap between clinical dermatology and the luxury spa experience. We believe that true rejuvenation is an art form that respects your unique facial architecture.
              </p>
              
              <div className="space-y-6 w-full">
                <div className="flex gap-4 border-b border-[#d1c4ba]/30 pb-5">
                  <span className="font-display text-2xl text-[#6c5842] font-light shrink-0">01.</span>
                  <div>
                    <h5 className="font-sans text-xs tracking-wider text-[#6c5842] font-bold uppercase mb-1">Unhurried Consultations</h5>
                    <p className="font-sans text-xs md:text-sm text-[#4e453d]/80 leading-relaxed">We listen first, analyzing your goals and skin health comprehensively in a quiet, dedicated diagnostic space.</p>
                  </div>
                </div>
                <div className="flex gap-4 border-b border-[#d1c4ba]/30 pb-5">
                  <span className="font-display text-2xl text-[#6c5842] font-light shrink-0">02.</span>
                  <div>
                    <h5 className="font-sans text-xs tracking-wider text-[#6c5842] font-bold uppercase mb-1">Bespoke Protocols</h5>
                    <p className="font-sans text-xs md:text-sm text-[#4e453d]/80 leading-relaxed">Every face is different. Your tailored treatment plan incorporates multiple modalities for safe, cumulative results.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Treatments Cards Grid */}
      <section className="py-16 md:py-24 bg-white border-y border-[#d1c4ba]/30" id="treatments">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="font-sans text-xs tracking-[0.25em] text-[#775a19] uppercase font-bold mb-3 block">Curated Services</span>
            <h2 className="font-display text-3xl md:text-4xl text-[#6c5842] font-light">
              Elevate Your Essence
            </h2>
            <p className="font-sans text-xs md:text-sm text-[#4e453d]/80 mt-3">Click on any card to view detailed clinical breakdowns, recoveries, benefits, and FAQ answers.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {TREATMENTS.map((treatment, i) => {
              const IconComp = treatment.icon;
              return (
                <motion.div 
                  key={treatment.id}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  onClick={() => setSelectedTreatment(treatment)}
                  className="group bg-[#fff8f4] p-6 md:p-8 rounded-xl border border-[#d1c4ba]/30 hover-lift flex flex-col justify-between cursor-pointer"
                  id={`treatment-card-${treatment.id}`}
                >
                  <div>
                    <div className="w-14 h-14 bg-[#f3ede9] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#fadec1] transition-colors duration-500 shrink-0">
                      <IconComp className="w-6 h-6 text-[#6c5842]" />
                    </div>
                    <h3 className="font-display text-xl text-[#6c5842] mb-3 group-hover:text-[#775a19] transition-colors">
                      {treatment.title}
                    </h3>
                    <p className="font-sans text-xs md:text-sm text-[#4e453d] mb-8 leading-relaxed">
                      {treatment.shortDesc}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center border-t border-[#d1c4ba]/20 pt-4 mt-auto">
                    <span className="font-sans text-[10px] tracking-widest text-[#4e453d]/60 uppercase font-semibold">Starting at</span>
                    <span className="font-sans text-sm text-[#6c5842] font-bold uppercase">{treatment.price}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-24" id="process">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="text-center max-w-xl mx-auto mb-20">
            <span className="font-sans text-xs tracking-[0.25em] text-[#775a19] uppercase font-bold mb-3 block">The Experience</span>
            <h2 className="font-display text-3xl md:text-4xl text-[#6c5842] font-light">
              Your Journey To Radiance
            </h2>
          </div>

          <div className="relative">
            {/* Horizontal Line connector */}
            <div className="hidden md:block absolute top-8 left-12 right-12 h-[1px] bg-[#d1c4ba]/40 -z-10" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
              
              <div className="flex flex-col items-center group">
                <div className="w-16 h-16 bg-white border border-[#d1c4ba] rounded-full flex items-center justify-center mb-6 group-hover:border-[#6c5842] transition-colors duration-300 shadow-sm shrink-0 font-display text-lg text-[#6c5842] font-light">
                  01
                </div>
                <h4 className="font-display text-lg text-[#6c5842] mb-2 font-medium">Consultation</h4>
                <p className="font-sans text-xs md:text-sm text-[#4e453d]/80 leading-relaxed">
                  Deep clinical analysis of your biological skin goals and full medical history.
                </p>
              </div>

              <div className="flex flex-col items-center group">
                <div className="w-16 h-16 bg-white border border-[#d1c4ba] rounded-full flex items-center justify-center mb-6 group-hover:border-[#6c5842] transition-colors duration-300 shadow-sm shrink-0 font-display text-lg text-[#6c5842] font-light">
                  02
                </div>
                <h4 className="font-display text-lg text-[#6c5842] mb-2 font-medium">Analysis</h4>
                <p className="font-sans text-xs md:text-sm text-[#4e453d]/80 leading-relaxed">
                  Advanced skin diagnostics to map your facial muscle tone and structural architecture.
                </p>
              </div>

              <div className="flex flex-col items-center group">
                <div className="w-16 h-16 bg-white border border-[#d1c4ba] rounded-full flex items-center justify-center mb-6 group-hover:border-[#6c5842] transition-colors duration-300 shadow-sm shrink-0 font-display text-lg text-[#6c5842] font-light">
                  03
                </div>
                <h4 className="font-display text-lg text-[#6c5842] mb-2 font-medium">Plan</h4>
                <p className="font-sans text-xs md:text-sm text-[#4e453d]/80 leading-relaxed">
                  A customized, multi-step treatment roadmap precisely budgeted and scheduled.
                </p>
              </div>

              <div className="flex flex-col items-center group">
                <div className="w-16 h-16 bg-[#6c5842] rounded-full flex items-center justify-center mb-6 shadow-md shrink-0">
                  <Sparkles className="w-6 h-6 text-[#fed488]" />
                </div>
                <h4 className="font-display text-lg text-[#6c5842] mb-2 font-medium">Glow</h4>
                <p className="font-sans text-xs md:text-sm text-[#4e453d]/80 leading-relaxed">
                  Experience transformation in luxury, cocooned with specialized serene aftercare.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Before & After Section — Side-by-Side Static */}
      <section className="py-14 md:py-20 bg-[#f7f2ee] relative" id="before-after">
        <div className="max-w-7xl mx-auto px-5 md:px-16">

          {/* Main layout grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-x-16 lg:gap-y-10 items-start">

            {/* ① Text — mobile: 1st | desktop: col 1-5 row 1 */}
            <div className="w-full lg:col-start-1 lg:col-span-5 lg:row-start-1 flex flex-col items-start text-left">
              {/* Tag */}
              <span className="font-sans text-[10px] tracking-[0.25em] text-[#775a19] uppercase font-bold mb-3">Real Results. Real Confidence.</span>
              <div className="h-[1.5px] w-10 bg-[#bda17a] mb-6" />

              <h2 className="font-display text-3xl sm:text-4xl md:text-[3.5rem] text-[#35251a] mb-4 md:mb-5 leading-[1.1] font-light">
                The Art of <br/><span className="italic">Transformation</span>
              </h2>

              <p className="font-sans text-sm text-[#5c4e43] leading-relaxed mb-6 max-w-sm">
                Subtle enhancements. Stunning results.<br/>See the difference expert care can make.
              </p>

              <button
                onClick={() => handleBookingShortcut('General Consultation')}
                className="flex items-center gap-2 px-6 py-3 border border-[#35251a]/40 text-[#35251a] rounded-full font-sans text-xs tracking-widest uppercase font-semibold hover:bg-[#35251a] hover:text-white transition-all duration-300 mb-2"
                id="before-after-cta-btn"
              >
                Book Your Consultation <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* ② Slider — mobile: 2nd | desktop: col 6-12 spanning rows 1-2 */}
            <div className="w-full lg:col-start-6 lg:col-span-7 lg:row-start-1 lg:row-span-2">
              <div
                ref={sliderContainerRef}
                onMouseDown={handleSliderStart}
                onTouchStart={handleSliderStart}
                className="relative aspect-[4/5] sm:aspect-[4/3] lg:aspect-[3/4] bg-[#e8e0d6] rounded-2xl overflow-hidden shadow-xl select-none cursor-ew-resize"
                id="comparison-slider"
              >
                {/* BEFORE — full background */}
                <div className="absolute inset-0">
                  <Image
                    alt="Before treatment"
                    src={currentResult.beforeSrc}
                    fill
                    sizes="(max-width: 768px) 100vw, 700px"
                    className="object-cover object-center pointer-events-none"
                  />
                  {/* BEFORE label */}
                  <span className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md font-sans text-[9px] tracking-widest uppercase font-bold text-[#35251a] shadow-sm">
                    Before
                  </span>
                </div>

                {/* AFTER — clipped reveal layer */}
                <div
                  className="absolute inset-y-0 left-0 overflow-hidden"
                  style={{ width: `${sliderPercentage}%` }}
                >
                  <div
                    className="absolute inset-y-0 left-0 h-full"
                    style={{ width: `${10000 / Math.max(sliderPercentage, 1)}%` }}
                  >
                    <Image
                      alt="After treatment"
                      src={currentResult.afterSrc}
                      fill
                      sizes="(max-width: 768px) 100vw, 700px"
                      className="object-cover object-center pointer-events-none"
                    />
                  </div>
                  {/* AFTER label */}
                  <span className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md font-sans text-[9px] tracking-widest uppercase font-bold text-[#35251a] shadow-sm">
                    After
                  </span>
                </div>

                {/* Vertical divider line */}
                <div
                  className="absolute inset-y-0 z-20 w-[2px] bg-white/80 shadow-md"
                  style={{ left: `${sliderPercentage}%` }}
                />

                {/* Drag handle — white circle with chevrons */}
                <div
                  className="absolute top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center border border-[#d1c4ba]/40 cursor-ew-resize"
                  style={{ left: `${sliderPercentage}%` }}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#6c5842]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>

              <p className="text-center font-sans text-[11px] text-[#5c4e43]/60 mt-3 tracking-wide">
                Drag the handle to compare before &amp; after results
              </p>
            </div>

            {/* ③ Filters + Card — mobile: 3rd | desktop: col 1-5 row 2 */}
            <div className="w-full lg:col-start-1 lg:col-span-5 lg:row-start-2 flex flex-col items-start text-left">
              {/* Filter Pills — horizontal scroll on mobile */}
              <div className="mb-6 w-full">
                <span className="font-sans text-[9px] tracking-[0.25em] text-[#7f6f60] uppercase font-bold block mb-3">Explore Results</span>
                <div className="flex gap-2 overflow-x-auto pb-2 scroll-smooth no-scrollbar" id="result-filter-pills">
                  {['All', 'Skin', 'Lips', 'Jawline', 'Acne', 'Laser', 'Body'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveResultFilter(filter)}
                      className={`px-4 py-1.5 rounded-full font-sans text-xs font-medium border transition-all shrink-0 ${
                        activeResultFilter === filter
                          ? 'bg-[#35251a] text-white border-[#35251a]'
                          : 'bg-white text-[#4e453d] border-[#d1c4ba]/60 hover:border-[#6c5842]'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Treatment info card */}
              <div className="bg-white rounded-xl p-5 border border-[#d1c4ba]/30 shadow-sm flex gap-4 items-start w-full sm:max-w-md">
                <div className="w-10 h-10 bg-[#f3ede9] rounded-full flex items-center justify-center shrink-0 border border-[#d1c4ba]/30">
                  <Sparkles className="w-5 h-5 text-[#bda17a]" />
                </div>
                <div>
                  <p className="font-sans text-xs text-[#4e453d] leading-relaxed">
                    Every treatment plan is personalized for natural, long-lasting results.
                  </p>
                  <div className="flex items-center gap-1.5 mt-3">
                    <Shield className="w-3 h-3 text-[#bda17a]" />
                    <span className="font-sans text-[9px] tracking-widest text-[#775a19] uppercase font-bold">Safe</span>
                    <span className="text-[#d1c4ba] mx-1">•</span>
                    <span className="font-sans text-[9px] tracking-widest text-[#775a19] uppercase font-bold">Effective</span>
                    <span className="text-[#d1c4ba] mx-1">•</span>
                    <span className="font-sans text-[9px] tracking-widest text-[#775a19] uppercase font-bold">Natural</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom 5-column Feature Strip */}
          <div className="mt-10 md:mt-16 pt-8 md:pt-10 border-t border-[#d1c4ba]/40 grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
            {[
              { icon: Award, title: 'Expert Care', desc: 'Board-certified specialists with years of experience.' },
              { icon: Sparkles, title: 'Advanced Technology', desc: 'State-of-the-art equipment for optimal results.' },
              { icon: Heart, title: 'Personalized Treatments', desc: 'Tailored plans designed for your unique goals.' },
              { icon: Shield, title: 'Safety First', desc: 'Highest standards of safety and proven protocols.' },
              { icon: Star, title: 'Natural Results', desc: 'Enhancing your beauty while keeping it natural.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Icon className="w-5 h-5 text-[#bda17a]" />
                <span className="font-sans text-[9px] tracking-widest text-[#35251a] font-bold uppercase">{title}</span>
                <p className="font-sans text-[11px] text-[#5c4e43]/80 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Pricing Section - Curated Tiers */}
      <section className="py-16 md:py-24 bg-[#f9f2ef]" id="pricing">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="font-sans text-xs tracking-[0.25em] text-[#775a19] uppercase font-bold mb-3 block">Membership Plans</span>
            <h2 className="font-display text-3xl md:text-4xl text-[#6c5842] font-light">
              Curated Wellness Tiers
            </h2>
            <p className="font-sans text-xs md:text-sm text-[#4e453d]/80 mt-2">Invest in steady, compound skin refinement with flexible monthly tiers.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 items-stretch pt-6">
            {MEMBERSHIPS.map((plan) => (
              <motion.div 
                key={plan.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className={`p-7 md:p-10 rounded-2xl border flex flex-col justify-between relative transition-all duration-300 ${
                  plan.accent 
                    ? 'bg-[#6c5842] text-white border-[#6c5842] shadow-2xl sm:mt-6 md:mt-0 md:-translate-y-4' 
                    : 'bg-white text-[#1d1b19] border-[#d1c4ba]/30 shadow-md'
                }`}
                id={`membership-tier-${plan.id}`}
              >
                {/* Most Preferred Ribbon */}
                {plan.accent && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#775a19] text-white px-4 py-1 rounded-full text-[9px] font-sans tracking-[0.15em] uppercase font-bold shadow-md">
                    Most Preferred
                  </div>
                )}

                <div>
                  <h4 className={`font-sans text-xs tracking-widest font-bold uppercase mb-2 ${
                    plan.accent ? 'text-[#fed488]' : 'text-[#775a19]'
                  }`}>
                    {plan.name}
                  </h4>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="font-display text-4xl md:text-5xl font-light">{plan.price}</span>
                    <span className={`font-sans text-xs ${plan.accent ? 'text-white/70' : 'text-[#4e453d]/75'}`}>
                      {plan.frequency}
                    </span>
                  </div>

                  <ul className="space-y-4 mb-10 border-t border-[#d1c4ba]/20 pt-6">
                    {plan.benefits.map((benefit, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-3">
                        <Check className={`w-4 h-4 mt-0.5 shrink-0 ${
                          plan.accent ? 'text-[#fed488]' : 'text-[#775a19]'
                        }`} />
                        <span className={`font-sans text-xs md:text-sm leading-relaxed ${
                          plan.accent ? 'text-white/90' : 'text-[#4e453d]/90'
                        }`}>
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button 
                  onClick={() => setSelectedPlan(plan)}
                  className={`w-full py-3 rounded-full font-sans text-xs tracking-widest uppercase font-bold transition-all shadow-sm active:scale-95 ${
                    plan.accent 
                      ? 'bg-white text-[#6c5842] hover:bg-[#fff8f4]' 
                      : 'border border-[#7f756c] text-[#6c5842] hover:bg-[#fff8f4]'
                  }`}
                  id={`select-plan-${plan.id}`}
                >
                  Select Plan
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form and Studio Details */}
      <section className="py-16 md:py-24 relative overflow-hidden" id="contact">
        
        {/* Background skew card */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#f9f2ef] -skew-x-12 translate-x-1/2 -z-10 hidden md:block" />

        <div className="max-w-7xl mx-auto px-5 md:px-16 grid md:grid-cols-2 gap-10 md:gap-24 items-start">
          
          {/* Left Column: Contact details */}
          <div className="flex flex-col text-left">
            <h2 className="font-display text-3xl md:text-4xl text-[#6c5842] mb-5 font-light leading-tight">
              Begin Your <br/>Transformation
            </h2>
            <p className="font-sans text-sm md:text-base text-[#4e453d] mb-12 max-w-sm leading-relaxed">
              Connect with our clinical consultants to discover the perfect protocol for your unique skin journey. We look forward to welcoming you into our unhurried space.
            </p>

            <div className="space-y-8">
              
              <div className="flex items-start gap-5">
                <div className="bg-[#f3ede9] p-3 rounded-full text-[#6c5842] border border-[#d1c4ba]/30 shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-sans text-xs tracking-wider text-[#6c5842] font-bold uppercase mb-1">Our Studio</h5>
                  <p className="font-sans text-xs md:text-sm text-[#4e453d]/80 leading-relaxed">
                    1245 Fifth Avenue, Suite 300<br/>New York, NY 10029
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="bg-[#f3ede9] p-3 rounded-full text-[#6c5842] border border-[#d1c4ba]/30 shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-sans text-xs tracking-wider text-[#6c5842] font-bold uppercase mb-1">Studio Hours</h5>
                  <p className="font-sans text-xs md:text-sm text-[#4e453d]/80 leading-relaxed">
                    Mon — Fri: 9am to 7pm<br/>Sat: 10am to 4pm
                  </p>
                </div>
              </div>

              {/* Dynamic notification detail */}
              <div className="p-5 rounded-xl bg-white border border-[#d1c4ba]/30 shadow-sm max-w-md flex gap-4 items-start">
                <Award className="w-5 h-5 text-[#775a19] shrink-0 mt-0.5" />
                <div>
                  <p className="font-sans text-xs text-[#6c5842] font-bold uppercase tracking-wider mb-1">Safe Harbor Protocol</p>
                  <p className="font-sans text-[11px] text-[#4e453d]/80 leading-relaxed">
                    All treatments are supervised directly by Board-Certified practitioners with pristine hygiene standards.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Complete Interactive Booking Scheduler */}
          <div className="w-full">
            <div className="bg-white p-5 sm:p-8 md:p-10 rounded-2xl border border-[#d1c4ba]/40 shadow-xl relative" id="booking-container-card">
              
              <div className="mb-8 border-b border-[#d1c4ba]/20 pb-4">
                <p className="font-sans text-[10px] tracking-widest text-[#775a19] uppercase font-bold mb-1">Instant Consult Scheduler</p>
                <h3 className="font-display text-xl text-[#6c5842] font-light">Request Appointment</h3>
              </div>

              <form onSubmit={handleRequestAppointment} className="space-y-6">
                
                {/* Visual Scheduler - Step 1: Pick a Date */}
                <div className="space-y-2.5">
                  <label className="font-sans text-[10px] tracking-wider text-[#6c5842] uppercase font-bold block">
                    1. Select Date
                  </label>
                  <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth" id="date-picker-grid">
                    {simulatedDates.map((date, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedDateIndex(idx)}
                        className={`py-2 px-3 rounded-xl border flex flex-col items-center justify-center shrink-0 min-w-[64px] transition-all ${
                          selectedDateIndex === idx
                            ? 'bg-[#6c5842] text-white border-[#6c5842] shadow-sm'
                            : 'bg-[#fff8f4] hover:bg-[#f3ede9] border-[#d1c4ba]/40 text-[#4e453d]'
                        }`}
                        id={`date-slot-${idx}`}
                      >
                        <span className="text-[9px] uppercase tracking-wider font-medium opacity-80">{date.dayName}</span>
                        <span className="text-sm font-bold mt-0.5">{date.dayNum}</span>
                        <span className="text-[9px] font-semibold">{date.month}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visual Scheduler - Step 2: Pick Time */}
                <div className="space-y-2.5">
                  <label className="font-sans text-[10px] tracking-wider text-[#6c5842] uppercase font-bold block">
                    2. Select Preferred Time
                  </label>
                  <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth" id="time-picker-row">
                    {timeSlots.map((time, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedTimeSlot(time)}
                        className={`px-4 py-2 text-xs rounded-full border shrink-0 font-medium transition-all ${
                          selectedTimeSlot === time
                            ? 'bg-[#775a19] text-white border-[#775a19] shadow-sm'
                            : 'bg-white hover:bg-[#f3ede9] border-[#d1c4ba]/40 text-[#4e453d]'
                        }`}
                        id={`time-slot-${idx}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Personal Info inputs */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-sans text-[10px] tracking-wider text-[#6c5842] uppercase font-bold">Your Name</label>
                    <input 
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-transparent border-0 border-b border-[#d1c4ba] focus:ring-0 focus:border-[#6c5842] px-0 py-2 text-sm placeholder:text-[#4e453d]/30 text-[#1d1b19]"
                      placeholder="Jane Doe" 
                      type="text"
                      id="input-name"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-sans text-[10px] tracking-wider text-[#6c5842] uppercase font-bold">Email Address</label>
                    <input 
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full bg-transparent border-0 border-b border-[#d1c4ba] focus:ring-0 focus:border-[#6c5842] px-0 py-2 text-sm placeholder:text-[#4e453d]/30 text-[#1d1b19]"
                      placeholder="jane@example.com" 
                      type="email"
                      id="input-email"
                    />
                  </div>
                </div>

                {/* Dropdown Select Service */}
                <div className="space-y-1">
                  <label className="font-sans text-[10px] tracking-wider text-[#6c5842] uppercase font-bold">Interested Treatment</label>
                  <select 
                    value={formTreatment}
                    onChange={(e) => setFormTreatment(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-[#d1c4ba] focus:ring-0 focus:border-[#6c5842] px-0 py-2.5 text-sm text-[#4e453d] font-medium"
                    id="select-treatment"
                  >
                    <option value="Neuromodulators">Neuromodulators</option>
                    <option value="Dermal Fillers">Dermal Fillers</option>
                    <option value="HydraFacial">HydraFacial</option>
                    <option value="General Consultation">General Consultation</option>
                  </select>
                </div>

                {/* Optional Message */}
                <div className="space-y-1">
                  <label className="font-sans text-[10px] tracking-wider text-[#6c5842] uppercase font-bold">Message (Optional)</label>
                  <textarea 
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-[#d1c4ba] focus:ring-0 focus:border-[#6c5842] px-0 py-2 text-sm placeholder:text-[#4e453d]/30 text-[#1d1b19]"
                    placeholder="Tell us about your aesthetic goals..." 
                    rows={2}
                    id="input-message"
                  />
                </div>

                {/* Submit */}
                <button 
                  type="submit"
                  className="w-full py-4 bg-[#6c5842] text-white rounded-full font-sans text-xs tracking-widest uppercase font-bold hover:bg-[#867159] transition-all shadow-md active:scale-95"
                  id="submit-appointment-btn"
                >
                  Request Appointment
                </button>

              </form>

              {/* Secure statement */}
              <div className="flex items-center justify-center gap-1.5 mt-5 text-[10px] text-[#4e453d]/60">
                <Lock className="w-3.5 h-3.5" />
                <span>SSL Encrypted Clinic Communication</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f9f2ef] border-t border-[#d1c4ba]/30 w-full pt-12 md:pt-16 pb-10 md:pb-12">
        <div className="max-w-7xl mx-auto px-5 md:px-16 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          
          {/* Col 1: Brand details */}
          <div className="flex flex-col items-start text-left gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#775a19]/10 flex items-center justify-center border border-[#775a19]/20 shrink-0">
                <Sparkles className="w-4 h-4 text-[#775a19]" />
              </div>
              <span className="font-display tracking-[0.15em] text-[#6c5842] uppercase text-sm font-semibold">AURA & ESSENCE</span>
            </div>
            <p className="font-sans text-xs md:text-sm text-[#4e453d]/80 leading-relaxed max-w-xs">
              Redefining luxury aesthetics through personalized clinical excellence. Meticulous and unhurried facial rejuvenation.
            </p>
          </div>

          {/* Col 2: Quick links */}
          <div className="flex flex-col gap-3 items-start text-left">
            <h5 className="font-sans text-[10px] tracking-[0.2em] text-[#6c5842] uppercase font-bold mb-1">QUICK LINKS</h5>
            <a href="#treatments" className="font-sans text-xs text-[#4e453d]/85 hover:text-[#6c5842] transition-colors">Treatments</a>
            <a href="#about" className="font-sans text-xs text-[#4e453d]/85 hover:text-[#6c5842] transition-colors">Founder Story</a>
            <a href="#pricing" className="font-sans text-xs text-[#4e453d]/85 hover:text-[#6c5842] transition-colors">Membership</a>
            <a href="#contact" className="font-sans text-xs text-[#4e453d]/85 hover:text-[#6c5842] transition-colors">Booking</a>
          </div>

          {/* Col 3: Services list */}
          <div className="flex flex-col gap-3 items-start text-left">
            <h5 className="font-sans text-[10px] tracking-[0.2em] text-[#6c5842] uppercase font-bold mb-1">SERVICES</h5>
            <button onClick={() => handleBookingShortcut('Neuromodulators')} className="font-sans text-xs text-[#4e453d]/85 hover:text-[#6c5842] transition-colors text-left">Neurotoxins</button>
            <button onClick={() => handleBookingShortcut('Dermal Fillers')} className="font-sans text-xs text-[#4e453d]/85 hover:text-[#6c5842] transition-colors text-left">Bio-stimulators</button>
            <button onClick={() => handleBookingShortcut('HydraFacial')} className="font-sans text-xs text-[#4e453d]/85 hover:text-[#6c5842] transition-colors text-left">Laser Therapy</button>
            <button onClick={() => handleBookingShortcut('Medical Peels')} className="font-sans text-xs text-[#4e453d]/85 hover:text-[#6c5842] transition-colors text-left">Medical Peels</button>
          </div>

          {/* Col 4: Legal */}
          <div className="flex flex-col gap-3 items-start text-left">
            <h5 className="font-sans text-[10px] tracking-[0.2em] text-[#6c5842] uppercase font-bold mb-1">LEGAL</h5>
            <a href="#" className="font-sans text-xs text-[#4e453d]/85 hover:text-[#6c5842] transition-colors">Privacy Policy</a>
            <a href="#" className="font-sans text-xs text-[#4e453d]/85 hover:text-[#6c5842] transition-colors">Terms of Service</a>
            <a href="#" className="font-sans text-xs text-[#4e453d]/85 hover:text-[#6c5842] transition-colors">HIPAA Compliance</a>
            <a href="#" className="font-sans text-xs text-[#4e453d]/85 hover:text-[#6c5842] transition-colors">Accessibility</a>
          </div>

        </div>

        <div className="mt-16 text-center border-t border-[#d1c4ba]/20 pt-8">
          <p className="font-sans text-[10px] text-[#4e453d]/60 tracking-[0.15em] uppercase">
            © {new Date().getFullYear()} AURA & ESSENCE MEDICAL SPA. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>

      {/* -------------------- DYNAMIC LUXURY MODALS -------------------- */}

      {/* 1. Treatment Explore Detail Modal */}
      <AnimatePresence>
        {selectedTreatment && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTreatment(null)}
              className="fixed inset-0 bg-[#1d1b19] z-50 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="fixed inset-x-4 bottom-4 top-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-[#fff8f4] z-50 p-6 md:p-10 rounded-2xl border border-[#d1c4ba]/50 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar flex flex-col justify-between"
              id="treatment-detail-modal"
            >
              <div>
                {/* Header info */}
                <div className="flex justify-between items-start mb-6 border-b border-[#d1c4ba]/20 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#f3ede9] p-2.5 rounded-full text-[#6c5842] shrink-0">
                      {React.createElement(selectedTreatment.icon, { className: 'w-6 h-6' })}
                    </div>
                    <div>
                      <span className="font-sans text-[10px] tracking-widest text-[#775a19] uppercase font-bold">Clinical Breakdown</span>
                      <h3 className="font-display text-2xl text-[#6c5842] font-semibold">{selectedTreatment.title}</h3>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedTreatment(null)}
                    className="text-[#4e453d] p-1.5 hover:bg-[#f3ede9] rounded-full transition-colors"
                    id="close-treatment-modal-btn"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Specifications cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                  <div className="bg-white p-3 rounded-lg border border-[#d1c4ba]/20">
                    <p className="font-sans text-[9px] uppercase tracking-wider text-[#4e453d]/60 font-bold mb-0.5">Starting Cost</p>
                    <p className="font-sans text-xs md:text-sm text-[#6c5842] font-extrabold uppercase">{selectedTreatment.price}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-[#d1c4ba]/20">
                    <p className="font-sans text-[9px] uppercase tracking-wider text-[#4e453d]/60 font-bold mb-0.5">Session Time</p>
                    <p className="font-sans text-xs md:text-sm text-[#4e453d] font-bold">{selectedTreatment.duration}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-[#d1c4ba]/20 col-span-2 md:col-span-1">
                    <p className="font-sans text-[9px] uppercase tracking-wider text-[#4e453d]/60 font-bold mb-0.5">Downtime</p>
                    <p className="font-sans text-xs md:text-sm text-[#4e453d] font-bold">{selectedTreatment.downtime}</p>
                  </div>
                </div>

                {/* Detailed descriptions */}
                <div className="space-y-6 text-left">
                  <div>
                    <h5 className="font-sans text-[10px] tracking-widest text-[#6c5842] uppercase font-bold mb-1.5">Treatment Overview</h5>
                    <p className="font-sans text-xs md:text-sm text-[#4e453d] leading-relaxed">
                      {selectedTreatment.clinicalDetails}
                    </p>
                  </div>

                  <div>
                    <h5 className="font-sans text-[10px] tracking-widest text-[#6c5842] uppercase font-bold mb-2">Key Clinical Benefits</h5>
                    <ul className="space-y-2.5">
                      {selectedTreatment.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex gap-2.5 items-start text-xs md:text-sm">
                          <CheckCircle className="w-4 h-4 text-[#775a19] shrink-0 mt-0.5" />
                          <span className="text-[#4e453d] leading-relaxed">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#f9f2ef] p-4 rounded-xl border border-[#d1c4ba]/20">
                    <h5 className="font-sans text-[10px] tracking-widest text-[#6c5842] uppercase font-bold mb-1 flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-[#775a19]" />
                      <span>Clinical Guidance & FAQ</span>
                    </h5>
                    <p className="font-sans text-[11px] md:text-xs text-[#4e453d]/90 leading-relaxed">
                      {selectedTreatment.faq}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Actions */}
              <div className="flex gap-4 border-t border-[#d1c4ba]/20 pt-6 mt-8">
                <button 
                  onClick={() => setSelectedTreatment(null)}
                  className="flex-1 py-3 border border-[#7f756c] rounded-full text-xs font-sans tracking-widest uppercase font-bold text-[#6c5842] hover:bg-[#f3ede9] transition-all"
                >
                  Go Back
                </button>
                <button 
                  onClick={() => handleBookingShortcut(selectedTreatment.title)}
                  className="flex-1 py-3 bg-[#6c5842] text-white rounded-full text-xs font-sans tracking-widest uppercase font-bold hover:bg-[#867159] transition-all"
                  id="book-this-treatment-btn"
                >
                  Book Treatment Now
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 2. Membership Selection / SignUp Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlan(null)}
              className="fixed inset-0 bg-[#1d1b19] z-50 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="fixed inset-x-4 bottom-4 top-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-[#fff8f4] z-50 p-6 md:p-8 rounded-2xl border border-[#d1c4ba]/50 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar flex flex-col justify-between"
              id="membership-signup-modal"
            >
              <div>
                <div className="flex justify-between items-start mb-6 border-b border-[#d1c4ba]/20 pb-4">
                  <div>
                    <span className="font-sans text-[10px] tracking-widest text-[#775a19] uppercase font-bold">Sign Up for Tier</span>
                    <h3 className="font-display text-xl text-[#6c5842] font-semibold">{selectedPlan.name} Membership</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedPlan(null)}
                    className="text-[#4e453d] p-1.5 hover:bg-[#f3ede9] rounded-full transition-colors"
                    id="close-membership-modal-btn"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#d1c4ba]/30 shadow-inner mb-6 text-center">
                  <p className="font-sans text-xs text-[#4e453d]/70">Standard Monthly Subscription</p>
                  <p className="font-display text-4xl text-[#6c5842] mt-1 font-bold">{selectedPlan.price}<span className="text-sm font-sans font-normal text-[#4e453d]/80">/mo</span></p>
                  <p className="font-sans text-[10px] text-[#775a19] uppercase tracking-wider font-bold mt-2">No binding contract • Cancel anytime</p>
                </div>

                <div className="space-y-4 mb-6">
                  <h5 className="font-sans text-[10px] tracking-widest text-[#6c5842] uppercase font-bold text-left">Your Inclusive Tier Benefits</h5>
                  <ul className="space-y-2 text-left">
                    {selectedPlan.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start text-xs text-[#4e453d]/90 leading-relaxed">
                        <Check className="w-4 h-4 text-[#775a19] shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Simple form inside */}
                <div className="space-y-4 text-left border-t border-[#d1c4ba]/20 pt-5">
                  <p className="font-sans text-[10px] text-[#4e453d]/75 font-semibold">Enter your email to verify eligibility and reserve your plan slot:</p>
                  <input 
                    type="email"
                    className="w-full bg-transparent border-0 border-b border-[#d1c4ba] focus:ring-0 focus:border-[#6c5842] px-0 py-2 text-sm placeholder:text-[#4e453d]/30 text-[#1d1b19]"
                    placeholder="Enter email address"
                    defaultValue={formEmail}
                    id="membership-input-email"
                  />
                  <div className="flex gap-2 items-center text-[10px] text-[#4e453d]/60 leading-normal">
                    <Shield className="w-3.5 h-3.5 shrink-0" />
                    <span>Subscriptions processed securely on first clinical visit.</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 border-t border-[#d1c4ba]/20 pt-6 mt-8">
                <button 
                  onClick={() => setSelectedPlan(null)}
                  className="flex-1 py-3 border border-[#7f756c] rounded-full text-xs font-sans tracking-widest uppercase font-bold text-[#6c5842] hover:bg-[#f3ede9] transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    triggerToast(`Successfully registered slot for ${selectedPlan.name}! Our representative will contact you.`);
                    setSelectedPlan(null);
                  }}
                  className="flex-1 py-3 bg-[#6c5842] text-white rounded-full text-xs font-sans tracking-widest uppercase font-bold hover:bg-[#867159] transition-all"
                  id="confirm-membership-btn"
                >
                  Secure Spot
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 3. Client Reservations Dashboard Drawer */}
      <AnimatePresence>
        {isDashboardOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDashboardOpen(false)}
              className="fixed inset-0 bg-[#1d1b19] z-50 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 24 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-[#fff8f4] z-50 p-6 md:p-8 border-l border-[#d1c4ba]/50 shadow-2xl flex flex-col justify-between"
              id="client-bookings-dashboard"
            >
              <div className="overflow-y-auto custom-scrollbar flex-1 pr-1">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 border-b border-[#d1c4ba]/20 pb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#6c5842]" />
                    <h3 className="font-display text-xl text-[#6c5842] font-semibold">My Reservations Console</h3>
                  </div>
                  <button 
                    onClick={() => setIsDashboardOpen(false)}
                    className="text-[#4e453d] p-1.5 hover:bg-[#f3ede9] rounded-full transition-colors"
                    id="close-bookings-dashboard-btn"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Subtitle / Explanation */}
                <p className="font-sans text-xs text-[#4e453d]/80 leading-relaxed mb-6">
                  Here you can view, manage, and monitor the live clinical review status of your submitted appointment requests.
                </p>

                {/* Appointmens list */}
                {appointments.length === 0 ? (
                  <div className="bg-white p-8 rounded-xl border border-dashed border-[#d1c4ba] text-center my-10 flex flex-col items-center gap-3">
                    <AlertCircle className="w-10 h-10 text-[#775a19]/50" />
                    <p className="font-sans text-sm text-[#6c5842] font-semibold">No active requests found</p>
                    <p className="font-sans text-xs text-[#4e453d]/70 max-w-[240px] leading-relaxed">
                      You haven&apos;t scheduled any treatments yet. Scroll down to choose a date and request your session.
                    </p>
                    <button 
                      onClick={() => { setIsDashboardOpen(false); const el = document.getElementById('contact'); el?.scrollIntoView({ behavior: 'smooth' }); }}
                      className="mt-2 text-xs font-sans tracking-widest text-[#775a19] uppercase font-bold border-b border-[#775a19]/30 pb-0.5 hover:border-[#775a19] transition-colors"
                    >
                      Book Your First Consultation
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((app) => (
                      <div 
                        key={app.id}
                        className="bg-white p-5 rounded-xl border border-[#d1c4ba]/30 shadow-sm relative overflow-hidden"
                        id={`appointment-record-${app.id}`}
                      >
                        {/* Status bar */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-[#6c5842]" />

                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className="bg-[#f9f2ef] text-[#6c5842] border border-[#d1c4ba]/30 px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold">
                              {app.treatment}
                            </span>
                            <p className="font-sans text-sm text-[#6c5842] font-bold mt-2">Client: {app.name}</p>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <span className="flex items-center gap-1.5 text-[10px] font-sans text-[#775a19] font-bold bg-[#fed488]/40 px-2.5 py-1 rounded-md border border-[#fed488]/50">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#775a19] animate-pulse" />
                              <span>{app.status}</span>
                            </span>
                            <span className="text-[9px] text-[#4e453d]/60 font-semibold">Id: {app.id}</span>
                          </div>
                        </div>

                        {/* Date/Time specifics */}
                        <div className="grid grid-cols-2 gap-4 border-y border-[#d1c4ba]/20 py-3 my-3 text-left">
                          <div>
                            <p className="font-sans text-[9px] uppercase tracking-wider text-[#4e453d]/60 font-bold mb-0.5">Target Date</p>
                            <p className="font-sans text-xs text-[#6c5842] font-semibold">{app.date}</p>
                          </div>
                          <div>
                            <p className="font-sans text-[9px] uppercase tracking-wider text-[#4e453d]/60 font-bold mb-0.5">Time Slot</p>
                            <p className="font-sans text-xs text-[#6c5842] font-semibold">{app.time}</p>
                          </div>
                        </div>

                        {app.notes && (
                          <div className="text-left mb-4">
                            <p className="font-sans text-[9px] uppercase tracking-wider text-[#4e453d]/60 font-bold mb-0.5">Client Notes</p>
                            <p className="font-sans text-[11px] text-[#4e453d]/80 leading-relaxed italic">&ldquo;{app.notes}&rdquo;</p>
                          </div>
                        )}

                        {/* Delete action */}
                        <div className="flex justify-end gap-3 pt-1">
                          <button
                            onClick={() => handleCancelAppointment(app.id)}
                            className="flex items-center gap-1.5 text-xs font-sans tracking-wider text-rose-600 hover:text-rose-800 font-bold uppercase transition-colors"
                            id={`cancel-appointment-${app.id}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Cancel Request</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Console Footing */}
              <div className="border-t border-[#d1c4ba]/30 pt-6 mt-6">
                <button 
                  onClick={() => setIsDashboardOpen(false)}
                  className="w-full py-3.5 bg-[#6c5842] text-white rounded-full font-sans text-xs tracking-widest uppercase font-bold hover:bg-[#867159] transition-all"
                >
                  Close Console
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
