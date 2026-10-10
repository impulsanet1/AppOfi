import React, { useState } from 'react';
import { AgencySettings } from '../firebase';

interface NavbarProps {
  settings: AgencySettings;
  currentPath: string;
  onNavigate: (path: string) => void;
  onSecretTrigger?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  currentPath,
  onNavigate,
  onSecretTrigger,
}) => {
  const [clickCount, setClickCount] = useState(0);

  // Easter egg discreto de respaldo: 5 clics seguidos en el logo para administradores
  const handleLogoClick = () => {
    onNavigate('/');
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount >= 5) {
      setClickCount(0);
      if (onSecretTrigger) {
        onSecretTrigger();
      }
    }

    setTimeout(() => {
      setClickCount(0);
    }, 3000);
  };

  const handleLinkClick = (path: string) => {
    onNavigate(path);
  };

  const isHomeActive = currentPath === '/';
  const isCardsActive = currentPath === '/tarjetas';
  const isSocialActive = currentPath.startsWith('/redes');

  return (
    <header className="sticky top-0 z-40 w-full bg-transparent backdrop-blur-md border-b border-zinc-200/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo (Trigger de 5 clics preservado para abrir admin) */}
        <div
          onClick={handleLogoClick}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
          title="ImpulsaNet - Ir a Inicio"
        >
          <img
            src={settings.logoUrl || "https://cdn.phototourl.com/member/2026-10-08-92ac8cdb-f316-40bc-ad16-3f22cb980788.png"}
            alt="ImpulsaNet"
            className="w-10 h-10 object-contain rounded-xl shadow-xs transition-transform duration-200 group-hover:scale-105"
          />
          <div>
            <span className="text-lg font-black tracking-tight text-zinc-950 flex items-center gap-1">
              {settings.agencyName || 'ImpulsaNet'}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#5e29c8] block -mt-1">
              Tarjetas & Redes
            </span>
          </div>
        </div>

        {/* Enlaces de Rutas Internas Reales (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-zinc-700">
          <button
            onClick={() => handleLinkClick('/')}
            className={`transition-colors hover:text-[#5e29c8] cursor-pointer py-1 ${
              isHomeActive ? 'text-[#5e29c8] font-bold border-b-2 border-[#5e29c8]' : ''
            }`}
          >
            Inicio
          </button>
          <button
            onClick={() => handleLinkClick('/tarjetas')}
            className={`transition-colors hover:text-[#5e29c8] cursor-pointer py-1 ${
              isCardsActive ? 'text-[#5e29c8] font-bold border-b-2 border-[#5e29c8]' : ''
            }`}
          >
            Tarjetas Virtuales
          </button>
          <button
            onClick={() => handleLinkClick('/redes')}
            className={`transition-colors hover:text-[#5e29c8] cursor-pointer py-1 ${
              isSocialActive ? 'text-[#5e29c8] font-bold border-b-2 border-[#5e29c8]' : ''
            }`}
          >
            Servicios para Redes
          </button>
        </nav>
      </div>
    </header>
  );
};
