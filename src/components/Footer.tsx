import React from 'react';
import { MessageCircle, ArrowUp, Instagram, Youtube, Facebook, Video, MapPin, Mail } from 'lucide-react';
import { AgencySettings } from '../firebase';

interface FooterProps {
  settings: AgencySettings;
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getWhatsAppUrl = () => {
    const phone = (settings.whatsappNumber || '573212515944').replace(/[^0-9]/g, '');
    const message = encodeURIComponent(settings.whatsappDefaultMessage || 'Hola, vi su web y quiero información');
    return `https://wa.me/${phone}?text=${message}`;
  };

  const socialLinks = settings.socialLinks || {
    instagram: 'https://instagram.com/impulsanet.digital',
    tiktok: 'https://tiktok.com/@impulsanet.digital',
    youtube: 'https://youtube.com/@impulsanet',
    facebook: 'https://facebook.com/impulsanet',
  };

  return (
    <footer className="bg-white text-zinc-600 text-sm py-7 border-t border-zinc-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 pb-5 border-b border-zinc-100">
          {/* Logo y descripción */}
          <div
            onClick={() => onNavigate('/')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <img
              src={settings.logoUrl || "https://cdn.phototourl.com/member/2026-10-08-92ac8cdb-f316-40bc-ad16-3f22cb980788.png"}
              alt="ImpulsaNet"
              className="w-10 h-10 object-contain rounded-xl shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-2xs"
            />
            <div>
              <span className="text-base font-black text-zinc-950 block">
                {settings.agencyName || 'ImpulsaNet'}
              </span>
              <span className="text-xs text-zinc-500 block">
                {settings.tagline || 'Tarjetas Virtuales & Servicios para Redes Sociales'}
              </span>
            </div>
          </div>

          {/* Links directos a páginas internas */}
          <div className="flex items-center gap-5 text-sm font-semibold text-zinc-700">
            <button
              onClick={() => onNavigate('/tarjetas')}
              className="hover:text-[#5e29c8] cursor-pointer transition-colors"
            >
              Tarjetas Digitales QR
            </button>
            <button
              onClick={() => onNavigate('/redes')}
              className="hover:text-[#5e29c8] cursor-pointer transition-colors"
            >
              Servicios de Redes
            </button>
          </div>

          {/* Redes Sociales e Iconos */}
          <div className="flex items-center gap-3">
            {socialLinks.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                className="w-8 h-8 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-600 flex items-center justify-center transition-colors shadow-2xs"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {socialLinks.tiktok && (
              <a
                href={socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                title="TikTok"
                className="w-8 h-8 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 flex items-center justify-center transition-colors shadow-2xs"
              >
                <Video className="w-4 h-4" />
              </a>
            )}
            {socialLinks.youtube && (
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                title="YouTube"
                className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors shadow-2xs"
              >
                <Youtube className="w-4 h-4" />
              </a>
            )}
            {socialLinks.facebook && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors shadow-2xs"
              >
                <Facebook className="w-4 h-4" />
              </a>
            )}

            {/* WhatsApp Directo */}
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 transition-colors text-xs"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Créditos y Botón Subir */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 text-zinc-400 text-xs">
          <div>
            © {new Date().getFullYear()} {settings.agencyName || 'ImpulsaNet'}. Todos los derechos reservados.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 hover:text-[#5e29c8] transition-colors cursor-pointer"
            >
              <span>Subir</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
