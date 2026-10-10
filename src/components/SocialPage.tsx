import React, { useState } from 'react';
import {
  TrendingUp,
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
  platformFilter = 'all',
  isPromosMode = false,
  services,
  settings,
  onNavigate,
}) => {
  const [activeTypeFilter, setActiveTypeFilter] = useState<'all' | 'seguidores' | 'likes' | 'vistas'>('all');

  const platforms: { id: SocialPlatform; name: string; path: string; icon: React.ReactNode }[] = [
    { id: 'instagram', name: 'Instagram', path: '/redes/instagram', icon: <Instagram className="w-4 h-4" /> },
    { id: 'tiktok', name: 'TikTok', path: '/redes/tiktok', icon: <Video className="w-4 h-4" /> },
    { id: 'youtube', name: 'YouTube', path: '/redes/youtube', icon: <Youtube className="w-4 h-4" /> },
    { id: 'facebook', name: 'Facebook', path: '/redes/facebook', icon: <Facebook className="w-4 h-4" /> },
  ];

  // Determinar los paquetes filtrados
  const filteredPacks = services
    .filter((s) => s.active !== false)
    .filter((s) => {
      if (platformFilter === 'all') return true;
      return s.platform === platformFilter;
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'seguidores':
        return <Users className="w-4 h-4 text-[#5e29c8]" />;
      case 'likes':
        return <Heart className="w-4 h-4 text-rose-500" />;
      case 'vistas':
        return <Eye className="w-4 h-4 text-blue-500" />;
      default:
        return <TrendingUp className="w-4 h-4 text-[#5e29c8]" />;
    }
  };

  // Título dinámico según si es página general de redes o individual
  const getPageTitle = () => {
    if (isPromosMode) {
      return '🔥 Promociones & Ofertas Especiales';
    }
    switch (platformFilter) {
      case 'instagram':
        return 'Servicios para Instagram';
      case 'tiktok':
        return 'Servicios para TikTok';
      case 'youtube':
        return 'Servicios para YouTube';
      case 'facebook':
        return 'Servicios para Facebook';
      default:
        return settings.socialSectionTitle || 'Seguidores, Likes y Vistas para tus Redes';
    }
  };

  const getPageSubtitle = () => {
    if (isPromosMode) {
      return 'Aprovecha nuestras ofertas destacadas con entrega inmediata, 0 contraseñas y soporte prioritario por WhatsApp.';
    }
    switch (platformFilter) {
      case 'instagram':
        return 'Seguidores reales de alta calidad, likes para tus publicaciones y visualizaciones para reels e historias.';
      case 'tiktok':
        return 'Multiplica tus seguidores, likes y reproducciones para posicionar tus videos en la sección "Para Ti".';
      case 'youtube':
        return 'Suscriptores seguros, likes y vistas de alta retención para impulsar tus videos y canal.';
      case 'facebook':
        return 'Seguidores para tu página de Facebook, likes y reacciones para tus posts y contenido multimedia.';
      default:
        return settings.socialSectionSubtitle || 'Impulsa tus métricas, credibilidad y alcance algorítmico sin compartir contraseñas.';
    }
  };

  return (
    <div className="bg-white min-h-[70vh]">
      {/* Sub-Header con Barra de Navegación y Breadcrumbs */}
      <div className="bg-zinc-50 border-b border-zinc-200 py-3.5 px-4 sm:px-6">
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
            {platformFilter === 'all' ? (
              <span className="text-zinc-500 font-medium">Servicios para Redes</span>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('/redes')}
                  className="text-zinc-600 hover:text-[#5e29c8] font-medium cursor-pointer transition-colors"
                >
                  Redes
                </button>
                <span className="text-zinc-300">/</span>
                <span className="text-zinc-900 font-bold capitalize">{platformFilter}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/tarjetas')}
              className="text-zinc-600 hover:text-[#5e29c8] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5 text-[#5e29c8]" />
              <span>Ver tarjetas digitales</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Encabezado Principal de la Página */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-zinc-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-[#5e29c8] mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>
                {platformFilter === 'all'
                  ? settings.socialSectionBadge || 'CRECIMIENTO EN REDES'
                  : `SECCIÓN EXCLUSIVA: ${platformFilter.toUpperCase()}`}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-zinc-950 tracking-tight">
              {getPageTitle()}
            </h1>
            <p className="text-sm text-zinc-600 mt-2 max-w-3xl leading-relaxed">
              {getPageSubtitle()}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <span className="text-xs font-semibold text-purple-900 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-[#5e29c8]" />
              <span>{settings.socialSectionSpeedTag || 'Inicio en 15-45 min'}</span>
            </span>
          </div>
        </div>

        {/* 1. Selector de Plataformas mediante Rutas Reales */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-zinc-100 rounded-2xl max-w-2xl">
            <button
              onClick={() => onNavigate('/redes')}
              className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                platformFilter === 'all'
                  ? 'bg-white text-[#5e29c8] shadow-xs border border-zinc-200 font-black'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Todas las Redes
            </button>
            {platforms.map((plat) => (
              <button
                key={plat.id}
                onClick={() => onNavigate(plat.path)}
                className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                  platformFilter === plat.id
                    ? 'bg-white text-[#5e29c8] shadow-xs border border-zinc-200 font-black'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                {plat.icon}
                <span>{plat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Sub-filtros por Tipo de Servicio: Todos | Seguidores | Likes | Vistas */}
        <div className="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b border-zinc-100">
          <span className="text-xs font-bold text-zinc-500 mr-2">Filtrar por:</span>
          <button
            onClick={() => setActiveTypeFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTypeFilter === 'all'
                ? 'bg-[#5e29c8] text-white shadow-xs'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setActiveTypeFilter('seguidores')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTypeFilter === 'seguidores'
                ? 'bg-[#5e29c8] text-white shadow-xs'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Seguidores</span>
          </button>
          <button
            onClick={() => setActiveTypeFilter('likes')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTypeFilter === 'likes'
                ? 'bg-[#5e29c8] text-white shadow-xs'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span>Likes</span>
          </button>
          <button
            onClick={() => setActiveTypeFilter('vistas')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTypeFilter === 'vistas'
                ? 'bg-[#5e29c8] text-white shadow-xs'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-blue-500" />
            <span>Vistas</span>
          </button>
        </div>

        {/* 3. Cuadrícula de Paquetes de Redes */}
        {filteredPacks.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-zinc-50 border border-zinc-200">
            <p className="text-sm font-bold text-zinc-700">No hay paquetes activos para esta categoría por el momento.</p>
            <button
              onClick={() => setActiveTypeFilter('all')}
              className="mt-3 px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 transition-colors"
            >
              Ver todos los paquetes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredPacks.map((pack) => (
              <div
                key={pack.id}
                className={`rounded-2xl p-5 sm:p-6 bg-white border-2 transition-all flex flex-col justify-between shadow-xs ${
                  pack.popular
                    ? 'border-[#5e29c8] bg-purple-50/20 relative'
                    : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                {pack.popular && (
                  <span className="absolute -top-3 right-5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#5e29c8] text-white">
                    Más Popular
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-700">
                      <div className="p-1 rounded-md bg-zinc-100">
                        {getTypeIcon(pack.type)}
                      </div>
                      <span className="capitalize">{pack.type}</span>
                    </div>
                    <span className="text-[10px] uppercase font-mono font-bold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-md">
                      {pack.platform}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-zinc-950 mb-1.5 leading-snug">
                    {pack.title}
                  </h3>

                  <p className="text-xs text-zinc-600 mb-4 leading-relaxed">
                    {pack.description}
                  </p>

                  {/* Tarifa Total */}
                  <div className="py-2.5 px-3.5 rounded-xl bg-zinc-50 border border-zinc-200 mb-4 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-600 uppercase">Tarifa Total:</span>
                    <span className="text-2xl font-black text-[#5e29c8]">{pack.price}</span>
                  </div>

                  {/* Lista de Beneficios */}
                  <div className="space-y-2 mb-6 text-xs text-zinc-700">
                    {pack.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#5e29c8] shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botón de Orden Directo a WhatsApp */}
                <a
                  href={getWhatsAppUrl(pack)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all text-center cursor-pointer active:scale-95 ${
                    pack.popular
                      ? 'bg-[#5e29c8] hover:bg-[#4f21ab] text-white shadow-md shadow-[#5e29c8]/25'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Pedir por WhatsApp</span>
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Garantías y Proceso Seguro */}
        <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200">
          <h2 className="text-base font-black text-zinc-950 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#5e29c8]" />
            <span>Garantía y Seguridad de ImpulsaNet</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-zinc-600 leading-relaxed">
            <div className="p-3 bg-white rounded-xl border border-zinc-200/80">
              <strong className="text-zinc-900 block mb-1">0% Riesgo de Claves</strong>
              Nunca solicitamos contraseñas, códigos de acceso ni accesos directos. Solo indícanos tu @usuario o enlace.
            </div>
            <div className="p-3 bg-white rounded-xl border border-zinc-200/80">
              <strong className="text-zinc-900 block mb-1">Entrega Gradual y Orgánica</strong>
              Los servicios se distribuyen simulando interacción natural para cuidar tu cuenta y algoritmos.
            </div>
            <div className="p-3 bg-white rounded-xl border border-zinc-200/80">
              <strong className="text-zinc-900 block mb-1">Garantía de Reposición</strong>
              Todos nuestros paquetes cuentan con soporte de garantía para mantener tus métricas estables.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
