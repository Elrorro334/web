"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, Variants, AnimatePresence } from "framer-motion";
import { Play, Pause, MapPin, CalendarPlus, Gift, Music, Heart, Wine, Utensils, Sparkles, X, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { Great_Vibes } from 'next/font/google';
import toast from 'react-hot-toast';


const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin']
});

// El "-07:00" le dice a JavaScript exactamente en qué zona horaria es la fiesta
const targetDate = new Date("2026-10-24T16:00:00-07:00").getTime();

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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const galleryImages = [
    "IMG_4127.webp",
    "IMG_4148.webp",
    "IMG_4176.webp",
    "IMG_4181.webp",
    "IMG_4185.webp",
    "IMG_4191.webp",
    "IMG_4235.webp",
    "IMG_4289.webp",
    "IMG_4302.webp",
    "IMG_4355.webp",
    "IMG_4382.webp"
  ];

  const openLightbox = (index: number) => {
    setCurrentImgIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImgIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImgIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };



  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { scrollYProgress } = useScroll();

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

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

  const [hasEntered, setHasEntered] = useState(false);
  const [hotelIndex, setHotelIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHotelIndex((prev) => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleEnter = () => {
    setHasEntered(true);
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Audio play failed:", err));
    }
  };

  // States for Good Wishes
  const [isWishModalOpen, setIsWishModalOpen] = useState(false);
  const [wishData, setWishData] = useState({ name: "", message: "" });
  const [isSendingWish, setIsSendingWish] = useState(false);

  const handleWishChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setWishData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishData.name.trim() || !wishData.message.trim()) {
      toast.error("Please enter your name and message.", { style: { border: '1px solid #ef4444', padding: '16px', color: '#b91c1c' } });
      return;
    }

    setIsSendingWish(true);
    const loadingToast = toast.loading("Sending your good wishes...", {
      style: { border: '1px solid #047857', padding: '16px', color: '#047857' }
    });

    // Email Template para los Buenos Deseos
    const emailTemplate = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #2F4F4F; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
            <div style="background-color: #047857; padding: 30px 20px; text-align: center; border-bottom: 4px solid #9C7C38;">
                <h2 style="margin: 0; color: #FFFFF0; font-size: 26px; font-family: Georgia, serif; font-weight: normal; letter-spacing: 1px;">New Good Wish! 💌</h2>
                <p style="margin: 8px 0 0 0; color: #FFD700; font-size: 14px; letter-spacing: 3px; text-transform: uppercase;">Jennifer & Armando</p>
            </div>
            <div style="padding: 30px; background-color: #FFFFF0; text-align: center;">
                <p style="font-size: 18px; color: #4b5563; font-style: italic;">"${wishData.message}"</p>
                <p style="font-size: 16px; margin-top: 20px; color: #047857; font-weight: bold;">- ${wishData.name}</p>
            </div>
        </div>
        `;

    const payload = {
      subject: `💌 New Good Wish from: ${wishData.name}`,
      html: emailTemplate,
      replyToName: wishData.name
    };

    try {
      // Usamos tu misma API de RSVP que ya manda a los novios
      const response = await fetch('http://apimailer.somee.com/api/mail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success("Wishes sent successfully!", { id: loadingToast, duration: 5000, style: { border: '1px solid #10b981', padding: '16px', color: '#047857' } });
        setIsWishModalOpen(false);
        setWishData({ name: "", message: "" });
      } else {
        toast.error("There was a problem sending your message.", { id: loadingToast, duration: 5000 });
      }
    } catch (error) {
      toast.error("Network error. Please try again.", { id: loadingToast, duration: 5000 });
    } finally {
      setIsSendingWish(false);
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    guests: "1",
    customGuests: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [formErrors, setFormErrors] = useState({ name: "", phone: "", customGuests: "" });
  const [apiMessage, setApiMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: "" }));
    setApiMessage("");
  };

  const validateForm = () => {
    let isValid = true;
    const errors = { name: "", phone: "", customGuests: "" };

    // Validar nombre (solo letras, mín 3, máx 50)
    if (formData.name.trim().length < 3 || formData.name.trim().length > 50) {
      errors.name = "Name must be between 3 and 50 characters.";
      isValid = false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.name)) {
      errors.name = "Name can only contain letters.";
      isValid = false;
    }

    // Validar teléfono (solo números y algunos caracteres de formato, 10 a 15 dígitos)
    if (!/^[0-9+\-\s()]{10,15}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      errors.phone = "Please enter a valid phone number (10 to 15 digits).";
      isValid = false;
    }

    // Validar custom guests (solo números, entre 6 y 20 máximo para que no se pasen de lanza)
    if (formData.guests === "Other") {
      const guestsNum = parseInt(formData.customGuests);
      if (isNaN(guestsNum) || guestsNum < 6 || guestsNum > 20) {
        errors.customGuests = "Please enter a valid number between 6 and 20.";
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiMessage("");

    // Si la validación falla, detenemos el envío
    if (!validateForm()) return;

    setIsSubmitting(true);

    const totalGuests = formData.guests === 'Other' ? formData.customGuests : formData.guests;

    const emailTemplate = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #2F4F4F; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        
        <div style="background-color: #047857; padding: 30px 20px; text-align: center; border-bottom: 4px solid #9C7C38;">
          <h2 style="margin: 0; color: #FFFFF0; font-size: 26px; font-family: Georgia, serif; font-weight: normal; letter-spacing: 1px;">Wedding RSVP</h2>
          <p style="margin: 8px 0 0 0; color: #FFD700; font-size: 14px; letter-spacing: 3px; text-transform: uppercase;">Jennifer & Armando</p>
        </div>

        <div style="padding: 30px; background-color: #FFFFF0;">
          <p style="font-size: 16px; margin-top: 0; color: #4b5563;">Hello,</p>
          <p style="font-size: 16px; color: #4b5563; line-height: 1.5;">You have received a new RSVP confirmation for the wedding. Here are the details:</p>

          <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; margin: 25px 0; border: 1px solid #e5e7eb;">
            <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; width: 45%;"><strong style="color: #047857;">👤 Full Name:</strong></td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #1f2937;">${formData.name}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;"><strong style="color: #047857;">📞 Phone Number:</strong></td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #1f2937;">${formData.phone}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;"><strong style="color: #047857;">✉️ Email Address:</strong></td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                  <a href="mailto:${formData.email}" style="color: #047857; text-decoration: none;">${formData.email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0;"><strong style="color: #047857;">🎫 Guests Confirmed:</strong></td>
                <td style="padding: 12px 0;">
                  <span style="background-color: #9C7C38; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 14px;">
                    ${totalGuests}
                  </span>
                </td>
              </tr>
            </table>
          </div>
        </div>

        <div style="text-align: center; padding: 20px; background-color: #f9fafb; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0;">This is an automated notification from your wedding website.</p>
        </div>
      </div>
    `;

    const payload = {
      subject: `✅ RSVP Confirmed: ${formData.name} - ${totalGuests} guests`, // <--- TODO EN INGLÉS
      html: emailTemplate,
      replyToEmail: formData.email,
      replyToName: formData.name
    };

    try {
      const response = await fetch('http://apimailer.somee.com/api/mail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // Leemos la respuesta del PHP
      const data = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", phone: "", email: "", guests: "1", customGuests: "" });
      } else {
        setSubmitStatus("error");
        setApiMessage(data.error || "There was a problem sending your RSVP.");
      }
    } catch (error) {
      console.error("Error enviando el RSVP:", error);
      setSubmitStatus("error");
      setApiMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#FFFFF0] text-[#2F4F4F] font-sans">
      <audio ref={audioRef} loop src="/music/marry-me-train.mp3" />

      <button
        onClick={togglePlay}
        className="fixed bottom-6 right-6 z-50 bg-[#047857] text-[#FFFFF0] p-4 rounded-full shadow-2xl hover:bg-[#064e3b] transition-all transform hover:scale-110 flex items-center justify-center"
      >
        {isPlaying ? <Pause size={24} /> : <Music size={24} />}
      </button>

      <AnimatePresence>
        {!hasEntered && (
          <div
            onClick={handleEnter}
            className="fixed inset-0 z-[100] flex cursor-pointer overflow-hidden"
          >
            {/* ================= MITAD IZQUIERDA (TELÓN IZQUIERDO) ================= */}
            <motion.div
              exit={{ x: "-100%" }}
              transition={{ duration: 1.2, ease: [0.7, 0, 0.3, 1] }}
              className="relative w-1/2 h-full overflow-hidden bg-[#033626]"
            >
              {/* Contenedor de pantalla completa anclado a la izquierda */}
              <div className="absolute top-0 left-0 w-[100vw] h-[100dvh] flex flex-col items-center justify-center p-6 pt-12">
                <Image src="/img/fondoInicio.jpg" alt="Welcome Background" fill className="object-cover object-center z-0" priority />
                <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center justify-center w-full">
                  <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="relative w-60 h-60 md:w-80 md:h-80 mb-10 md:mb-14">
                    {/* Le regresé el brightness-0 invert para forzar el blanco */}
                    <Image src="/img/letras.png" alt="J&A Initials" fill className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] brightness-0 invert" priority />
                  </motion.div>

                  {/* TEXTOS (Efecto Oro Brillante sin recortes) */}
                  <div className="flex flex-col items-center text-center gap-4 mb-12">
                    {/* Le agregamos p-2 y p-4 a las orillas para que las letras cursivas no choquen con la caja invisible de CSS */}
                    <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 1 }} className="p-2 text-[10px] md:text-xs tracking-[0.35em] uppercase font-serif bg-gradient-to-r from-[#C69320] via-[#FDE047] to-[#C69320] text-transparent bg-clip-text">
                      You are invited to
                    </motion.p>
                    <motion.h3 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 1 }} className="p-2 text-xl md:text-2xl tracking-[0.35em] uppercase font-serif font-light bg-gradient-to-r from-[#C69320] via-[#FDE047] to-[#C69320] text-transparent bg-clip-text">
                      Live Something
                    </motion.h3>
                    <motion.h2 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2, duration: 1 }} className={`${greatVibes.className} p-4 text-6xl md:text-8xl mt-2 bg-gradient-to-r from-[#C69320] via-[#FDE047] to-[#C69320] text-transparent bg-clip-text drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]`}>
                      Extraordinary
                    </motion.h2>
                  </div>

                  {/* BOTÓN ENTER */}
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }} className="flex flex-col items-center gap-5 mt-6 group">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]"></div>
                      <div className="text-sm font-serif tracking-[0.4em] ml-2 bg-gradient-to-r from-[#C69320] via-[#FDE047] to-[#C69320] text-transparent bg-clip-text">E N T E R</div>
                      <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]"></div>
                    </div>
                    <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} className="text-[#D4AF37]">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="rotate-180 drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" /></svg>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* ================= MITAD DERECHA (TELÓN DERECHO) ================= */}
            <motion.div
              exit={{ x: "100%" }}
              transition={{ duration: 1.2, ease: [0.7, 0, 0.3, 1] }}
              className="relative w-1/2 h-full overflow-hidden bg-[#033626]"
            >
              {/* Contenedor de pantalla completa anclado a la derecha */}
              <div className="absolute top-0 right-0 w-[100vw] h-[100dvh] flex flex-col items-center justify-center p-6 pt-12">
                <Image src="/img/fondoInicio.jpg" alt="Welcome Background" fill className="object-cover object-center z-0" priority />
                <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center justify-center w-full">
                  <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="relative w-60 h-60 md:w-80 md:h-80 mb-10 md:mb-14">

                    {/* Le regresé el brightness-0 invert para forzar el blanco */}
                    <Image src="/img/letras.png" alt="J&A Initials" fill className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] brightness-0 invert" priority />
                  </motion.div>

                  {/* TEXTOS (Efecto Oro Brillante sin recortes) */}
                  <div className="flex flex-col items-center text-center gap-4 mb-12">
                    {/* Le agregamos p-2 y p-4 a las orillas para que las letras cursivas no choquen con la caja invisible de CSS */}
                    <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 1 }} className="p-2 text-[10px] md:text-xs tracking-[0.35em] uppercase font-serif bg-gradient-to-r from-[#C69320] via-[#FDE047] to-[#C69320] text-transparent bg-clip-text">
                      You are invited to
                    </motion.p>
                    <motion.h3 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 1 }} className="p-2 text-xl md:text-2xl tracking-[0.35em] uppercase font-serif font-light bg-gradient-to-r from-[#C69320] via-[#FDE047] to-[#C69320] text-transparent bg-clip-text">
                      Live Something
                    </motion.h3>
                    <motion.h2 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2, duration: 1 }} className={`${greatVibes.className} p-4 text-6xl md:text-8xl mt-2 bg-gradient-to-r from-[#C69320] via-[#FDE047] to-[#C69320] text-transparent bg-clip-text drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]`}>
                      Extraordinary
                    </motion.h2>
                  </div>

                  {/* BOTÓN ENTER */}
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }} className="flex flex-col items-center gap-5 mt-6 group">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]"></div>
                      <div className="text-sm font-serif tracking-[0.4em] ml-2 bg-gradient-to-r from-[#C69320] via-[#FDE047] to-[#C69320] text-transparent bg-clip-text">E N T E R</div>
                      <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]"></div>
                    </div>
                    <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} className="text-[#D4AF37]">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="rotate-180 drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" /></svg>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <section className="relative h-[100dvh] w-full overflow-hidden flex flex-col items-center justify-start">
        <div className="absolute inset-0 z-0">
          <Image
            src="/img/IMG_4095.webp"
            alt="Jennifer and Armando"
            fill
            sizes="100vw"
            className="object-cover object-[45%_35%] md:object-center brightness-75"
            priority
          />
        </div>

        <div className="absolute top-[8%] md:top-[15%] z-10 text-center flex flex-col items-center px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          >
            <h1 className={`${greatVibes.className} text-[3.2rem] md:text-[6.5rem] leading-[1.1] md:leading-none text-[#FFFFF0] drop-shadow-2xl`}>
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
        <section className="relative h-[200vh] w-full z-10">
          <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
            <div className="relative w-full h-full">
              <Image
                src="/img/IMG_4331.webp"
                alt="Background 1"
                fill
                sizes="100vw"
                className="object-cover object-[41%_center] md:object-center"
                priority
              />
            </div>
          </div>
        </section>

        <section className="relative h-[200vh] w-full z-20 -mt-[100vh]">
          <div className="sticky top-0 h-[100dvh] w-full overflow-hidden shadow-[0_-30px_60px_rgba(0,0,0,0.8)]">
            <Image
              src="/img/IMG_4223.webp"
              alt="Timer Background"
              fill
              sizes="100vw"
              className="object-cover brightness-[0.45]"
            />

            {isMounted && (
              <div className="absolute inset-0 flex flex-col items-center justify-start pt-[15vh] md:pt-[20vh] text-[#FFFFF0] px-4 md:px-8">
                <h2 className="text-2xl md:text-5xl font-serif mb-6 md:mb-10 text-[#FFD700] drop-shadow-md text-center uppercase tracking-[0.15em]">
                  October 24, 2026
                </h2>

                <div className="flex flex-row justify-center gap-3 md:gap-5 mb-8 md:mb-12 w-full max-w-4xl px-2">
                  {Object.entries(timeLeft).map(([unit, value]) => {
                    const displayUnit = unit === 'days' ? 'Days' : unit === 'hours' ? 'Hrs' : unit === 'minutes' ? 'Mins' : 'Secs';
                    return (
                      <div
                        key={unit}
                        className="flex flex-col items-center justify-center bg-[#047857]/90 border border-[#FFD700]/30 backdrop-blur-sm w-[70px] h-[80px] md:w-[110px] md:h-[120px] rounded-lg shadow-2xl"
                      >
                        <span className="text-3xl md:text-5xl font-serif text-[#FFD700]">
                          {value.toString().padStart(2, '0')}
                        </span>
                        <span className="text-[11px] md:text-sm font-serif mt-1 md:mt-2 text-[#FFFFF0] tracking-wider uppercase">
                          {displayUnit}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <motion.a
                  href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Jennifer+%26+Armando+Wedding&dates=20261024T160000/20261024T230000&details=Join+us+to+celebrate+our+wedding+day!&location=7837+E+White+Ln%2C+Bakersfield%2C+CA+93307%2C+EE.+UU."
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, backgroundColor: "#FFD700", color: "#047857" }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center gap-2 border border-[#FFD700] text-[#FFD700] px-6 py-2 md:px-8 md:py-3 rounded-full font-serif text-sm md:text-lg transition-colors shadow-lg"
                >
                  <CalendarPlus size={18} className="md:w-[22px] md:h-[22px]" />
                  Add to Calendar
                </motion.a>
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="relative h-[300vh] w-full z-30 -mt-[100vh]">

        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden shadow-[0_-30px_60px_rgba(0,0,0,0.8)] z-0">
          <motion.div
            initial={{ scale: 1.15 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 3, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0"
          >
            <Image
              src="/img/IMG_4319.webp"
              alt="Schedule Background"
              fill
              sizes="100vw"
              className="object-cover brightness-50"
            />
          </motion.div>
        </div>

        <div className="relative z-10 w-full h-[100dvh] bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: false, amount: 0.3 }}
            className="relative w-full max-w-lg bg-[#FFFFF0] rounded-2xl shadow-2xl overflow-hidden p-6 md:p-10"
          >
            <div
              className="absolute inset-0 opacity-15 pointer-events-none bg-cover bg-center"
            //style={{ backgroundImage: "url('/img/hoja.webp')" }}
            ></div>

            <div className="relative z-10">
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className={`${greatVibes.className} text-5xl md:text-6xl text-center text-[#9C7C38] mb-8 drop-shadow-sm`}
              >
                Itinerary
              </motion.h2>

              <div className="flex flex-col gap-6 md:gap-8 mb-8">
                {[
                  { title: "Ceremony", time: "4:00 PM", icon: Heart },
                  { title: "Cocktail", time: "5:00 PM", icon: Wine },
                  { title: "Dinner", time: "6:00 PM - 8:00 PM", icon: Utensils },
                  { title: "Formalities", time: "8:00 PM", icon: Sparkles }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (index * 0.15), duration: 0.8, ease: "easeOut" }}
                    className="flex items-center justify-between border-b border-[#9C7C38]/20 pb-4"
                  >
                    <span className={`${greatVibes.className} text-3xl md:text-4xl text-[#9C7C38] w-[40%] text-left drop-shadow-sm`}>
                      {item.title}
                    </span>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="w-[20%] flex justify-center"
                    >
                      <item.icon className="w-6 h-6 md:w-8 md:h-8 text-[#9C7C38] stroke-[1.5]" />
                    </motion.div>
                    <span className="text-sm md:text-base font-serif text-[#9C7C38] w-[40%] text-right uppercase tracking-[0.15em] md:tracking-[0.2em]">
                      {item.time}
                    </span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#047857] text-[#FFFFF0] p-4 md:p-5 rounded-xl text-center shadow-lg"
              >
                <p className="text-xs md:text-sm font-light uppercase tracking-widest leading-relaxed">
                  The ceremony and reception will be held at the same location.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="relative w-full h-[100dvh] z-0 pointer-events-none"></div>

      </section>

      <section className="relative h-[200vh] w-full z-40 -mt-[100vh]">
        <div className="sticky top-0 h-[100dvh] w-full bg-[#047857] overflow-hidden shadow-[0_-30px_60px_rgba(0,0,0,0.8)]">
          {/* Textura de fondo integrada más sutil */}
          <div
            className="absolute inset-0 opacity-[0.08] pointer-events-none bg-cover bg-center mix-blend-overlay"
          //style={{ backgroundImage: "url('/img/hoja.webp')" }}
          ></div>

          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-10 z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: false, amount: 0.3 }}
              className="w-full max-w-2xl flex flex-col items-center text-center py-12"
            >
              {/* Contenedor del Icono con distribución refinada */}
              <motion.div
                initial={{ scale: 0, rotate: -15, opacity: 0 }}
                whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
                className="relative flex items-center justify-center p-6 mb-12"
              >
                {/* Fondo sutil detrás del icono */}
                <div className="absolute inset-0 bg-[#FFFFF0]/10 rounded-full blur-xl scale-125"></div>

                {/* El Icono: Ahora más pequeño, centrado y blanco */}
                <div className="relative w-28 h-28 md:w-36 md:h-36 drop-shadow-[0_4px_10px_rgba(255,215,0,0.3)]">
                  <Image
                    src="/img/dress.png"
                    alt="Formal Attire Icon"
                    fill
                    className="object-contain brightness-0 invert drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)]"
                  />
                </div>
              </motion.div>

              {/* Títulos con mejor jerarquía y espaciado */}
              <div className="flex flex-col items-center gap-2 mb-10 max-w-lg">
                <motion.h2
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className={`${greatVibes.className} text-6xl md:text-[80px] text-[#FFD700] drop-shadow-md`}
                >
                  Dress Code
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-2xl md:text-3xl font-serif text-[#FFFFF0] uppercase tracking-[0.25em]"
                >
                  Formal Attire
                </motion.p>
              </div>

              {/* Descripción sutil y bien espaciada */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-base md:text-lg font-light text-[#FFFFF0]/90 px-6 max-w-lg leading-relaxed font-sans"
              >
                Please dress formally to celebrate with us.
              </motion.p>

            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative h-[200vh] w-full z-50 -mt-[100vh]">
        <div className="sticky top-0 h-[100dvh] w-full bg-[#047857] overflow-hidden shadow-[0_-30px_60px_rgba(0,0,0,0.8)]">

          <div
            className="absolute inset-0 opacity-15 pointer-events-none bg-cover bg-center mix-blend-overlay"
          // style={{ backgroundImage: "url('/img/hoja.webp')" }}
          ></div>

          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-8 z-10 overflow-y-auto no-scrollbar">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: false, amount: 0.2 }}
              className="w-full max-w-2xl flex flex-col items-center text-center gap-10 pt-10 pb-20"
            >

              <div className="w-full flex flex-col items-center">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className={`${greatVibes.className} text-5xl md:text-7xl text-[#FFD700] mb-6 md:mb-8 drop-shadow-sm`}
                >
                  Event Location
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
                  className="relative w-full h-48 md:h-72 rounded-2xl overflow-hidden mb-8 border border-[#FFD700]/40 shadow-2xl"
                >
                  <Image
                    src="/img/villa.webp"
                    alt="Villa Punta Del Cielo"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-1000"
                  />
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-xl md:text-3xl font-serif text-[#FFFFF0] uppercase tracking-wide mb-3"
                >
                  Villa Punta Del Cielo
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-sm md:text-base font-light text-[#FFFFF0]/90 mb-10 max-w-xs text-center leading-relaxed"
                >
                  7837 E White Ln<br />
                  Bakersfield, CA 93307, EE. UU.
                </motion.p>

                <motion.a
                  href="https://maps.app.goo.gl/jU6sRkj59sG6jeVQ8?g_st=ic"
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="w-full max-w-sm inline-flex items-center justify-center gap-3 bg-[#FFD700] text-[#064e3b] px-8 py-4 md:py-5 rounded-full font-bold text-lg md:text-xl shadow-2xl hover:bg-[#FFFFF0]"
                >
                  <MapPin size={24} className="text-[#064e3b]" />
                  Open in Google Maps
                </motion.a>
              </div>

            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative h-[200vh] w-full z-50 -mt-[100vh]">
        <div className="sticky top-0 h-[100dvh] w-full bg-[#FFFFF0] overflow-hidden shadow-[0_-30px_60px_rgba(0,0,0,0.8)]">

          <div
            className="absolute inset-0 opacity-10 pointer-events-none bg-cover bg-center"
            style={{ backgroundImage: "url('/img/hoja.webp')" }}
          ></div>

          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10 overflow-y-auto no-scrollbar">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: false, amount: 0.2 }}
              className="w-full max-w-5xl flex flex-col items-center text-center py-10"
            >

              <motion.h2
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className={`${greatVibes.className} text-6xl md:text-8xl text-[#047857] mb-4 md:mb-6 drop-shadow-sm leading-tight`}
              >
                Accommodation
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-base md:text-lg font-light text-[#047857]/80 px-6 max-w-2xl leading-relaxed mb-8 md:mb-12"
              >
                For your comfort and convenience, we have selected these nearby options. We want you to rest well after celebrating with us!
              </motion.p>

              <div className="w-full relative overflow-hidden rounded-2xl p-2 md:p-4 group">
                <button
                  onClick={() => setHotelIndex(0)}
                  className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-20 bg-[#047857] text-[#FFFFF0] p-2 md:p-3 rounded-full shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft size={24} />
                </button>

                <button
                  onClick={() => setHotelIndex(1)}
                  className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 bg-[#047857] text-[#FFFFF0] p-2 md:p-3 rounded-full shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight size={24} />
                </button>

                <motion.div
                  animate={{ x: hotelIndex === 0 ? "0%" : "-50%" }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="flex w-[200%]"
                >

                  <div className="w-1/2 px-2 md:px-12 flex justify-center">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col w-full max-w-md transform transition-transform hover:scale-[1.02]">

                      <div className="h-48 md:h-64 bg-gray-200 relative overflow-hidden">
                        <Image
                          src="/img/h2.jpg"
                          alt="WoodSpring Suites"
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="p-6 md:p-8 flex flex-col flex-grow justify-between">
                        <div>
                          <h3 className="text-xl md:text-2xl font-bold text-[#047857] mb-2 uppercase tracking-wide">
                            WoodSpring Suites
                          </h3>
                          <p className="text-gray-600 mb-6 text-sm md:text-base leading-relaxed">
                            8311 E Brundage Ln<br />
                            Bakersfield, CA 93307
                          </p>
                        </div>
                        <motion.a
                          href="https://maps.app.goo.gl/yszy7nsFUFFTfLWC8?g_st=ic"
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full py-3 border-2 border-[#047857] text-[#047857] rounded-lg hover:bg-[#047857] hover:text-white transition-colors flex justify-center items-center gap-2 font-bold shadow-md"
                        >
                          <MapPin size={20} /> View Map
                        </motion.a>
                      </div>
                    </div>
                  </div>

                  <div className="w-1/2 px-2 md:px-12 flex justify-center">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col w-full max-w-md transform transition-transform hover:scale-[1.02]">

                      <div className="h-48 md:h-64 bg-gray-200 relative overflow-hidden">
                        <Image
                          src="/img/h1.jpg"
                          alt="Hampton Inn & Suites"
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="p-6 md:p-8 flex flex-col flex-grow justify-between">
                        <div>
                          <h3 className="text-xl md:text-2xl font-bold text-[#047857] mb-2 uppercase tracking-wide">
                            Hampton Inn & Suites
                          </h3>
                          <p className="text-gray-600 mb-6 text-sm md:text-base leading-relaxed">
                            7941 E Brundage Ln<br />
                            Bakersfield, CA 93307
                          </p>
                        </div>
                        <motion.a
                          href="https://maps.app.goo.gl/LaDfc5VCHHQD646x6?g_st=ic"
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full py-3 border-2 border-[#047857] text-[#047857] rounded-lg hover:bg-[#047857] hover:text-white transition-colors flex justify-center items-center gap-2 font-bold shadow-md"
                        >
                          <MapPin size={20} /> View Map
                        </motion.a>
                      </div>
                    </div>
                  </div>

                </motion.div>
              </div>

              <div className="flex justify-center gap-3 mt-6">
                <button
                  onClick={() => setHotelIndex(0)}
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${hotelIndex === 0 ? "bg-[#047857] scale-125" : "bg-[#047857]/30"}`}
                />
                <button
                  onClick={() => setHotelIndex(1)}
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${hotelIndex === 1 ? "bg-[#047857] scale-125" : "bg-[#047857]/30"}`}
                />
              </div>

            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative h-[100vh] w-full overflow-hidden bg-[#047857] z-50 -mt-[100vh] shadow-[0_-30px_60px_rgba(0,0,0,0.8)] flex items-center justify-center p-6 text-[#FFFFF0] text-center">

        {/* Textura de fondo sutil (mix-blend para que se vea más integrado en el verde) */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none bg-cover bg-center mix-blend-overlay"

        ></div>

        {/* 1. CONTENEDOR MAESTRO (Staggered Children)
          initial="hidden" and whileInView="visible" on this parent activate children variants.
        */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }} // Se reanima cada que sube
          transition={{
            staggerChildren: 0.2, // Tiempo entre la aparición de cada elemento (efecto dominó)
          }}
          className="relative max-w-3xl mx-auto z-10 flex flex-col items-center gap-6 md:gap-10 py-16 md:py-24 overflow-y-auto no-scrollbar"
        >

          {/* ITEM 1: ICONO (Entrada en giro + Animación continua de flote y rotación)
          */}
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0, rotate: -360 }, // Entrada súper exagerada
              visible: {
                opacity: 1, scale: 1, rotate: 0,
                transition: { type: "spring", stiffness: 120, damping: 10 }
              }
            }}
            className="w-full flex justify-center"
          >
            <motion.div
              /* Animación continua "High School Style" (flota y gira poquito) */
              animate={{
                y: [0, -15, 0], // Sube y baja
                rotate: [-3, 3, -3], // Se menea de lado a lado
              }}
              transition={{
                duration: 4, // Lenta pero constante
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="drop-shadow-[0_4px_15px_rgba(255,215,0,0.4)]"
            >
              <Gift size={56} className="text-[#FFD700]" />
            </motion.div>
          </motion.div>


          {/* ITEM 2: TÍTULO (Entrada de salto + Efecto Wobble al hover)
          */}
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: -50 }, // Cae desde arriba
              visible: {
                opacity: 1, y: 0,
                transition: { type: "spring", stiffness: 200 }
              }
            }}
            /* High School: Al pasar el mouse, tiembla violentamente (Wobble) */
            whileHover={{
              rotate: [-1, 1, -1, 1, 0], // Tiembla
              scale: 1.03, // Crece tantito
              transition: { duration: 0.3, ease: "easeInOut" }
            }}
            className={`${greatVibes.className} text-6xl md:text-8xl text-[#FFD700] drop-shadow-lg leading-tight`}
          >
            Honeymoon Fund
          </motion.h2>


          {/* ITEM 3: PÁRRAFO (Entrada lateral con blur)
          */}
          <motion.p
            variants={{
              hidden: { opacity: 0, x: -50, filter: "blur(5px)" }, // Viene de la izquierda borroso
              visible: {
                opacity: 1, x: 0, filter: "blur(0px)",
                transition: { duration: 0.8, ease: "easeOut" }
              }
            }}
            className="text-lg md:text-xl font-sans font-light leading-relaxed text-[#FFFFF0] px-4 max-w-2xl"
          >
            Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a gift, a contribution towards our dream honeymoon in Ireland would be greatly appreciated.
          </motion.p>


          {/* ITEM 4: BOTÓN (Entrada de escala + Animación continua de Pulso de Color)
          */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.8 }, // Sube y crece
              visible: {
                opacity: 1, y: 0, scale: 1,
                transition: { type: "spring", stiffness: 150, delay: 0.2 } // Un pequeño delay extra
              }
            }}
          >
            <motion.button
              onClick={() => alert("Bank details will be updated shortly! / ¡Los datos bancarios se actualizarán pronto!")}

              /* High School: PULSO de sombra color oro constante (Grita: ¡CLICK ME!) */
              animate={{
                boxShadow: [
                  "0 0 0 0px rgba(255, 215, 0, 0.7)",
                  "0 0 0 12px rgba(255, 215, 0, 0)", // La sombra crece y se desvanece
                  "0 0 0 0px rgba(255, 215, 0, 0)"
                ],
                scale: [1, 1.03, 1] // Pulsa de tamaño
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut"
              }}

              whileHover={{
                scale: 1.1, // Crece al hover
                backgroundColor: "#FFFFF0", // Fondo Ivory
                color: "#047857", // Texto verde
                rotate: [0, -2, 2, -2, 0], // Pequeño jiggle al hover
                transition: { duration: 0.4 }
              }}
              whileTap={{ scale: 0.9 }}
              className="bg-[#FFD700] text-[#064e3b] px-12 py-5 rounded-full font-sans font-bold text-lg hover:shadow-2xl transition-all shadow-xl uppercase tracking-wider"
            >
              Details Coming Soon
            </motion.button>
          </motion.div>

        </motion.div>
      </section>

      <section className="py-24 px-4 bg-[#FFFFF0] overflow-hidden">
        <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif text-[#047857] mb-12 text-center">Gallery Photos</h2>

          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 w-full mx-auto">
            {galleryImages.map((src, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 0.6, delay: (index % 3) * 0.15, ease: "easeOut" }}
                onClick={() => openLightbox(index)}
                className="break-inside-avoid relative rounded-xl overflow-hidden shadow-xl group mb-4 cursor-pointer"
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 z-10"></div>
                <Image
                  src={`/img/${src}`}
                  alt={`Gallery Image ${index + 1}`}
                  width={500}
                  height={700}
                  className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <AnimatePresence>
          {lightboxOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center"
            >
              <button
                onClick={closeLightbox}
                className="absolute top-6 right-6 md:top-10 md:right-10 z-50 text-white hover:text-[#FFD700] transition-colors p-2"
              >
                <X size={36} />
              </button>

              <button
                onClick={prevImage}
                className="absolute left-2 md:left-10 top-1/2 -translate-y-1/2 z-50 text-white hover:text-[#FFD700] transition-colors p-2"
              >
                <ChevronLeft size={48} />
              </button>

              <motion.div
                key={currentImgIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative w-full max-w-5xl h-[80vh] mx-12 md:mx-24"
              >
                <Image
                  src={`/img/${galleryImages[currentImgIndex]}`}
                  alt="Enlarged Gallery Photo"
                  fill
                  className="object-contain"
                />
              </motion.div>

              <button
                onClick={nextImage}
                className="absolute right-2 md:right-10 top-1/2 -translate-y-1/2 z-50 text-white hover:text-[#FFD700] transition-colors p-2"
              >
                <ChevronRight size={48} />
              </button>

              <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 text-white font-serif tracking-widest text-sm md:text-base">
                {currentImgIndex + 1} / {galleryImages.length}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* === GOOD WISHES SECTION === */}
      <section id="wishes" className="w-full flex flex-col md:flex-row min-h-[80vh]">
        {/* Lado Izquierdo: Foto de los novios en Blanco y Negro */}
        <div
          className="w-full md:w-1/2 min-h-[40vh] md:min-h-full bg-cover bg-center grayscale"
          style={{ backgroundImage: "url('/img/IMG_4235.webp')" }}
        ></div>

        {/* Lado Derecho: Fondo Verde Oscuro */}
        <div className="w-full md:w-1/2 bg-[#064e3b] flex items-center justify-center p-6 md:p-12 relative overflow-hidden">

          {/* Tarjeta Marfil */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="bg-[#FFFFF0] w-full max-w-lg p-10 md:p-14 shadow-2xl relative z-10 flex flex-col items-center text-center rounded-sm"
          >
            {/* Título */}
            <div className="mb-8">
              <h2 className={`${greatVibes.className} text-6xl md:text-7xl text-[#9C7C38] leading-none`}>
                Good
              </h2>
              <h3 className="text-2xl md:text-3xl font-serif text-[#9C7C38] tracking-[0.2em] uppercase mt-[-10px]">
                Wishes
              </h3>
            </div>

            {/* Mensaje de ejemplo */}
            <p className="text-[#047857] font-serif text-lg md:text-xl leading-relaxed mb-6">
              We wish you the best in this new chapter, may God bless you greatly.
            </p>

            {/* Firma de ejemplo */}
            <p className={`${greatVibes.className} text-4xl text-[#047857] mb-12`}>
              Carol Rodriguez
            </p>

            {/* Botón para abrir modal */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsWishModalOpen(true)}
              className="border-2 border-[#9C7C38] text-[#9C7C38] px-8 py-3 rounded-sm font-serif tracking-widest uppercase hover:bg-[#9C7C38] hover:text-[#FFFFF0] transition-colors"
            >
              Send Good Wishes
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* === MODAL DE GOOD WISHES === */}
      <AnimatePresence>
        {isWishModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#FFFFF0] w-full max-w-md p-8 rounded-xl shadow-2xl relative"
            >
              <h3 className="text-2xl font-serif text-[#047857] mb-6 border-b border-gray-200 pb-4">
                Send your good wishes
              </h3>

              <form onSubmit={handleSendWish} className="space-y-5">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={wishData.name}
                    onChange={handleWishChange}
                    placeholder="Your name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#9C7C38] focus:border-transparent outline-none bg-white text-gray-700"
                    required
                  />
                </div>
                <div>
                  <textarea
                    name="message"
                    value={wishData.message}
                    onChange={handleWishChange}
                    placeholder="Your message"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#9C7C38] focus:border-transparent outline-none bg-white text-gray-700 resize-none"
                    required
                  ></textarea>
                </div>

                <div className="flex justify-end gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsWishModalOpen(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 transition-colors font-medium"
                    disabled={isSendingWish}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingWish}
                    className={`px-6 py-2 rounded-md font-medium text-[#FFFFF0] transition-colors ${isSendingWish ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#9C7C38] hover:bg-[#7a6029]'}`}
                  >
                    {isSendingWish ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === CONTACT SECTION === */}
      <section id="contact" className="w-full flex flex-col md:flex-row min-h-[80vh]">
        {/* Lado Izquierdo: Foto de los novios */}
        {/* NOTA: Cambia '/img/fondoInicio.jpg' por la foto real de ellos al atardecer */}
        <div
          className="w-full md:w-1/2 min-h-[40vh] md:min-h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/img/IMG_4289.webp')" }}
        ></div>

        {/* Lado Derecho: Fondo Verde Oscuro (Combina con el Footer) */}
        <div className="w-full md:w-1/2 bg-[#064e3b] flex items-center justify-center p-6 md:p-12 relative overflow-hidden">

          {/* Tarjeta Marfil (Color principal de la invitación) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="bg-[#FFFFF0] w-full max-w-lg p-10 md:p-14 shadow-2xl relative z-10 rounded-2xl"
          >
            {/* Título en Verde Esmeralda */}
            <h2 className={`${greatVibes.className} text-5xl md:text-7xl text-center text-[#047857] mb-12`}>
              Contacts
            </h2>

            {/* Contenedor de Iconos y Botones */}
            <div className="flex justify-around items-end mb-12 gap-4">

              {/* Columna Bride (Jennifer) */}
              <div className="flex flex-col items-center gap-6">
                {/* SVG Bride Icon en Dorado */}
                <svg viewBox="0 0 100 100" className="w-24 h-24 text-[#9C7C38]" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M50 20 C40 20 35 30 35 40 C35 50 40 55 50 55 C60 55 65 50 65 40 C65 30 60 20 50 20 Z" />
                  <path d="M35 40 C30 45 25 55 25 80 L75 80 C75 55 70 45 65 40" strokeDasharray="3 3" />
                  <path d="M35 30 C30 30 25 40 25 80" />
                  <path d="M65 30 C70 30 75 40 75 80" />
                  <circle cx="50" cy="70" r="5" fill="currentColor" stroke="none" />
                  <circle cx="45" cy="65" r="3" fill="currentColor" stroke="none" />
                  <circle cx="55" cy="65" r="3" fill="currentColor" stroke="none" />
                </svg>

                {/* Botón WA Bride - Verde Esmeralda */}
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://wa.me/16615771855"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#047857] text-[#FFFFF0] px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-[#033626] transition-colors shadow-md font-sans font-medium"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Bride
                </motion.a>
              </div>

              {/* Columna Groom (Armando) */}
              <div className="flex flex-col items-center gap-6">
                {/* SVG Groom Icon en Dorado */}
                <svg viewBox="0 0 100 100" className="w-24 h-24 text-[#9C7C38]" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="50" cy="30" r="15" />
                  <path d="M38 25 C45 20 55 20 62 25" strokeWidth="3" />
                  <path d="M30 80 C30 60 40 50 50 50 C60 50 70 60 70 80" />
                  <path d="M45 50 L45 80 M55 50 L55 80" />
                  <path d="M50 55 L45 65 L55 65 Z" />
                  <circle cx="50" cy="68" r="2" fill="currentColor" stroke="none" />
                </svg>

                {/* Botón WA Groom - Verde Esmeralda */}
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://wa.me/18056037801"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#047857] text-[#FFFFF0] px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-[#033626] transition-colors shadow-md font-sans font-medium"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Groom
                </motion.a>
              </div>
            </div>

            {/* Texto del Footer de la tarjeta */}
            <p className="text-center text-gray-500 font-sans text-sm mt-4">
              If in doubt, you can contact us!
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#047857]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }} className="max-w-2xl mx-auto relative z-10 bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-serif text-[#047857] mb-2">RSVP</h2>
            <p className="text-gray-500">Please confirm your attendance</p>
          </div>

          {submitStatus === "success" ? (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
              <div className="w-20 h-20 bg-[#047857]/10 text-[#047857] rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart size={40} />
              </div>
              <h3 className="text-2xl font-serif text-[#047857] mb-2">Thank you!</h3>
              <p className="text-gray-600">Your RSVP has been successfully sent to the couple.</p>

              <button onClick={() => setSubmitStatus("idle")} className="block mx-auto mt-8 text-[#047857] underline text-sm hover:text-[#064e3b] transition-colors">
                Submit another response
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleRSVP} className="space-y-6" noValidate>
              {/* Alerta de error si falla la API */}
              {submitStatus === "error" && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
                  {apiMessage || "An unexpected error occurred. Please try again."}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  maxLength={50}
                  className={`w-full px-4 py-3 rounded-lg border ${formErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#047857]'} focus:ring-2 focus:border-transparent transition-all outline-none`}
                  placeholder="Your full name"
                />
                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    maxLength={15}
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#047857]'} focus:ring-2 focus:border-transparent transition-all outline-none`}
                    placeholder="E.g. 5512345678"
                  />
                  {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    maxLength={80}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#047857] focus:border-transparent transition-all outline-none"
                    placeholder="Your email address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
                <select name="guests" value={formData.guests} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#047857] focus:border-transparent transition-all outline-none bg-white">
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5 Guests</option>
                  <option value="Other">Other (Please specify)</option>
                </select>
              </div>

              {/* Se muestra solo si seleccionan "Other" */}
              {formData.guests === "Other" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">How many guests?</label>
                  <input
                    type="number"
                    name="customGuests"
                    min="6"
                    max="20"
                    value={formData.customGuests}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.customGuests ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#047857]'} focus:ring-2 focus:border-transparent transition-all outline-none`}
                    placeholder="Enter number of guests (6-20)"
                  />
                  {formErrors.customGuests && <p className="text-red-500 text-xs mt-1">{formErrors.customGuests}</p>}
                </motion.div>
              )}

              <p className="text-center text-sm font-medium text-[#047857] bg-[#047857]/10 py-3 rounded-lg mt-6">
                Respectfully, no children
              </p>

              <motion.button
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                disabled={isSubmitting}
                type="submit"
                className={`w-full py-4 rounded-lg font-bold text-lg transition-colors shadow-lg mt-8 flex justify-center items-center ${isSubmitting ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-[#047857] text-[#FFFFF0] hover:bg-[#064e3b]'}`}
              >
                {isSubmitting ? 'Sending RSVP...' : 'Confirm'}
              </motion.button>
            </form>
          )}
        </motion.div>
      </section>

      {/* --- SHARE MOMENTS & FOOTER --- */}
      <footer className="relative bg-[#064e3b] text-[#FFFFF0] pt-40 pb-12 text-center flex flex-col items-center mt-32">

        {/* Tarjeta flotante de "Share your best moments" */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          className="absolute -top-32 w-[90%] max-w-2xl bg-[#FFFFF0] text-[#9C7C38] p-10 md:p-16 rounded-sm shadow-2xl border-[12px] border-[#9C7C38]/20 flex flex-col items-center z-20"
        >
          {/* Textura de papel */}
          <div
            className="absolute inset-0 opacity-[0.15] pointer-events-none bg-cover bg-center mix-blend-overlay"
            style={{ backgroundImage: "url('/img/hoja.webp')" }}
          ></div>

          <div className="relative z-10 flex flex-col items-center">
            <p className="text-xl md:text-2xl font-serif text-[#9C7C38]/80 uppercase tracking-widest mb-2">
              Share your best
            </p>
            <h3 className={`${greatVibes.className} text-6xl md:text-[5.5rem] text-[#9C7C38] mb-8 leading-none drop-shadow-sm`}>
              Moments
            </h3>

            {/* Botón interactivo para copiar el hashtag */}
            <motion.button
              onClick={() => {
                navigator.clipboard.writeText("#Jen&Armando2026");
                setCopied(true);
                setTimeout(() => setCopied(false), 2000); // Se borra a los 2 seg
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-4 group cursor-pointer outline-none"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#9C7C38]/10 flex items-center justify-center group-hover:bg-[#9C7C38] group-hover:shadow-lg transition-all duration-300">
                <Camera size={32} className="text-[#9C7C38] group-hover:text-[#FFFFF0] transition-colors" />
              </div>

              <div className="relative">
                <p className="text-2xl md:text-4xl font-serif tracking-wider text-[#9C7C38] transition-colors group-hover:text-[#047857]">
                  #Jen&Armando2026
                </p>

                {/* Letrerito de copiado que sale flotando */}
                <AnimatePresence>
                  {copied && (
                    <motion.span
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: -40, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute left-1/2 -translate-x-1/2 top-0 bg-[#047857] text-[#FFFFF0] text-xs font-bold px-4 py-1.5 rounded-full shadow-lg tracking-widest uppercase"
                    >
                      Copied!
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
            <p className="text-xs md:text-sm font-light mt-4 text-[#9C7C38]/60 uppercase tracking-widest">
              Tap the hashtag to copy
            </p>
          </div>
        </motion.div>

        {/* Contenido normal del footer (Logo del Planner con link y nombres en el fondo verde) */}
        <div className="mt-20 md:mt-16 w-full flex flex-col items-center">

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} className="mb-6 flex justify-center">
            {/* AQUÍ ESTÁ EL LINK: Envuelve a la imagen y abre en una pestaña nueva */}
            <a
              href="https://invitaciones4you.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block transition-transform duration-300 hover:scale-110 cursor-pointer"
              title="Visit Invitaciones4You"
            >

            </a>
          </motion.div>

          <motion.h3 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false }} transition={{ delay: 0.2 }} className="text-3xl font-serif mb-2">
            Jennifer & Armando
          </motion.h3>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false }} transition={{ delay: 0.4 }} className="text-[#FFD700]/70 tracking-widest font-light text-sm uppercase">
            Thank you for joining us
          </motion.p>
          <Image
            src="/img/IMG_3326.PNG"
            alt="Invitaciones4You Logo"
            width={200}
            height={200}
            className="opacity-70 hover:opacity-100 transition-opacity duration-300 object-contain drop-shadow-md"
          />
        </div>
      </footer>
    </main>
  );
}