import React from 'react';
import { MessageCircle, ArrowUp } from 'lucide-react';
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
    const message = encodeURIComponent(settings.whatsappDefaultMessage || '¡Hola ImpulsaNet!');
    return `https://wa.me/${phone}?text=${message}`;
  };

  return (
    <footer className="bg-white border-t border-zinc-200 text-zinc-600 text-xs py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-5 border-b border-zinc-100">
          {/* Logo y descripción */}
          <div
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <img
              src={settings.logoUrl || "https://cdn.phototourl.com/member/2026-10-08-92ac8cdb-f316-40bc-ad16-3f22cb980788.png"}
              alt="ImpulsaNet"
              className="w-8 h-8 object-contain rounded-lg shrink-0 transition-transform duration-200 group-hover:scale-105"
            />
            <div>
              <span className="text-sm font-black text-zinc-950">
                {settings.agencyName || 'ImpulsaNet'}
              </span>
              <span className="text-[10px] text-zinc-500 block -mt-0.5">
                Tarjetas Virtuales & Servicios para Redes Sociales
              </span>
            </div>
          </div>

          {/* Links directos a páginas internas */}
          <div className="flex items-center gap-4 text-xs font-semibold text-zinc-700">
            <button
              onClick={() => onNavigate('/tarjetas')}
              className="hover:text-[#5e29c8] cursor-pointer transition-colors"
            >
              Tarjetas Digitales QR
            </button>
          </div>

          {/* WhatsApp */}
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold border border-zinc-200 transition-colors text-[11px]"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {settings.whatsappNumber === '573212515944' || !settings.whatsappNumber
                ? '+57 321 2515944'
                : `+${settings.whatsappNumber}`}
            </span>
          </a>
        </div>

        {/* Créditos y Botón Subir */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 text-zinc-400 text-[11px]">
          <div>
            © {new Date().getFullYear()} {settings.agencyName || 'ImpulsaNet'}. Todos los derechos reservados.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-[#5e29c8] transition-colors cursor-pointer"
            >
              <span>Subir</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
