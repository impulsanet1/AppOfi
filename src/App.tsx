import { useState, useEffect } from 'react';
import {
  doc,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  db,
  auth,
  AgencySettings,
  SocialServicePack,
  DEFAULT_SETTINGS,
  DEFAULT_SOCIAL_SERVICES,
  convertToColombianPrice,
} from './firebase';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { CardsPage } from './components/CardsPage';
import { SocialPage } from './components/SocialPage';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { PwaPrompt } from './components/PwaPrompt';
import { ToastProvider, useToast } from './components/Toast';

function MainApp() {
  const { showToast } = useToast();

  // Settings & Social Services desde Firestore
  const [settings, setSettings] = useState<AgencySettings>(() => {
    const cached = localStorage.getItem('impulsanet_settings_v2');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const whatsappNum = (!parsed.whatsappNumber || parsed.whatsappNumber === '573001234567')
          ? '573212515944'
          : parsed.whatsappNumber;
        return {
          ...parsed,
          whatsappNumber: whatsappNum,
          cardDemoWhatsapp: (!parsed.cardDemoWhatsapp || parsed.cardDemoWhatsapp === '573001234567') ? '573212515944' : parsed.cardDemoWhatsapp,
          cardDemoPhone: (!parsed.cardDemoPhone || parsed.cardDemoPhone.includes('300 123 4567')) ? '+57 321 2515944' : parsed.cardDemoPhone,
          cardsBasicPrice: convertToColombianPrice(parsed.cardsBasicPrice || '$79.000 COP'),
          cardsProPrice: convertToColombianPrice(parsed.cardsProPrice || '$119.000 COP'),
          cardsPrice: convertToColombianPrice(parsed.cardsPrice || '$79.000 COP'),
          logoUrl: parsed.logoUrl || 'https://cdn.phototourl.com/member/2026-10-08-92ac8cdb-f316-40bc-ad16-3f22cb980788.png',
        };
      } catch {
        // fallback
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [socialServices, setSocialServices] = useState<SocialServicePack[]>(() => {
    const cached = localStorage.getItem('impulsanet_social_services_v2');
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as SocialServicePack[];
        return parsed.map((item) => ({
          ...item,
          price: convertToColombianPrice(item.price),
        }));
      } catch {
        // fallback
      }
    }
    return DEFAULT_SOCIAL_SERVICES;
  });

  // Ruta activa de la aplicación (SPA con rutas limpias reales)
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const p = window.location.pathname;
    return p && p.length > 0 ? p : '/';
  });

  const [adminOpen, setAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('impulsanet_admin_auth') === 'true';
  });

  // 1. Manejo de Navegación por Rutas Internas Reales (HTML5 History API)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (path: string) => {
    if (path.startsWith('#')) {
      const el = document.getElementById(path.slice(1));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (path === currentPath) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 2. Detección de Administración: URL (?admin, #admin, /admin) y atajo de teclado (Alt + A)
  useEffect(() => {
    const checkAdminTrigger = () => {
      const search = window.location.search.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const pathname = window.location.pathname.toLowerCase();

      if (
        search.includes('admin') ||
        search.includes('panel') ||
        hash.includes('admin') ||
        pathname === '/admin'
      ) {
        setAdminOpen(true);
        if (pathname === '/admin') {
          window.history.replaceState({}, document.title, '/');
          setCurrentPath('/');
        } else {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };

    checkAdminTrigger();
    window.addEventListener('hashchange', checkAdminTrigger);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.altKey && (e.key === 'a' || e.key === 'A')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'a' || e.key === 'A'))
      ) {
        e.preventDefault();
        setAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkAdminTrigger);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 3. Track Firebase User
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAdminLoggedIn(true);
        sessionStorage.setItem('impulsanet_admin_auth', 'true');
      }
    });
    return () => unsubscribe();
  }, []);

  // 4. Real-time listener para Settings en Firestore
  useEffect(() => {
    const settingsDocRef = doc(db, 'settings', 'general');

    const unsubscribe = onSnapshot(
      settingsDocRef,
      async (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as AgencySettings;
          setSettings(data);
          localStorage.setItem('impulsanet_settings_v2', JSON.stringify(data));
        } else {
          try {
            await setDoc(settingsDocRef, DEFAULT_SETTINGS);
          } catch (err) {
            console.warn('Settings seeding notice:', err);
          }
        }
      },
      (error) => {
        console.warn('Settings snapshot notice:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  // 5. Real-time listener para Servicios de Redes en Firestore
  useEffect(() => {
    const servicesColRef = collection(db, 'social_services');

    const unsubscribe = onSnapshot(
      servicesColRef,
      async (snapshot) => {
        if (!snapshot.empty) {
          const items: SocialServicePack[] = [];
          snapshot.forEach((docSnap) => {
            items.push({ id: docSnap.id, ...docSnap.data() } as SocialServicePack);
          });
          setSocialServices(items);
          localStorage.setItem('impulsanet_social_services_v2', JSON.stringify(items));
        } else {
          try {
            for (const item of DEFAULT_SOCIAL_SERVICES) {
              await setDoc(doc(db, 'social_services', item.id), item);
            }
          } catch (err) {
            console.warn('Social services seeding notice:', err);
          }
        }
      },
      (error) => {
        console.warn('Social services snapshot notice:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Guardar configuración desde el panel de administración
  const handleSaveSettings = async (newSettingsPartial: Partial<AgencySettings>) => {
    const updated = {
      ...settings,
      ...newSettingsPartial,
      updatedAt: new Date().toISOString(),
    };
    setSettings(updated);
    localStorage.setItem('impulsanet_settings_v2', JSON.stringify(updated));

    try {
      await setDoc(doc(db, 'settings', 'general'), updated, { merge: true });
    } catch (err) {
      console.error('Save settings Firestore error:', err);
      throw err;
    }
  };

  // Guardar paquetes de redes desde el panel de administración
  const handleSaveServices = async (newServices: SocialServicePack[]) => {
    const currentIds = new Set(newServices.map((s) => s.id));
    const toDelete = socialServices.filter((s) => !currentIds.has(s.id));

    setSocialServices(newServices);
    localStorage.setItem('impulsanet_social_services_v2', JSON.stringify(newServices));

    try {
      for (const item of toDelete) {
        await deleteDoc(doc(db, 'social_services', item.id));
      }
      for (const svc of newServices) {
        await setDoc(doc(db, 'social_services', svc.id), svc, { merge: true });
      }
    } catch (err) {
      console.error('Save services Firestore error:', err);
      throw err;
    }
  };

  const handleResetDefaults = async () => {
    setSettings(DEFAULT_SETTINGS);
    setSocialServices(DEFAULT_SOCIAL_SERVICES);

    localStorage.setItem('impulsanet_settings_v2', JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem('impulsanet_social_services_v2', JSON.stringify(DEFAULT_SOCIAL_SERVICES));

    try {
      await setDoc(doc(db, 'settings', 'general'), DEFAULT_SETTINGS);
      for (const item of DEFAULT_SOCIAL_SERVICES) {
        await setDoc(doc(db, 'social_services', item.id), item);
      }
    } catch (err) {
      console.warn('Reset sync warning:', err);
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    sessionStorage.setItem('impulsanet_admin_auth', 'true');
  };

  const handleLogout = async () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('impulsanet_admin_auth');
    try {
      await signOut(auth);
    } catch (err) {
      // Ignored
    }
    showToast('info', 'Sesión cerrada');
  };

  // Renderizar la página según la ruta actual
  const renderCurrentRoute = () => {
    const path = currentPath.toLowerCase();

    if (path === '/tarjetas') {
      return <CardsPage settings={settings} onNavigate={handleNavigate} />;
    }

    if (path === '/promos') {
      return (
        <SocialPage
          platformFilter="all"
          isPromosMode={true}
          services={socialServices}
          settings={settings}
          onNavigate={handleNavigate}
        />
      );
    }

    if (path === '/redes/instagram') {
      return (
        <SocialPage
          platformFilter="instagram"
          services={socialServices}
          settings={settings}
          onNavigate={handleNavigate}
        />
      );
    }

    if (path === '/redes/tiktok') {
      return (
        <SocialPage
          platformFilter="tiktok"
          services={socialServices}
          settings={settings}
          onNavigate={handleNavigate}
        />
      );
    }

    if (path === '/redes/youtube') {
      return (
        <SocialPage
          platformFilter="youtube"
          services={socialServices}
          settings={settings}
          onNavigate={handleNavigate}
        />
      );
    }

    if (path === '/redes/facebook') {
      return (
        <SocialPage
          platformFilter="facebook"
          services={socialServices}
          settings={settings}
          onNavigate={handleNavigate}
        />
      );
    }

    if (path === '/redes' || path.startsWith('/redes/')) {
      return (
        <SocialPage
          platformFilter="all"
          services={socialServices}
          settings={settings}
          onNavigate={handleNavigate}
        />
      );
    }

    // Ruta por defecto: Página Principal limpia e intuitiva
    return <HomePage settings={settings} onNavigate={handleNavigate} />;
  };

  return (
    <div className="min-h-screen bg-white text-zinc-950 flex flex-col font-sans selection:bg-[#5e29c8] selection:text-white">
      {/* Encabezado Compartido de ImpulsaNet */}
      <Navbar
        settings={settings}
        currentPath={currentPath}
        onNavigate={handleNavigate}
        onSecretTrigger={() => setAdminOpen(true)}
      />

      {/* Contenido Modular según la Ruta */}
      <main className="flex-1">
        {renderCurrentRoute()}
      </main>

      {/* Footer Compartido de ImpulsaNet */}
      <Footer settings={settings} onNavigate={handleNavigate} />

      {/* Panel de Administración Profesional */}
      <AdminPanel
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        settings={settings}
        services={socialServices}
        onSaveSettings={handleSaveSettings}
        onSaveServices={handleSaveServices}
        onResetDefaults={handleResetDefaults}
        isLoggedIn={isAdminLoggedIn}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />

      {/* Botón flotante discreto visible únicamente para el administrador autenticado */}
      {isAdminLoggedIn && (
        <button
          onClick={() => setAdminOpen(true)}
          className="fixed bottom-5 right-4 z-40 px-3 py-1.5 rounded-xl bg-zinc-950/90 hover:bg-zinc-900 text-white text-[11px] font-bold shadow-lg border border-purple-500/50 backdrop-blur-md flex items-center gap-1.5 cursor-pointer animate-in fade-in transition-all"
          title="Abrir Centro de Edición ImpulsaNet"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span>Editar Sistema</span>
        </button>
      )}

      {/* PWA Prompt */}
      <PwaPrompt />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
