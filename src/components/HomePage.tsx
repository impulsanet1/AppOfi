import React from 'react';
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
} from 'lucide-react';
import { AgencySettings } from '../firebase';

interface HomePageProps {
  settings: AgencySettings;
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ settings, onNavigate }) => {
  return (
    <div className="bg-white">
      {/* 1. HERO COMPACTO Y ENFOCADO CON TEXTO MÁS GRANDE */}
      <section className="relative overflow-hidden pt-5 pb-6 sm:pt-8 sm:pb-8 bg-white">
        {/* Glow de fondo suave */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4xl h-44 bg-gradient-to-r from-purple-400/15 via-[#8B5CF6]/15 to-pink-400/15 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          {/* Título Principal adaptado para móvil - Más grande para que resalte sobre todos los demás */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-zinc-950 leading-tight mb-3">
            Potencia tu presencia con{' '}
            <span className="bg-gradient-to-r from-[#5e29c8] via-[#8B5CF6] to-pink-600 bg-clip-text text-transparent">
              ImpulsaNet
            </span>
          </h1>

          {/* Subtítulo con tamaño ajustado para evitar palabras huérfanas */}
          <p className="text-[13px] sm:text-base text-zinc-700 max-w-2xl mx-auto leading-snug sm:leading-relaxed font-normal">
            Digitaliza tu negocio con tarjetas interactivas y acelera tus redes sociales. Compra servicios directos o suscríbete para acceder a <span className="font-bold text-zinc-950">tarifas económicas mes&nbsp;a&nbsp;mes</span>.
          </p>
        </div>
      </section>

      {/* 2. EXPLICACIÓN DEL MODELO EN 3 PASOS - MÁS COMPACTO Y CON TEXTO CLARO */}
      <section id="como-funciona" className="py-7 sm:py-9 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-xs font-black uppercase tracking-wider text-[#5e29c8] bg-purple-100/70 px-2.5 py-0.5 rounded-full">
              Paso a Paso
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1.5">
              ¿Cómo funciona ImpulsaNet?
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 mt-1 leading-relaxed">
              Flexibilidad total: compra cuando lo necesites o suscríbete para el máximo ahorro mensual.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {/* Paso 1 */}
            <div className="bg-white rounded-xl p-4 sm:p-5 border-2 border-purple-200 hover:border-[#8B5CF6] hover:shadow-md transition-all duration-200 shadow-2xs">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-base sm:text-lg font-black text-zinc-950 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#5e29c8] shrink-0" />
                  <span>Elige tu Solución</span>
                </h3>
                <span className="shrink-0 w-8 h-8 rounded-lg bg-purple-100 text-[#5e29c8] font-black text-xs flex items-center justify-center">
                  01
                </span>
              </div>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Elige entre tarjetas digitales interactivas con código QR o paquetes de visibilidad para tus redes sociales favoritas.
              </p>
            </div>

            {/* Paso 2 */}
            <div className="bg-white rounded-xl p-4 sm:p-5 border-2 border-purple-200 hover:border-[#8B5CF6] hover:shadow-md transition-all duration-200 shadow-2xs">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-base sm:text-lg font-black text-zinc-950 flex items-center gap-2">
                  <BadgePercent className="w-4 h-4 text-[#5e29c8] shrink-0" />
                  <span>Compra Directa o Suscríbete</span>
                </h3>
                <span className="shrink-0 w-8 h-8 rounded-lg bg-purple-100 text-[#5e29c8] font-black text-xs flex items-center justify-center">
                  02
                </span>
              </div>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Paga de forma individual o activa tu suscripción mensual para desbloquear precios con hasta el 50% de descuento en cada pedido.
              </p>
            </div>

            {/* Paso 3 */}
            <div className="bg-white rounded-xl p-4 sm:p-5 border-2 border-purple-200 hover:border-[#8B5CF6] hover:shadow-md transition-all duration-200 shadow-2xs">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-base sm:text-lg font-black text-zinc-950 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#5e29c8] shrink-0" />
                  <span>Resultados y Crecimiento</span>
                </h3>
                <span className="shrink-0 w-8 h-8 rounded-lg bg-purple-100 text-[#5e29c8] font-black text-xs flex items-center justify-center">
                  03
                </span>
              </div>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Tu tarjeta queda lista 100% online y tus servicios de redes se activan en minutos, con soporte directo vía WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DISTRIBUCIÓN A LAS 2 GRANDES SOLUCIONES - COMPACTO */}
      <section id="soluciones" className="py-7 sm:py-9">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
              Nuestras Soluciones Principales
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 mt-1 leading-relaxed">
              Explora las demostraciones y los catálogos con precios claros en pesos colombianos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {/* SOLUCIÓN 1: Tarjetas digitales interactivas */}
            <div className="rounded-2xl border-2 border-purple-200 bg-white p-5 sm:p-6 flex flex-col justify-between hover:border-[#8B5CF6] hover:shadow-md transition-all duration-200 group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-11 h-11 rounded-xl bg-[#5e29c8] text-white flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-purple-100 text-[#5e29c8]">
                    Destacado
                  </span>
                </div>

                <span className="text-xs font-bold uppercase tracking-wider text-[#5e29c8] block mb-1">
                  Solución 01
                </span>

                <h3 className="text-lg sm:text-xl font-bold text-zinc-950 mb-1.5">
                  Tarjetas Digitales Biolink
                </h3>

                <p className="text-sm text-zinc-600 leading-relaxed mb-4">
                  Perfiles interactivos con QR permanente, WhatsApp y redes sociales.
                </p>

                <div className="space-y-2.5 mb-5 text-sm text-zinc-700">
                  <div className="flex items-center gap-2 font-medium">
                    <QrCode className="w-4 h-4 text-[#5e29c8] shrink-0" />
                    <span>Código QR de alta definición permanente</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <Share2 className="w-4 h-4 text-[#5e29c8] shrink-0" />
                    <span>Enlace web propio 100% online</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Demostración interactiva en vivo</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('/tarjetas')}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#5e29c8] hover:bg-[#4f21ab] text-white font-bold text-sm shadow-md shadow-purple-500/20 transition-all cursor-pointer active:scale-95"
              >
                <span>Ver tarjetas y demo en vivo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* SOLUCIÓN 2: Servicios para redes */}
            <div className="rounded-2xl border-2 border-purple-200 bg-white p-5 sm:p-6 flex flex-col justify-between hover:border-[#8B5CF6] hover:shadow-md transition-all duration-200 group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-11 h-11 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-md shadow-zinc-900/20 group-hover:scale-105 transition-transform">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-zinc-100 text-zinc-800">
                    Crecimiento
                  </span>
                </div>

                <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 block mb-1">
                  Solución 02
                </span>

                <h3 className="text-lg sm:text-xl font-bold text-zinc-950 mb-1.5">
                  Servicios para Redes Sociales
                </h3>

                <p className="text-sm text-zinc-600 leading-relaxed mb-4">
                  Seguidores, likes y reproducciones para tus redes sin contraseñas.
                </p>

                <div className="space-y-2.5 mb-5 text-sm text-zinc-700">
                  <div className="flex items-center gap-2 font-medium">
                    <Users className="w-4 h-4 text-[#5e29c8] shrink-0" />
                    <span>Instagram, TikTok, YouTube & Facebook</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>100% seguro (solo tu @usuario o link)</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Entrega rápida con tarifas mayoristas</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('/redes')}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer active:scale-95"
              >
                <span>Ver catálogo de redes</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BANNER DE GARANTÍA Y CONFIANZA */}
      <section className="py-6 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="py-2.5 px-3">
              <div className="w-7 h-7 mx-auto mb-1.5 rounded-full bg-purple-50 text-[#5e29c8] flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <p className="text-sm font-bold text-zinc-900">0 Contraseñas Requeridas</p>
              <p className="text-sm text-zinc-500 mt-1">Solo requerimos tu @usuario público o enlace</p>
            </div>
            <div className="py-2.5 px-3">
              <div className="w-7 h-7 mx-auto mb-1.5 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 fill-amber-500" />
              </div>
              <p className="text-sm font-bold text-zinc-900">Activación Rápida</p>
              <p className="text-sm text-zinc-500 mt-1">Procesamiento ágil tras confirmar tu orden</p>
            </div>
            <div className="py-2.5 px-3">
              <div className="w-7 h-7 mx-auto mb-1.5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <MessageCircle className="w-3.5 h-3.5" />
              </div>
              <p className="text-sm font-bold text-zinc-900">Soporte Directo en Colombia</p>
              <p className="text-sm text-zinc-500 mt-1">Canal de atención disponible todos los días por WhatsApp</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
