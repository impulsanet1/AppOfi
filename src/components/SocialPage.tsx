import React, { useState } from 'react';
import {
  Users,
  Heart,
  Eye,
  Check,
  MessageCircle,
  Zap,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Instagram,
  Video,
  Youtube,
  Facebook,
  Sparkles,
} from 'lucide-react';
import { SocialServicePack, SocialPlatform, AgencySettings } from '../firebase';

interface SocialPageProps {
  platformFilter?: SocialPlatform | 'all';
  isPromosMode?: boolean;
  services: SocialServicePack[];
  settings: AgencySettings;
  onNavigate: (path: string) => void;
}

export const SocialPage: React.FC<SocialPageProps> = ({
  platformFilter = 'instagram',
  isPromosMode = false,
  services,
  settings,
  onNavigate,
}) => {
  const currentPlatform: SocialPlatform = platformFilter === 'all' ? 'instagram' : platformFilter;
  const [activeTypeFilter, setActiveTypeFilter] = useState<'seguidores' | 'likes' | 'vistas' | 'all'>('seguidores');

  const platforms: {
    id: SocialPlatform;
    name: string;
    path: string;
    icon: React.ReactNode;
    activeClass: string;
    inactiveClass: string;
  }[] = [
    {
      id: 'instagram',
      name: 'Instagram',
      path: '/redes/instagram',
      icon: <Instagram className="w-3.5 h-3.5 shrink-0" />,
      activeClass: 'bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-xs border-transparent',
      inactiveClass: 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100',
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      path: '/redes/tiktok',
      icon: <Video className="w-3.5 h-3.5 shrink-0" />,
      activeClass: 'bg-zinc-950 text-white shadow-xs border-zinc-950',
      inactiveClass: 'bg-zinc-100 text-zinc-800 border-zinc-200 hover:bg-zinc-200',
    },
    {
      id: 'youtube',
      name: 'YouTube',
      path: '/redes/youtube',
      icon: <Youtube className="w-3.5 h-3.5 shrink-0" />,
      activeClass: 'bg-[#FF0000] text-white shadow-xs border-[#FF0000]',
      inactiveClass: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      path: '/redes/facebook',
      icon: <Facebook className="w-3.5 h-3.5 shrink-0" />,
      activeClass: 'bg-[#0284c7] text-white shadow-xs border-[#0284c7]', // Azul claro vibrante con texto legible
      inactiveClass: 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100',
    },
  ];

  // Paquetes filtrados
  const filteredPacks = services
    .filter((s) => s.active !== false)
    .filter((s) => {
      if (isPromosMode) return true;
      return s.platform === currentPlatform;
    })
    .filter((s) => {
      if (activeTypeFilter === 'all') return true;
      return s.type === activeTypeFilter;
    });

  const getWhatsAppUrl = (pack: SocialServicePack) => {
    const phone = (settings.whatsappNumber || '573212515944').replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `¡Hola ImpulsaNet! Deseo ordenar el paquete: "${pack.title}" (${pack.price}) para ${pack.platform.toUpperCase()}. ¿Me indicas el proceso?`
    );
    return `https://wa.me/${phone}?text=${message}`;
  };

  // Helper para subtítulo ultra-corto y limpio tipo la referencia
  const getPackSubtitle = (pack: SocialServicePack) => {
    if (pack.type === 'seguidores') {
      if (pack.platform === 'tiktok') return 'Habilita transmisiones LIVE y biografía';
      if (pack.platform === 'youtube') return 'Acelera la monetización de tu canal';
      if (pack.platform === 'facebook') return 'Para tu página o perfil público';
      return 'Para comenzar a ganar credibilidad';
    }
    if (pack.type === 'likes') {
      return 'Mejora la interacción y alcance';
    }
    if (pack.type === 'vistas') {
      return 'Impulso algorítmico y reproducciones';
    }
    return 'Crecimiento rápido y seguro';
  };

  // Limpia el título quitando el nombre redundante de la red social para que no traspase los bordes
  const getCleanTitle = (title: string) => {
    return title
      .replace(/\s*(Instagram|TikTok|YouTube|Facebook)\s*/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Generador de mini-avatar / visual tipo referencia (1 persona para 100, 2 para 500, grupo para 1k+)
  const renderVisualMetric = (pack: SocialServicePack) => {
    if (pack.type === 'seguidores') {
      return (
        <div className="flex items-center -space-x-1.5 overflow-hidden">
          <div className="w-6 h-6 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-[#5e29c8]">
            <Users className="w-3 h-3" />
          </div>
          <div className="w-6 h-6 rounded-full bg-purple-200 border-2 border-white flex items-center justify-center text-[#5e29c8]">
            <Users className="w-3 h-3" />
          </div>
          <div className="w-6 h-6 rounded-full bg-[#5e29c8] border-2 border-white flex items-center justify-center text-white text-[9px] font-black">
            +
          </div>
        </div>
      );
    }
    if (pack.type === 'likes') {
      return (
        <div className="w-7 h-7 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500">
          <Heart className="w-3.5 h-3.5 fill-rose-500" />
        </div>
      );
    }
    return (
      <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-500">
        <Eye className="w-3.5 h-3.5" />
      </div>
    );
  };

  // Título dinámico
  const getPageTitle = () => {
    if (isPromosMode) {
      return '🔥 Promociones & Ofertas Especiales';
    }
    switch (currentPlatform) {
      case 'instagram':
        return 'Servicios para Instagram';
      case 'tiktok':
        return 'Servicios para TikTok';
      case 'youtube':
        return 'Servicios para YouTube';
      case 'facebook':
        return 'Servicios para Facebook';
      default: {
        const title = settings.socialSectionTitle?.trim();
        if (!title || /^(titulo|título)\s*redes$/i.test(title)) {
          return 'Servicios para Instagram';
        }
        return title;
      }
    }
  };

  const getPageSubtitle = () => {
    if (isPromosMode) {
      return 'Ofertas directas con entrega rápida, sin contraseñas y soporte directo por WhatsApp.';
    }
    switch (currentPlatform) {
      case 'instagram':
        return 'Seguidores, likes y vistas de reels para impulsar tu cuenta sin contraseñas.';
      case 'tiktok':
        return 'Seguidores para LIVE, likes y reproducciones para posicionar tus videos.';
      case 'youtube':
        return 'Suscriptores, likes y vistas de alta retención para crecer tu canal.';
      case 'facebook':
        return 'Seguidores para tu página y reacciones para tus publicaciones.';
      default: {
        const sub = settings.socialSectionSubtitle?.trim();
        if (!sub || /^(subtitulo|subtítulo)\s*redes$/i.test(sub)) {
          return 'Seguidores, likes y vistas de reels para impulsar tu cuenta sin contraseñas.';
        }
        return sub;
      }
    }
  };

  return (
    <div className="bg-white min-h-[70vh]">
      {/* Sub-Header con Barra de Navegación Clara */}
      <div className="bg-white border-b border-zinc-200 py-2.5 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('/')}
              className="inline-flex items-center gap-1.5 font-bold text-zinc-700 hover:text-[#5e29c8] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Inicio</span>
            </button>
            <span className="text-zinc-300">/</span>
            <button
              onClick={() => onNavigate('/redes/instagram')}
              className="text-zinc-600 hover:text-[#5e29c8] font-medium cursor-pointer transition-colors"
            >
              Redes
            </button>
            <span className="text-zinc-300">/</span>
            <span className="text-zinc-900 font-bold capitalize">{currentPlatform}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/tarjetas')}
              className="text-zinc-600 hover:text-[#5e29c8] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-[#5e29c8]" />
              <span>Ver tarjetas digitales</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Encabezado Principal Simplificado y Compacto */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-100">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-950 tracking-tight">
              {getPageTitle()}
            </h1>
            <p className="text-base sm:text-lg text-zinc-600 mt-1 max-w-2xl leading-relaxed">
              {getPageSubtitle()}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 mt-0.5 sm:mt-0">
            <span className="text-xs sm:text-sm font-bold text-purple-900 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200 flex items-center gap-1.5 shadow-2xs">
              <Zap className="w-4 h-4 fill-[#5e29c8] text-[#5e29c8]" />
              <span>{settings.socialSectionSpeedTag || 'Inicio en 15-45 min'}</span>
            </span>
          </div>
        </div>

        {/* Barra de Filtros: Todas las redes en una sola fila (Facebook siempre visible), botones con su color de marca y texto legible */}
        <div className="bg-white border border-zinc-200 p-2 rounded-xl mb-5 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          {/* Selector de Plataformas: 4 columnas en móvil o fila continua, garantizando que todas se vean en una sola fila sin ocultar Facebook */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2 w-full md:w-auto">
            {platforms.map((plat) => {
              const isActive = currentPlatform === plat.id && !isPromosMode;
              return (
                <button
                  key={plat.id}
                  onClick={() => onNavigate(plat.path)}
                  className={`px-2 py-2 sm:px-3.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border shadow-2xs ${
                    isActive
                      ? plat.activeClass
                      : plat.inactiveClass
                  }`}
                  title={plat.name}
                >
                  {plat.icon}
                  <span className="truncate">{plat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Filtro por Servicio: Seguidores por defecto, Likes, Vistas (Sin palabra 'TIPO') */}
          <div className="grid grid-cols-3 sm:flex items-center gap-1.5 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-zinc-200/60">
            {(
              [
                { id: 'seguidores', label: 'Seguidores', icon: <Users className="w-3.5 h-3.5" /> },
                { id: 'likes', label: 'Likes', icon: <Heart className="w-3.5 h-3.5 text-rose-500" /> },
                { id: 'vistas', label: 'Vistas', icon: <Eye className="w-3.5 h-3.5 text-blue-500" /> },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTypeFilter(t.id)}
                className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTypeFilter === t.id
                    ? 'bg-[#5e29c8] text-white shadow-2xs font-extrabold'
                    : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200/60'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cuadrícula de Tarjetas: Ahora en 1 sola columna INDIVIDUAL (uno debajo del otro, no al lado) con textos grandes */}
        {filteredPacks.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-xl bg-white border border-zinc-200 mb-6">
            <p className="text-base sm:text-lg font-bold text-zinc-700">No hay paquetes activos para este filtro por el momento.</p>
            <button
              onClick={() => setActiveTypeFilter('all')}
              className="mt-3 px-5 py-2.5 rounded-lg bg-zinc-900 text-white text-base font-bold hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Ver todos los paquetes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:gap-6 max-w-xl mx-auto mb-8 pt-4">
            {filteredPacks.map((pack) => {
              const isPopular = pack.popular;
              const displayTitle = getCleanTitle(pack.title);
              return (
                <div
                  key={pack.id}
                  className={`min-w-0 rounded-2xl p-5 sm:p-7 bg-white border-2 transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md relative ${
                    isPopular
                      ? 'border-[#8B5CF6] ring-2 ring-[#8B5CF6]/30 shadow-purple-500/10'
                      : 'border-purple-200 hover:border-[#8B5CF6]'
                  }`}
                >
                  {/* Badge superior estilo referencia sin recorte */}
                  {isPopular && (
                    <span className="absolute -top-3.5 right-4 z-10 px-3.5 py-1 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider bg-[#5e29c8] text-white shadow-sm flex items-center gap-1.5 border border-white">
                      <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                      <span>Más vendido</span>
                    </span>
                  )}

                  <div className="min-w-0">
                    {/* Header del Card: Avatar/Métrica visual + Etiqueta de plataforma */}
                    <div className="flex items-center justify-between mb-3 min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        {renderVisualMetric(pack)}
                        <span className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-zinc-700 truncate">
                          {pack.type}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm uppercase font-mono font-bold text-zinc-700 bg-zinc-100 px-3 py-1 rounded-md shrink-0">
                        {pack.platform}
                      </span>
                    </div>

                    {/* Título claro y limpio sin el nombre redundante de la red - Ahora grande e imponente */}
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-zinc-950 mb-1.5 leading-snug break-words" title={displayTitle}>
                      {displayTitle}
                    </h3>

                    {/* Subtítulo con tamaño igual a textos fuera de rectángulos */}
                    <p className="text-base sm:text-lg text-zinc-600 mb-3 sm:mb-4 leading-relaxed">
                      {getPackSubtitle(pack)}
                    </p>

                    {/* Precio destacado, grande y legible */}
                    <div className="mb-3 sm:mb-4 min-w-0">
                      <span className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 tracking-tight leading-none block">
                        {pack.price}
                      </span>
                    </div>

                    {/* Beneficios directos y concisos con texto amplio */}
                    <div className="space-y-2.5 mb-5 sm:mb-6 text-base sm:text-lg text-zinc-800 min-w-0">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Check className="w-5 h-5 text-[#5e29c8] shrink-0" />
                        <span className="font-semibold truncate">Sin contraseñas</span>
                      </div>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Check className="w-5 h-5 text-[#5e29c8] shrink-0" />
                        <span className="font-semibold truncate">Entrega en 15-45 minutos</span>
                      </div>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Check className="w-5 h-5 text-[#5e29c8] shrink-0" />
                        <span className="font-semibold truncate">Garantía activa de 30 días</span>
                      </div>
                    </div>
                  </div>

                  {/* Botón de Orden Directo a WhatsApp con texto grande */}
                  <a
                    href={getWhatsAppUrl(pack)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-3.5 sm:py-4 px-4 rounded-xl text-base sm:text-lg font-bold flex items-center justify-center gap-2.5 transition-all text-center cursor-pointer active:scale-95 shadow-sm ${
                      isPopular
                        ? 'bg-[#5e29c8] hover:bg-[#4f21ab] text-white'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                    }`}
                  >
                    <MessageCircle className="w-5 h-5 shrink-0" />
                    <span className="truncate">Pedir por WhatsApp</span>
                  </a>
                </div>
              );
            })}
          </div>
        )}

        {/* Barra de Garantía Compacta (1 fila limpia sin cajón ni línea) */}
        <div className="pt-5 sm:pt-7">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm sm:text-base text-zinc-600">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-base sm:text-lg text-zinc-950 block font-bold">100% Seguro</strong>
                <span>Cero contraseñas requeridas</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#5e29c8] flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-base sm:text-lg text-zinc-950 block font-bold">Inicio Rápido</strong>
                <span>Entrega en 15-45 minutos</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-base sm:text-lg text-zinc-950 block font-bold">Garantía</strong>
                <span>Reposición en todos los planes</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

