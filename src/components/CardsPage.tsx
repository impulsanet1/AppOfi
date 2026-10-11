import React, { useState } from 'react';
import {
  MessageCircle,
  Check,
  Copy,
  Sparkles,
  Layers,
  ArrowLeft,
  TrendingUp,
  CheckCircle,
  Share2,
  Asterisk,
  Instagram,
  Facebook,
  MoreVertical,
  ExternalLink,
} from 'lucide-react';
import { AgencySettings, DEFAULT_CARDS_DATA } from '../firebase';
import { useToast } from './Toast';

interface CardsPageProps {
  settings: AgencySettings;
  onNavigate: (path: string) => void;
}

export const CardsPage: React.FC<CardsPageProps> = ({ settings, onNavigate }) => {
  const { showToast } = useToast();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const card = DEFAULT_CARDS_DATA;
  const demoUrl = settings.cardsDemoUrl || card.demoUrl || 'https://impulsanet.digital/tarjeta-demo';
  const agencyName = settings.agencyName || 'ImpulsaNet';
  const demoWhatsapp = (settings.cardDemoWhatsapp || settings.whatsappNumber || card.whatsapp || '573212515944').replace(/[^0-9]/g, '');
  const demoPhone = settings.cardDemoPhone || settings.whatsappNumber || '+57 321 2515944';
  const demoName = settings.cardDemoName || agencyName;
  const demoRole = settings.cardDemoRole || 'Asesor Digital & Emprendedor';
  const demoCompany = settings.cardDemoCompany || agencyName;
  const instagramUrl = settings.socialLinks?.instagram || 'https://instagram.com/impulsanet_co';
  const facebookUrl = settings.socialLinks?.facebook || 'https://facebook.com';
  const tiktokUrl = settings.socialLinks?.tiktok || 'https://tiktok.com/@impulsanet';
  const officialLogo = settings.logoUrl || 'https://cdn.phototourl.com/member/2026-10-08-92ac8cdb-f316-40bc-ad16-3f22cb980788.png';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Tarjeta Digital ImpulsaNet',
          text: 'Aumentamos la visibilidad y el alcance de tus redes sociales. Crecemos contigo.',
          url: demoUrl,
        });
        showToast('success', 'Tarjeta compartida');
        return;
      } catch (err) {
        // Fallback to copy link
      }
    }
    handleCopyLink();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(demoUrl);
    showToast('success', 'Enlace de tarjeta copiado');
  };

  const getWhatsAppOrderUrl = (planTitle: string, price: string) => {
    const phone = demoWhatsapp;
    const message = encodeURIComponent(
      `¡Hola ImpulsaNet! Me interesa solicitar la ${planTitle} (${price}). ¿Qué información necesitan?`
    );
    return `https://wa.me/${phone}?text=${message}`;
  };

  const defaultPlan1Features = [
    "Enlace web permanente 100% online",
    "Código QR de alta definición para compartir",
    "Botón para guardar contacto en la agenda (.vcf)",
    "Botones directos a WhatsApp, llamada y redes"
  ];

  const defaultPlan2Features = [
    "Todo lo de la tarjeta básica",
    "Catálogo interactivo de servicios o productos",
    "Botones de datos bancarios para cobrar",
    "Actualizaciones de datos ilimitadas"
  ];

  const plan1Features =
    settings.cardPlan1Features && settings.cardPlan1Features.length > 0
      ? settings.cardPlan1Features
      : defaultPlan1Features;

  const plan2Features =
    settings.cardPlan2Features && settings.cardPlan2Features.length > 0
      ? settings.cardPlan2Features
      : defaultPlan2Features;

  return (
    <div className="bg-white min-h-[70vh]">
      {/* Sub-Header con Barra de Navegación Clara */}
      <div className="bg-white border-b border-zinc-200 py-2 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('/')}
              className="inline-flex items-center gap-1.5 font-bold text-zinc-700 hover:text-[#5e29c8] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Volver al Inicio</span>
            </button>
            <span className="text-zinc-300">/</span>
            <span className="text-zinc-500 font-medium">Tarjetas Virtuales</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/redes')}
              className="text-zinc-600 hover:text-[#5e29c8] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#5e29c8]" />
              <span>Ver servicios de redes</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
        {/* Encabezado Principal de la Sección */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4 pb-3 border-b border-zinc-100">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
              {settings.cardsSectionTitle || 'Tarjetas Virtuales con Código QR & Enlace Web'}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl leading-relaxed">
              {settings.cardsSectionSubtitle ||
                '100% digitales. Comparte tu contacto, WhatsApp, redes y catálogo en 1 toque. Sin costos mensuales ni aplicaciones adicionales.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              {settings.cardsDeliveryTag || '● Entrega en 24 horas'}
            </span>
          </div>
        </div>

        {/* Contenido en Cuadrícula: Demo interactivo a la izquierda + Planes a la derecha */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start mb-5">
          
          {/* Columna Izquierda: Vista Previa Interactiva de la Tarjeta Virtual */}
          <div className="lg:col-span-5 bg-white p-3.5 sm:p-4 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 mb-2.5">
                <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#5e29c8]" />
                  <span>Demostración Interactiva</span>
                </span>
                <span className="text-[10px] font-bold uppercase text-[#5e29c8] bg-purple-50 px-2 py-0.5 rounded-md">
                  100% Online
                </span>
              </div>

              {/* Maqueta Visual de la Tarjeta Interactiva (Estilo Biolink / Screenshot) */}
              <div
                className="rounded-xl p-3.5 sm:p-4 text-white shadow-lg relative overflow-hidden"
                style={{
                  background:
                    'radial-gradient(circle at 50% 10%, #7c3aed 0%, #581c87 35%, #3b0764 70%, #17042c 100%)',
                }}
              >
                {/* Botones Superiores de Acción */}
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={() => showToast('info', 'Tarjeta Virtual Interactiva ImpulsaNet')}
                    className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-all cursor-pointer shadow-sm active:scale-95"
                    title="ImpulsaNet"
                  >
                    <Asterisk className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>

                  <button
                    onClick={handleShare}
                    className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-all cursor-pointer shadow-sm active:scale-95"
                    title="Compartir tarjeta"
                  >
                    <Share2 className="w-3 h-3" />
                  </button>
                </div>

                {/* Avatar / Logotipo Central */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white p-1 mx-auto flex items-center justify-center shadow-lg ring-2 ring-white/20 overflow-hidden transition-transform hover:scale-105">
                  <img
                    src={officialLogo}
                    alt={demoName}
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>

                {/* Nombre de la Marca o Titular */}
                <h3 className="text-lg sm:text-xl font-black text-white text-center mt-1.5 tracking-tight truncate" title={demoName}>
                  {demoName}
                </h3>

                {/* Cargo / Rol y Empresa */}
                {(demoRole || demoCompany) && (
                  <p className="text-[11px] text-purple-200 text-center font-medium mt-0.5">
                    {demoRole}{demoRole && demoCompany ? ' • ' : ''}{demoCompany}
                  </p>
                )}

                {/* Biografía / Lema de la Marca */}
                <p className="text-[11px] sm:text-xs text-white/95 text-center font-normal px-2 mt-1 max-w-xs mx-auto leading-snug drop-shadow-xs">
                  {settings.tagline || 'Aumentamos la visibilidad y el alcance de tus redes sociales. Crecemos contigo. 🚀'}
                </p>

                {/* Fila de Redes Sociales: Instagram, WhatsApp, Facebook */}
                <div className="flex items-center justify-center gap-2.5 mt-2.5 mb-2.5">
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full border border-white/40 bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all active:scale-95 shadow-xs"
                    title={`Instagram ${demoName}`}
                  >
                    <Instagram className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={`https://wa.me/${demoWhatsapp}?text=${encodeURIComponent(
                      `¡Hola! Vi la tarjeta interactiva de ${demoName} y me interesa conocer más.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full border border-white/40 bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all active:scale-95 shadow-xs"
                    title={`WhatsApp ${demoName}`}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full border border-white/40 bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all active:scale-95 shadow-xs"
                    title={`Facebook ${demoName}`}
                  >
                    <Facebook className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Etiqueta / Encabezado de Sección */}
                <div className="text-center mt-2 mb-1.5">
                  <span className="text-[10px] sm:text-[11px] font-semibold text-white/90 tracking-wide">
                    {demoCompany || 'Enlaces y Contacto'}
                  </span>
                </div>

                {/* Botón 1: Tarjeta Principal con Logotipo */}
                <div className="relative group mb-2">
                  <div
                    onClick={() => {
                      window.open(demoUrl, '_blank');
                      showToast('info', 'Abriendo enlace interactivo');
                    }}
                    className="w-full py-1.5 px-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/30 backdrop-blur-md flex items-center justify-between transition-all cursor-pointer shadow-sm active:scale-[0.99]"
                  >
                    <div className="w-7 h-7 rounded-lg bg-white p-0.5 flex items-center justify-center shrink-0 shadow-sm border border-white/20">
                      <img src={officialLogo} alt={demoName} className="w-full h-full object-contain" />
                    </div>
                    <span className="text-xs font-semibold text-white tracking-wide">
                      {demoName}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(activeMenu === 'impulsa' ? null : 'impulsa');
                      }}
                      className="p-1 rounded-lg text-white/70 hover:text-white transition-colors cursor-pointer"
                      title="Opciones"
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {activeMenu === 'impulsa' && (
                    <div className="absolute right-3 top-full mt-1.5 z-20 w-44 rounded-xl bg-zinc-900 border border-zinc-700 p-1.5 shadow-xl text-xs text-white">
                      <button
                        onClick={() => {
                          handleCopyLink();
                          setActiveMenu(null);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 flex items-center gap-2 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5 text-[#a78bfa]" />
                        <span>Copiar enlace</span>
                      </button>
                      <a
                        href={demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setActiveMenu(null)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 flex items-center gap-2 cursor-pointer text-white"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#a78bfa]" />
                        <span>Abrir enlace</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* Botón 2: Tarjeta Instagram con Ícono de Cámara */}
                <div className="relative group">
                  <div
                    onClick={() => {
                      window.open(instagramUrl, '_blank');
                    }}
                    className="w-full py-1.5 px-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/30 backdrop-blur-md flex items-center justify-between transition-all cursor-pointer shadow-sm active:scale-[0.99]"
                  >
                    <div className="w-7 h-7 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center shrink-0 text-white">
                      <Instagram className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-white tracking-wide">
                      Instagram
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(activeMenu === 'instagram' ? null : 'instagram');
                      }}
                      className="p-1 rounded-lg text-white/70 hover:text-white transition-colors cursor-pointer"
                      title="Opciones"
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {activeMenu === 'instagram' && (
                    <div className="absolute right-3 top-full mt-1.5 z-20 w-44 rounded-xl bg-zinc-900 border border-zinc-700 p-1.5 shadow-xl text-xs text-white">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(instagramUrl);
                          showToast('success', 'Enlace de Instagram copiado');
                          setActiveMenu(null);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 flex items-center gap-2 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5 text-[#a78bfa]" />
                        <span>Copiar perfil</span>
                      </button>
                      <a
                        href={instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setActiveMenu(null)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 flex items-center gap-2 cursor-pointer text-white"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#a78bfa]" />
                        <span>Ver perfil</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Planes Oficiales de Tarjetas Virtuales */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-2.5 sm:gap-4 items-stretch">
            
            {/* Plan 1: Tarjeta Virtual Básica */}
            <div className="bg-white p-3 sm:p-4 rounded-2xl border-2 border-purple-200 hover:border-[#8B5CF6] hover:shadow-md transition-all duration-200 flex flex-col justify-between shadow-xs">
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-1 mb-1.5 h-5">
                  <span className="text-[10px] sm:text-xs font-bold uppercase text-[#5e29c8] flex items-center gap-1 truncate">
                    <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span className="truncate">{settings.cardPlan1Badge || 'Plan Estándar'}</span>
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-semibold text-zinc-500 bg-zinc-100 px-1.5 sm:px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                    Pago Único
                  </span>
                </div>
                
                <div className="h-5 sm:h-6 flex items-center mb-0.5 overflow-hidden">
                  <h3
                    className="text-xs sm:text-sm md:text-base font-black text-zinc-950 truncate whitespace-nowrap leading-none tracking-tight block w-full"
                    title={settings.cardPlan1Title || 'Tarjeta Virtual Básica'}
                  >
                    {settings.cardPlan1Title || 'Tarjeta Virtual Básica'}
                  </h3>
                </div>
                
                <div className="text-base sm:text-xl md:text-2xl font-black text-zinc-950 mb-2 sm:mb-2.5 truncate leading-tight">
                  {settings.cardsBasicPrice || '$79.000 COP'}
                </div>

                <div className="space-y-1.5 text-[11px] sm:text-xs text-zinc-600 mb-2.5 sm:mb-3">
                  {plan1Features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#5e29c8] shrink-0 mt-0.5" />
                      <span className="leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={getWhatsAppOrderUrl(
                  settings.cardPlan1Title || 'Tarjeta Virtual Básica',
                  settings.cardsBasicPrice || '$79.000 COP'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-[11px] sm:text-xs font-bold text-center block transition-all shadow-xs cursor-pointer active:scale-95 leading-tight mt-auto"
              >
                {settings.cardPlan1ButtonText || 'Pedir Tarjeta'}
              </a>
            </div>

            {/* Plan 2: Tarjeta Virtual Pro / Comercial */}
            <div className="bg-white p-3 sm:p-4 rounded-2xl border-2 border-purple-200 hover:border-[#8B5CF6] hover:shadow-md transition-all duration-200 flex flex-col justify-between shadow-xs relative">
              <span className="absolute -top-2.5 right-3 sm:-top-3 sm:right-5 px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-[#5e29c8] text-white">
                Más Completa
              </span>

              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-1 mb-1.5 h-5">
                  <span className="text-[10px] sm:text-xs font-bold uppercase text-[#5e29c8] flex items-center gap-1 truncate">
                    <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span className="truncate">{settings.cardPlan2Badge || 'Con Catálogo'}</span>
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-semibold text-purple-900 bg-purple-100 px-1.5 sm:px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                    Comercial
                  </span>
                </div>

                <div className="h-5 sm:h-6 flex items-center mb-0.5 overflow-hidden">
                  <h3
                    className="text-xs sm:text-sm md:text-base font-black text-zinc-950 truncate whitespace-nowrap leading-none tracking-tight block w-full"
                    title={settings.cardPlan2Title || 'Tarjeta Virtual Pro'}
                  >
                    {settings.cardPlan2Title || 'Tarjeta Virtual Pro'}
                  </h3>
                </div>

                <div className="text-base sm:text-xl md:text-2xl font-black text-[#5e29c8] mb-2 sm:mb-2.5 truncate leading-tight">
                  {settings.cardsProPrice || '$119.000 COP'}
                </div>

                <div className="space-y-1.5 text-[11px] sm:text-xs text-zinc-700 mb-2.5 sm:mb-3">
                  {plan2Features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#5e29c8] shrink-0 mt-0.5" />
                      <span className="leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={getWhatsAppOrderUrl(
                  settings.cardPlan2Title || 'Tarjeta Virtual Pro con Catálogo',
                  settings.cardsProPrice || '$119.000 COP'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl bg-[#5e29c8] hover:bg-[#4f21ab] text-white text-[11px] sm:text-xs font-bold text-center block shadow-md shadow-[#5e29c8]/25 transition-all cursor-pointer active:scale-95 leading-tight mt-auto"
              >
                {settings.cardPlan2ButtonText || 'Pedir Pro'}
              </a>
            </div>

          </div>
        </div>

        {/* Sección de Explicación y Preguntas Frecuentes de Tarjetas */}
        <div className="pt-3 sm:pt-4">
          <h2 className="text-xs sm:text-sm font-bold text-zinc-900 mb-2.5 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-[#5e29c8]" />
            <span>¿Cómo funciona una Tarjeta Virtual ImpulsaNet?</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5 text-xs text-zinc-600 leading-relaxed">
            <div>
              <strong className="text-zinc-900 block mb-0.5 font-semibold">1. Enlace y QR personalizados</strong>
              Diseñamos tu tarjeta virtual con tus colores, foto, logotipo, datos de contacto y catálogo.
            </div>
            <div>
              <strong className="text-zinc-900 block mb-0.5 font-semibold">2. Cero descargas para el cliente</strong>
              Cualquiera que escanee el QR o toque el link accede al instante sin instalar aplicaciones.
            </div>
            <div>
              <strong className="text-zinc-900 block mb-0.5 font-semibold">3. Botón para agendar directo</strong>
              Tus clientes tocan un botón y tu contacto se guarda automáticamente en su teléfono (.vcf).
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
