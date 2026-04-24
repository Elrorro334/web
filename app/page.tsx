"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { Play, Pause, MapPin, CalendarPlus, Gift, Music, Heart, Wine, Utensils, Sparkles } from "lucide-react";
import { Great_Vibes } from 'next/font/google';

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin']
});

const targetDate = new Date("2026-10-24T16:00:00").getTime();

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function InvitationPage() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<HTMLDivElement>(null);
  const blurRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();

  const { scrollYProgress: blurScroll } = useScroll({
    target: blurRef,
    offset: ["start start", "end start"]
  });

  const { scrollYProgress: timerScroll } = useScroll({
    target: timerRef,
    offset: ["start end", "end start"]
  });

  const blurTransform = useTransform(blurScroll, [0, 1], ["blur(0px)", "blur(12px)"]);
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const timerOpacity = useTransform(timerScroll, [0.2, 0.5, 0.8, 1], [0, 1, 1, 0]);
  const timerScale = useTransform(timerScroll, [0.2, 0.5, 1], [0.8, 1, 1.1]);

  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Intentar reproducir apenas cargue
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true); // Si el navegador lo permite, cambiamos el estado a true
        })
        .catch((error) => {
          console.log("El navegador bloqueó el autoplay. El usuario debe interactuar primero.");
          setIsPlaying(false);
        });
    }
  }, []);

  const handleRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    alert("RSVP Submitted Successfully!");
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const images = [
    "IMG_4176.webp", "IMG_4181.webp", "IMG_4185.webp", "IMG_4191.webp",
    "IMG_4223.webp", "IMG_4235.webp", "IMG_4289.webp", "IMG_4302.webp",
    "IMG_4319.webp", "IMG_4331.webp", "IMG_4355.webp", "IMG_4382.webp"
  ];

  return (
    <main className="relative min-h-screen bg-[#FFFFF0] text-[#2F4F4F] font-sans">
      <audio ref={audioRef} autoPlay loop src="/music/marry-me-train.mp3" />
      
      <button 
        onClick={togglePlay}
        className="fixed bottom-6 right-6 z-50 bg-[#047857] text-[#FFFFF0] p-4 rounded-full shadow-2xl hover:bg-[#064e3b] transition-all transform hover:scale-110 flex items-center justify-center"
      >
        {isPlaying ? <Pause size={24} /> : <Music size={24} />}
      </button>

      <section className="relative h-[100dvh] w-full overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/img/IMG_4095.webp"
            alt="Jennifer and Armando"
            fill
            sizes="100vw"
            className="object-cover object-center brightness-75"
            priority
          />
        </div>

        <div className="z-10 text-center flex flex-col items-center justify-center px-4 w-full -translate-y-20 md:-translate-y-40">
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          >
            <h1 className={`${greatVibes.className} text-[5.5rem] leading-none md:text-[10rem] text-[#FFFFF0] drop-shadow-lg mb-4 md:mb-6`}>
              Jennifer <br className="md:hidden" /> <span className="text-[#FFD700]">&</span> <br className="md:hidden" /> Armando
            </h1>
          </motion.div>
        </div>
      </section>

      <section className="py-10 px-6 bg-[#FFFFF0] text-center border-b border-[#047857]/10">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <p className="text-2xl md:text-4xl font-serif text-[#047857] uppercase tracking-[0.2em] leading-tight">
            "We're Getting Married"
          </p>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "60px" }}
            viewport={{ once: false }}
            className="mt-3 h-[1px] bg-[#FFD700] mx-auto"
          ></motion.div>
        </motion.div>
      </section>

      <div className="relative w-full bg-[#FFFFF0]">
        <section ref={blurRef} className="relative h-[200vh] w-full z-10">
          <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
            <motion.div style={{ filter: blurTransform }} className="relative w-full h-full">
              <Image
                src="/img/IMG_4331.webp"
                alt="Background 1"
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </div>
        </section>

        <section ref={timerRef} className="relative h-[200vh] w-full z-20 -mt-[100vh]">
          <div className="sticky top-0 h-[100dvh] w-full overflow-hidden shadow-[0_-30px_60px_rgba(0,0,0,0.8)]">
            <Image
              src="/img/IMG_4223.webp"
              alt="Timer Background"
              fill
              sizes="100vw"
              className="object-cover brightness-[0.45]"
            />

            {isMounted && (
              <motion.div
                style={{ opacity: timerOpacity, scale: timerScale }}
                className="absolute inset-0 flex flex-col items-center justify-center text-[#FFFFF0] px-4 md:px-8"
              >
                <h2 className="text-4xl md:text-8xl font-serif mb-8 md:mb-12 text-[#FFD700] drop-shadow-2xl text-center">
                  October 24, 2026
                </h2>

                <div className="grid grid-cols-2 md:flex justify-center gap-3 md:gap-10 mb-10 md:mb-16 w-full max-w-4xl px-2">
                  {Object.entries(timeLeft).map(([unit, value]) => (
                    <div
                      key={unit}
                      className="flex flex-col items-center bg-black/50 backdrop-blur-md p-4 md:p-10 rounded-2xl md:rounded-3xl border border-[#FFD700]/30 shadow-2xl w-full md:min-w-[150px]"
                    >
                      <span className="text-5xl md:text-8xl font-bold text-[#FFD700]">
                        {value}
                      </span>
                      <span className="text-xs md:text-base uppercase tracking-[0.2em] md:tracking-[0.4em] mt-2 md:mt-3 font-light text-white/90">
                        {unit}
                      </span>
                    </div>
                  ))}
                </div>

                <motion.a
                  href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Jennifer+%26+Armando+Wedding&dates=20261024T160000/20261024T230000&details=Join+us+to+celebrate+our+wedding+day!&location=Venue+to+be+confirmed"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center gap-2 md:gap-3 bg-[#FFD700] text-[#064e3b] px-6 md:px-12 py-4 md:py-5 rounded-full font-bold text-sm md:text-xl hover:bg-white transition-all shadow-2xl text-center w-[90%] md:w-auto"
                >
                  <CalendarPlus size={24} className="md:w-[28px] md:h-[28px]" />
                  Add to Google Calendar
                </motion.a>
              </motion.div>
            )}
          </div>
        </section>
      </div>

      <section className="relative h-[200vh] w-full z-30 -mt-[100vh]">
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden shadow-[0_-30px_60px_rgba(0,0,0,0.8)]">
          <Image
            src="/img/IMG_4319.webp"
            alt="Schedule Background"
            fill
            sizes="100vw"
            className="object-cover brightness-50"
          />

          <div className="absolute inset-0 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              className="relative w-full max-w-lg bg-[#FFFFF0] rounded-2xl shadow-2xl overflow-hidden p-6 md:p-10"
            >
              <div 
                className="absolute inset-0 opacity-15 pointer-events-none bg-cover bg-center"
                style={{ backgroundImage: "url('/img/hoja.webp')" }}
              ></div>

              <div className="relative z-10">
                <h2 className={`${greatVibes.className} text-5xl md:text-6xl text-center text-[#9C7C38] mb-8 drop-shadow-sm`}>
                  Itinerary
                </h2>

                <div className="flex flex-col gap-6 md:gap-8 mb-8">
                  {[
                    { title: "Ceremony", time: "4:00 PM", icon: Heart },
                    { title: "Cocktail", time: "5:00 PM", icon: Wine },
                    { title: "Dinner", time: "6:00 PM - 8:00 PM", icon: Utensils },
                    { title: "Formalities", time: "9:00 PM", icon: Sparkles }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between border-b border-[#9C7C38]/20 pb-4">
                      <span className={`${greatVibes.className} text-3xl md:text-4xl text-[#9C7C38] w-[40%] text-left drop-shadow-sm`}>
                        {item.title}
                      </span>
                      <div className="w-[20%] flex justify-center">
                        <item.icon className="w-6 h-6 md:w-8 md:h-8 text-[#9C7C38] stroke-[1.5]" />
                      </div>
                      <span className="text-sm md:text-base font-serif text-[#9C7C38] w-[40%] text-right uppercase tracking-[0.15em] md:tracking-[0.2em]">
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-[#047857] text-[#FFFFF0] p-4 md:p-5 rounded-xl text-center shadow-lg">
                  <p className="text-xs md:text-sm font-light uppercase tracking-widest leading-relaxed">
                    The ceremony and reception will be held at the same location.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative h-[150vh] w-full z-40">
          <div className="sticky top-0 h-[100dvh] w-full overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
            {/* Imagen de fondo de la Villa */}
            <Image
              src="/img/villa.webp"
              alt="Villa Punta Del Cielo Background"
              fill
              sizes="100vw"
              className="object-cover brightness-50"
            />

            <div className="absolute inset-0 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                className="relative w-full max-w-lg bg-[#047857] rounded-2xl shadow-2xl overflow-hidden p-8 md:p-12 border border-[#FFD700]/30"
              >
                {/* Textura de papel sobre el fondo verde */}
                <div 
                  className="absolute inset-0 opacity-15 pointer-events-none bg-cover bg-center mix-blend-overlay"
                  style={{ backgroundImage: "url('/img/hoja.webp')" }}
                ></div>

                <div className="relative z-10 flex flex-col items-center text-center">
                  
                  {/* Sección Dress Code con datos del PDF */}
                  <div className="mb-10 w-full border-b border-[#FFD700]/20 pb-10">
                    <h2 className={`${greatVibes.className} text-5xl md:text-6xl text-[#FFD700] mb-4 drop-shadow-sm leading-tight`}>
                      Dress Code
                    </h2>
                    <p className="text-2xl md:text-3xl font-serif text-[#FFFFF0] uppercase tracking-wider mb-2">
                      Formal Attire
                    </p>
                    <p className="text-xs md:text-sm font-light text-[#FFFFF0]/80 px-4 leading-relaxed italic">
                      Please dress formally to celebrate with us.
                    </p>
                  </div>

                  {/* Sección Event Location con datos del PDF */}
                  <div className="w-full">
                    <h2 className={`${greatVibes.className} text-5xl md:text-6xl text-[#FFD700] mb-4 drop-shadow-sm leading-tight`}>
                      Event Location
                    </h2>
                    <p className="text-xl md:text-2xl font-serif text-[#FFFFF0] uppercase tracking-wide mb-2">
                      Villa Punta Del Cielo
                    </p>
                    <p className="text-sm md:text-base font-light text-[#FFFFF0]/90 mb-10 leading-relaxed max-w-xs mx-auto">
                      494 N. Las Palmas Ave<br />
                      Los Angeles, CA 90004
                    </p>

                    {/* Botón con el enlace de Maps proporcionado */}
                    <motion.a 
                      href="https://maps.app.goo.gl/jU6sRkj59sG6jeVQ8?g_st=ic" 
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }} 
                      className="w-full inline-flex items-center justify-center gap-3 bg-[#FFD700] text-[#064e3b] px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:bg-[#FFFFF0]"
                    >
                      <MapPin size={24} className="text-[#064e3b]" />
                      Open in Google Maps
                    </motion.a>
                  </div>

                </div>
              </motion.div>
            </div>
          </div>
        </section>

      <section className="py-24 px-6 bg-[#FFFFF0]">
        <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-[#047857] mb-16">Accommodation</h2>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} className="grid md:grid-cols-2 gap-8">
            {[1, 2].map((hotel) => (
              <motion.div key={hotel} variants={fadeIn} whileHover={{ y: -10 }} className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                <div className="h-64 bg-gray-200 relative overflow-hidden">
                  <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.5 }} className="w-full h-full">
                    <Image src={`/img/IMG_4148.webp`} alt={`Hotel ${hotel}`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                  </motion.div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-[#047857] mb-2">Hotel Suggestion {hotel}</h3>
                  <p className="text-gray-600 mb-6 line-clamp-2">Recommended accommodation for our guests during the wedding weekend.</p>
                  <button className="w-full py-3 border border-[#047857] text-[#047857] rounded-lg hover:bg-[#047857] hover:text-white transition-colors flex justify-center items-center gap-2">
                    <MapPin size={20} /> View Map
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section className="py-24 px-6 bg-[#047857] text-[#FFFFF0] text-center overflow-hidden">
        <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.4 }} className="max-w-3xl mx-auto">
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
            <Gift size={48} className="mx-auto mb-6 text-[#FFD700]" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-serif mb-8">Honeymoon Fund</h2>
          <p className="text-lg md:text-xl font-light leading-relaxed mb-10 text-gray-200">
            Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a gift, a contribution towards our dream honeymoon in Ireland would be greatly appreciated.
          </p>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-[#FFD700] text-[#064e3b] px-10 py-4 rounded-full font-bold text-lg hover:bg-white transition-colors shadow-lg">
            Contribute Here
          </motion.button>
        </motion.div>
      </section>

      <section className="py-24 px-4 bg-[#FFFFF0] overflow-hidden">
        <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif text-[#047857] mb-12 text-center">Gallery</h2>

          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 w-full mx-auto">
            {images.map((src, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 0.6, delay: (index % 3) * 0.15, ease: "easeOut" }}
                className="break-inside-avoid relative rounded-xl overflow-hidden shadow-xl group mb-4 cursor-pointer"
              >
                <Image
                  src={`/img/${src}`}
                  alt={`Gallery Image ${index + 1}`}
                  width={500}
                  height={700}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="py-24 px-6 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#047857]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }} className="max-w-2xl mx-auto relative z-10 bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-serif text-[#047857] mb-2">RSVP</h2>
            <p className="text-gray-500">Please confirm your attendance</p>
          </div>

          <form onSubmit={handleRSVP} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#047857] focus:border-transparent transition-all outline-none" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="tel" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#047857] focus:border-transparent transition-all outline-none" placeholder="Your phone number" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#047857] focus:border-transparent transition-all outline-none" placeholder="Your email address" />
            </div>

            <p className="text-center text-sm font-medium text-[#047857] bg-[#047857]/10 py-3 rounded-lg mt-6">
              Respectfully, no children
            </p>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-[#047857] text-[#FFFFF0] py-4 rounded-lg font-bold text-lg hover:bg-[#064e3b] transition-colors shadow-lg mt-8">
              Confirm
            </motion.button>
          </form>
        </motion.div>
      </section>

      <footer className="bg-[#064e3b] text-[#FFFFF0] py-12 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} className="mb-6 flex justify-center">
          <Image src="/img/logo.png" alt="Logo" width={80} height={80} className="opacity-80" />
        </motion.div>
        <motion.h3 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false }} transition={{ delay: 0.2 }} className="text-3xl font-serif mb-4">Jennifer & Armando</motion.h3>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false }} transition={{ delay: 0.4 }} className="text-[#FFD700] tracking-widest font-light">#Jen&Armando2026</motion.p>
      </footer>
    </main>
  );
}