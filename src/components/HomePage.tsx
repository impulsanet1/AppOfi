import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  CreditCard,
  TrendingUp,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  QrCode,
  Share2,
  Users,
  Layers,
  CheckCircle2,
  BadgePercent,
  ChevronDown,
} from 'lucide-react';
import { AgencySettings } from '../firebase';

interface HomePageProps {
  settings: AgencySettings;
  onNavigate: (path: string) => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

const faqs = [
  {
    question: '¿Necesitan mi contraseña?',
    answer:
      'No. Nunca te pedimos contraseñas ni acceso a tu cuenta. Somos una tienda virtual: solo necesitamos el enlace o el usuario público de tu perfil o publicación.',
  },
  {
    question: '¿Cuánto tardan en llegar los seguidores, likes o vistas?',
    answer:
      'El tiempo estimado es de 1 a 4 horas. Normalmente llegan en unos 30 minutos.',
  },
  {
    question: '¿Tienen garantía?',
    answer:
      'Sí. La mayoría de nuestros servicios incluyen 30 días de garantía. Si tienes algún problema con tu pedido, escríbenos por WhatsApp y lo revisamos.',
  },
  {
    question: '¿Qué son las tarjetas digitales y cómo funcionan?',
    answer:
      'Son tarjetas de presentación virtuales con código QR. Quien la escanea ve tu información y tus enlaces (WhatsApp, redes, ubicación, catálogo) al instante, sin papel y sin imprimir de nuevo cuando cambias algo.',
  },
];

export const HomePage: React.FC<HomePageProps> = ({ settings, onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  const displayedFaqs = settings.faqs && settings.faqs.length > 0 ? settings.faqs : faqs;
  return (
    <div className="bg-white overflow-hidden">
      {/* 1. HERO COMPACTO Y ENFOCADO CON TEXTO MÁS GRANDE */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
        className="relative overflow-hidden pt-5 pb-6 sm:pt-8 sm:pb-8 bg-white"
      >
        {/* Glow de fondo suave */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4xl h-44 bg-gradient-to-r from-purple-400/15 via-[#8B5CF6]/15 to-pink-400/15 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          {/* Título Principal adaptado para móvil - Más grande para que resalte sobre todos los demás */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.25, 1, 0.5, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-zinc-950 leading-tight mb-3"
          >
            Potencia tu presencia con{' '}
            <span className="bg-gradient-to-r from-[#5e29c8] via-[#8B5CF6] to-pink-600 bg-clip-text text-transparent">
              ImpulsaNet
            </span>
          </motion.h1>

          {/* Subtítulo con tamaño ajustado para evitar palabras huérfanas */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16, ease: [0.25, 1, 0.5, 1] }}
            className="text-base sm:text-lg md:text-xl text-zinc-700 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Digitaliza tu negocio con tarjetas interactivas y acelera tus redes sociales. Compra servicios directos o suscríbete para acceder a <span className="font-bold text-zinc-950">tarifas económicas mes&nbsp;a&nbsp;mes</span>.
          </motion.p>
        </div>
      </motion.section>

      {/* 2. EXPLICACIÓN DEL MODELO EN 3 PASOS - MÁS COMPACTO Y CON TEXTO CLARO */}
      <motion.section
        id="como-funciona"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
        className="py-7 sm:py-9 bg-white"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#5e29c8] bg-purple-100/70 px-3 py-1 rounded-full">
              Paso a Paso
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-950 tracking-tight mt-2">
              ¿Cómo funciona ImpulsaNet?
            </h2>
            <p className="text-base sm:text-lg text-zinc-600 mt-1.5 leading-relaxed">
              Flexibilidad total: compra cuando lo necesites o suscríbete para el máximo ahorro mensual.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5"
          >
            {/* Paso 1 */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl p-5 sm:p-6 border-2 border-purple-200 hover:border-[#8B5CF6] hover:shadow-md transition-all duration-200 shadow-2xs"
            >
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <h3 className="text-xl sm:text-2xl font-black text-zinc-950 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#5e29c8] shrink-0" />
                  <span>Elige tu Solución</span>
                </h3>
                <span className="shrink-0 w-9 h-9 rounded-lg bg-purple-100 text-[#5e29c8] font-black text-sm flex items-center justify-center">
                  01
                </span>
              </div>
              <p className="text-base sm:text-lg text-zinc-700 leading-relaxed">
                Elige entre tarjetas digitales interactivas con código QR o paquetes de visibilidad para tus redes sociales favoritas.
              </p>
            </motion.div>

            {/* Paso 2 */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl p-5 sm:p-6 border-2 border-purple-200 hover:border-[#8B5CF6] hover:shadow-md transition-all duration-200 shadow-2xs"
            >
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <h3 className="text-xl sm:text-2xl font-black text-zinc-950 flex items-center gap-2">
                  <BadgePercent className="w-5 h-5 text-[#5e29c8] shrink-0" />
                  <span>Compra Directa o Suscríbete</span>
                </h3>
                <span className="shrink-0 w-9 h-9 rounded-lg bg-purple-100 text-[#5e29c8] font-black text-sm flex items-center justify-center">
                  02
                </span>
              </div>
              <p className="text-base sm:text-lg text-zinc-700 leading-relaxed">
                Paga de forma individual o activa tu suscripción mensual para desbloquear precios con hasta el 50% de descuento en cada pedido.
              </p>
            </motion.div>

            {/* Paso 3 */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl p-5 sm:p-6 border-2 border-purple-200 hover:border-[#8B5CF6] hover:shadow-md transition-all duration-200 shadow-2xs"
            >
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <h3 className="text-xl sm:text-2xl font-black text-zinc-950 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#5e29c8] shrink-0" />
                  <span>Resultados y Crecimiento</span>
                </h3>
                <span className="shrink-0 w-9 h-9 rounded-lg bg-purple-100 text-[#5e29c8] font-black text-sm flex items-center justify-center">
                  03
                </span>
              </div>
              <p className="text-base sm:text-lg text-zinc-700 leading-relaxed">
                Tu tarjeta queda lista 100% online y tus servicios de redes se activan en minutos, con soporte directo vía WhatsApp.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* 3. DISTRIBUCIÓN A LAS 2 GRANDES SOLUCIONES - COMPACTO */}
      <motion.section
        id="soluciones"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
        className="py-7 sm:py-9 bg-white"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-950 tracking-tight">
              Nuestras Soluciones Principales
            </h2>
            <p className="text-base sm:text-lg text-zinc-600 mt-1.5 leading-relaxed">
              Explora las demostraciones y los catálogos con precios claros en pesos colombianos.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto"
          >
            {/* SOLUCIÓN 1: Tarjetas digitales interactivas */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl border-2 border-purple-200 bg-white p-6 sm:p-7 flex flex-col justify-between hover:border-[#8B5CF6] hover:shadow-md transition-all duration-200 group"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="w-11 h-11 rounded-lg bg-[#5e29c8] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider bg-purple-100 text-[#5e29c8]">
                    Destacado
                  </span>
                </div>

                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#5e29c8] block mb-1">
                  Solución 01
                </span>

                <h3 className="text-2xl sm:text-3xl font-black text-zinc-950 mb-2">
                  Tarjetas Digitales Biolink
                </h3>

                <p className="text-base sm:text-lg text-zinc-600 leading-relaxed mb-4">
                  Perfiles interactivos con QR permanente, WhatsApp y redes sociales.
                </p>

                <div className="space-y-3 mb-6 text-base sm:text-lg text-zinc-800">
                  <div className="flex items-center gap-2.5 font-medium">
                    <QrCode className="w-5 h-5 text-[#5e29c8] shrink-0" />
                    <span>Código QR de alta definición permanente</span>
                  </div>
                  <div className="flex items-center gap-2.5 font-medium">
                    <Share2 className="w-5 h-5 text-[#5e29c8] shrink-0" />
                    <span>Enlace web propio 100% online</span>
                  </div>
                  <div className="flex items-center gap-2.5 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Demostración interactiva en vivo</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('/tarjetas')}
                className="w-full inline-flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl bg-[#5e29c8] hover:bg-[#4f21ab] text-white font-bold text-base sm:text-lg shadow-sm transition-all cursor-pointer active:scale-95"
              >
                <span>Ver tarjetas y demo en vivo</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* SOLUCIÓN 2: Servicios para redes */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl border-2 border-purple-200 bg-white p-6 sm:p-7 flex flex-col justify-between hover:border-[#8B5CF6] hover:shadow-md transition-all duration-200 group"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="w-11 h-11 rounded-lg bg-[#5e29c8] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider bg-purple-100 text-[#5e29c8]">
                    Crecimiento
                  </span>
                </div>

                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#5e29c8] block mb-1">
                  Solución 02
                </span>

                <h3 className="text-2xl sm:text-3xl font-black text-zinc-950 mb-2">
                  Servicios para Redes Sociales
                </h3>

                <p className="text-base sm:text-lg text-zinc-600 leading-relaxed mb-4">
                  Seguidores, likes y reproducciones para tus redes sin contraseñas.
                </p>

                <div className="space-y-3 mb-6 text-base sm:text-lg text-zinc-800">
                  <div className="flex items-center gap-2.5 font-medium">
                    <Users className="w-5 h-5 text-[#5e29c8] shrink-0" />
                    <span>Instagram, TikTok, YouTube & Facebook</span>
                  </div>
                  <div className="flex items-center gap-2.5 font-medium">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>100% seguro (solo tu @usuario o link)</span>
                  </div>
                  <div className="flex items-center gap-2.5 font-medium">
                    <Zap className="w-5 h-5 text-amber-500 shrink-0" />
                    <span>Entrega rápida con tarifas mayoristas</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('/redes')}
                className="w-full inline-flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl bg-[#5e29c8] hover:bg-[#4f21ab] text-white font-bold text-base sm:text-lg shadow-sm transition-all cursor-pointer active:scale-95"
              >
                <span>Ver catálogo de redes</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* 4. PREGUNTAS FRECUENTES (DESPLEGABLES SIN RECTÁNGULOS NI FONDOS DE OTRO COLOR) */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        className="py-9 sm:py-12 bg-white"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-7">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-950 tracking-tight">
              Preguntas Frecuentes
            </h2>
            <p className="text-base sm:text-lg text-zinc-600 mt-1.5">
              Todo lo que necesitas saber antes de ordenar tu servicio.
            </p>
          </div>

          <div className="divide-y divide-zinc-200/80">
            {displayedFaqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="py-3.5 sm:py-4">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between text-left gap-4 cursor-pointer group py-1"
                    aria-expanded={isOpen}
                  >
                    <span className="text-lg sm:text-xl font-bold text-zinc-900 group-hover:text-[#5e29c8] transition-colors leading-snug">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-zinc-400 shrink-0 transition-transform duration-200 group-hover:text-[#5e29c8] ${
                        isOpen ? 'rotate-180 text-[#5e29c8]' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <p className="pt-2.5 pb-1 text-base sm:text-[17px] text-zinc-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* 5. BANNER DE GARANTÍA Y CONFIANZA */}
      <motion.section
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
        className="py-6 bg-white"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center"
          >
            <motion.div variants={itemVariants} className="py-2.5 px-3">
              <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-purple-50 text-[#5e29c8] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-base sm:text-lg font-bold text-zinc-900">0 Contraseñas Requeridas</p>
              <p className="text-sm sm:text-base text-zinc-500 mt-1">Solo requerimos tu @usuario público o enlace</p>
            </motion.div>
            <motion.div variants={itemVariants} className="py-2.5 px-3">
              <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                <Zap className="w-4 h-4 fill-amber-500" />
              </div>
              <p className="text-base sm:text-lg font-bold text-zinc-900">Activación Rápida</p>
              <p className="text-sm sm:text-base text-zinc-500 mt-1">Procesamiento ágil tras confirmar tu orden</p>
            </motion.div>
            <motion.div variants={itemVariants} className="py-2.5 px-3">
              <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              <p className="text-base sm:text-lg font-bold text-zinc-900">Soporte Directo en Colombia</p>
              <p className="text-sm sm:text-base text-zinc-500 mt-1">Canal de atención disponible todos los días por WhatsApp</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};
