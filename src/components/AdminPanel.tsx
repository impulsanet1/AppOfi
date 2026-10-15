import React, { useState, useEffect } from 'react';
import {
  Save,
  RotateCcw,
  X,
  LogIn,
  LogOut,
  CreditCard,
  Plus,
  Trash2,
  MessageCircle,
  TrendingUp,
  Check,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Mail,
  UserCheck,
  HelpCircle,
  AlertCircle,
  Sparkles,
  Globe,
  Search,
  ExternalLink,
  Eye,
  Activity,
  Layout,
  Share2,
  MapPin,
  AtSign,
  Layers,
} from 'lucide-react';
import {
  AgencySettings,
  SocialServicePack,
  SocialPlatform,
  FAQItem,
  auth,
  googleProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  sortSocialServicePacks,
} from '../firebase';
import { useToast } from './Toast';

const ADMIN_EMAIL = 'estebanruiz.12vrgassergio@gmail.com';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AgencySettings;
  services: SocialServicePack[];
  onSaveSettings: (newSettings: Partial<AgencySettings>) => Promise<void>;
  onSaveServices: (newServices: SocialServicePack[]) => Promise<void>;
  onResetDefaults: () => Promise<void>;
  isLoggedIn: boolean;
  onLoginSuccess: () => void;
  onLogout: () => void;
}

type AdminSection = 'brand' | 'cards' | 'social' | 'solutions' | 'seo' | 'faqs' | 'whatsapp' | 'security';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  settings,
  services,
  onSaveSettings,
  onSaveServices,
  onResetDefaults,
  isLoggedIn,
  onLoginSuccess,
  onLogout,
}) => {
  const { showToast } = useToast();

  const [activeSection, setActiveSection] = useState<AdminSection>('brand');
  const [clientIp, setClientIp] = useState<string>('Detectando...');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Acordeón para desplegar / contraer secciones dentro de cada módulo
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'brand-identity': true,
    'brand-hero': true,
    'brand-steps': false,
    'cards-header': true,
    'cards-plans': false,
    'cards-demo': false,
    'social-header': false,
    'social-packs': true,
    'contact-wa': true,
    'contact-social': true,
    'whatsapp-config': true,
    'security-status': true,
  });

  const toggleAccordion = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Fetch IP
  useEffect(() => {
    if (!isOpen) return;
    fetch('https://api.ipify.org?format=json')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.ip) setClientIp(data.ip);
      })
      .catch(() => setClientIp('127.0.0.1 (IP Local)'));
  }, [isOpen]);

  // Verificar resultado de redirección de Google si vino de flujo redirect móvil
  useEffect(() => {
    if (!isOpen) return;
    getRedirectResult(auth)
      .then((result) => {
        if (result && result.user) {
          const userEmail = (result.user.email || '').toLowerCase().trim();
          if (userEmail === ADMIN_EMAIL.toLowerCase().trim()) {
            onLoginSuccess();
            sessionStorage.setItem('impulsanet_admin_auth', 'true');
            showToast('success', 'Bienvenido', 'Acceso verificado con Google');
          } else {
            signOut(auth);
            sessionStorage.removeItem('impulsanet_admin_auth');
            showToast(
              'error',
              'Acceso Denegado',
              `La cuenta "${result.user.email}" no tiene permisos de administrador.`
            );
          }
        }
      })
      .catch((err) => {
        console.warn('Redirect result notice:', err);
      });
  }, [isOpen]);

  // ==========================================
  // ESTADOS DEL MÓDULO 1: TARJETAS VIRTUALES
  // ==========================================
  const [cardsForm, setCardsForm] = useState({
    cardsSectionBadge: settings.cardsSectionBadge || 'MÓDULO 1: TARJETAS VIRTUALES',
    cardsSectionTitle: settings.cardsSectionTitle || 'Tarjetas Virtuales con Código QR & Enlace Web',
    cardsSectionSubtitle: settings.cardsSectionSubtitle || '100% digitales. Comparte tu contacto, WhatsApp, redes y catálogo en 1 toque. Sin costos mensuales.',
    cardsDeliveryTag: settings.cardsDeliveryTag || '● Entrega en 24 horas',
    cardsStartingPrice: settings.cardsStartingPrice || '$79.000 COP',
    packNegocioPrice: (settings.packNegocioPrice && settings.packNegocioPrice !== '$139.000 COP') ? settings.packNegocioPrice : '$80.000 COP',
    solution1Title: settings.solution1Title || 'Tarjeta Digital con QR',

    // Plan 1: Básica
    cardPlan1Badge: settings.cardPlan1Badge || 'Plan Estándar',
    cardPlan1Title: (settings.cardPlan1Title && !/tarjeta (virtual|digital) (est[aá]ndar|b[aá]sica)/i.test(settings.cardPlan1Title.trim())) ? settings.cardPlan1Title : 'Tarjeta Básica',
    cardsBasicPrice: settings.cardsBasicPrice || '$79.000 COP',
    cardPlan1ButtonText: settings.cardPlan1ButtonText || 'Pedir Tarjeta',
    cardPlan1Features: (!settings.cardPlan1Features || settings.cardPlan1Features.some(f => /^(item|feat|nueva)/i.test(f.trim()))) ? [
      'Tarjeta con tu logo y colores',
      'Enlace web propio',
      'QR descargable en PNG y PDF',
      'Botón de WhatsApp y redes',
      'Pago único'
    ] : settings.cardPlan1Features,

    // Plan 2: Pro
    cardPlan2Badge: settings.cardPlan2Badge || 'Comercial / Con Catálogo',
    cardPlan2Title: settings.cardPlan2Title || 'Tarjeta Virtual Pro',
    cardsProPrice: settings.cardsProPrice || '$119.000 COP',
    cardPlan2ButtonText: settings.cardPlan2ButtonText || 'Pedir Tarjeta Pro',
    cardPlan2Features: (!settings.cardPlan2Features || settings.cardPlan2Features.some(f => /^(item|feat|nueva)/i.test(f.trim()))) ? [
      'Todo lo del Estándar',
      'Catálogo de productos o servicios',
      'Botón para guardar tu contacto',
      'Cambios de información durante 1 año'
    ] : settings.cardPlan2Features,

    // Demo Interactivo
    cardDemoName: (!settings.cardDemoName || /carlos\s*g[oó]mez/i.test(settings.cardDemoName)) ? 'Sergio Vargas' : settings.cardDemoName,
    cardDemoRole: settings.cardDemoRole || 'Emprendedor & Asesor Digital',
    cardDemoCompany: settings.cardDemoCompany || 'ImpulsaNet Studio',
    cardDemoPhone: settings.cardDemoPhone || '+57 321 2515944',
    cardDemoWhatsapp: settings.cardDemoWhatsapp || '573212515944',
    cardsDemoUrl: settings.cardsDemoUrl || 'https://impulsanet.digital/demo-card',
  });

  // ==========================================
  // ESTADOS DEL MÓDULO 2: REDES SOCIALES
  // ==========================================
  const [socialHeadersForm, setSocialHeadersForm] = useState({
    socialSectionBadge: settings.socialSectionBadge || 'CRECIMIENTO EN REDES',
    socialSectionTitle: settings.socialSectionTitle || 'Seguidores, Likes y Vistas para tus Redes',
    socialSectionSubtitle: settings.socialSectionSubtitle || 'Impulsa tus métricas, credibilidad y alcance algorítmico sin compartir contraseñas.',
    socialSectionSpeedTag: settings.socialSectionSpeedTag || 'Entrega habitual en 30 minutos · máximo 4 horas',
    socialStartingPrice: settings.socialStartingPrice || '$5.000 COP',
    solution2Title: settings.solution2Title || 'Servicios para Redes Sociales',
  });

  // ==========================================
  // ESTADOS DE SOLUCIONES PRINCIPALES (INICIO)
  // ==========================================
  const [solutionsForm, setSolutionsForm] = useState({
    solutionsSectionTitle: settings.solutionsSectionTitle || 'Nuestras Soluciones Principales',
    solutionsSectionSubtitle: settings.solutionsSectionSubtitle || 'Explora las demostraciones y los catálogos con precios claros en pesos colombianos.',
    solution1Title: settings.solution1Title || 'Tarjeta Digital con QR',
    solution1Badge: settings.solution1Badge || 'Destacado',
    solution1Description: settings.solution1Description || 'Perfiles interactivos con QR permanente, WhatsApp, catálogo y ubicación.',
    solution2Title: settings.solution2Title || 'Servicios para Redes Sociales',
    solution2Badge: settings.solution2Badge || 'Crecimiento',
    solution2Description: settings.solution2Description || 'Seguidores, likes y reproducciones para tus redes sin contraseñas.',
    solution3Title: settings.solution3Title || 'Pack Negocio: Tarjeta Pro + 1.000 seguidores de Instagram',
    solution3Badge: settings.solution3Badge || 'Pack Negocio',
    solution3Description: settings.solution3Description || 'El paquete integral para presentar tu marca y acelerar tu Instagram al mismo tiempo.',
    packNegocioPrice: (settings.packNegocioPrice && settings.packNegocioPrice !== '$139.000 COP') ? settings.packNegocioPrice : '$80.000 COP',
  });
  const [savingSolutions, setSavingSolutions] = useState(false);

  // 5. Configuración SEO Dinámica
  const [seoForm, setSeoForm] = useState({
    seoBusinessName: settings.seoBusinessName || 'ImpulsaNet - Agencia Digital & Tarjetas Interactivas',
    seoDescription: settings.seoDescription || 'Agencia de servicios digitales en Colombia. Tarjetas interactivas con QR de pago único y servicios de crecimiento para redes sociales con entrega rápida.',
    seoKeywords: settings.seoKeywords || 'tarjetas digitales con QR Colombia, comprar seguidores instagram colombia, tarjetas interactivas nfc, servicios para redes sociales, impulsanet',
  });
  const [savingSeo, setSavingSeo] = useState(false);

  const [servicesList, setServicesList] = useState<SocialServicePack[]>(services);
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('instagram');
  const [adminTypeFilter, setAdminTypeFilter] = useState<'all' | 'seguidores' | 'likes' | 'vistas'>('all');
  const [adminSearchQuery, setAdminSearchQuery] = useState('');

  // Modal para agregar paquete de redes
  const [showAddPackModal, setShowAddPackModal] = useState(false);
  const [newPack, setNewPack] = useState<{
    platform: SocialPlatform;
    type: 'seguidores' | 'likes' | 'vistas';
    title: string;
    quantity: string;
    price: string;
    description: string;
    feature1: string;
    feature2: string;
    feature3: string;
  }>({
    platform: 'instagram',
    type: 'seguidores',
    title: '',
    quantity: '',
    price: '',
    description: '',
    feature1: 'Sin contraseñas requeridas',
    feature2: 'Entrega habitual en 30 minutos · máximo 4 horas',
    feature3: 'Garantía activa de reposición',
  });

  // 1. Configuración Inicio & Marca
  const [brandForm, setBrandForm] = useState({
    agencyName: settings.agencyName || 'ImpulsaNet',
    tagline: settings.tagline || 'Tarjetas Virtuales & Crecimiento en Redes Sociales',
    logoUrl: settings.logoUrl || 'https://cdn.phototourl.com/member/2026-10-08-92ac8cdb-f316-40bc-ad16-3f22cb980788.png',
    heroTitle: settings.heroTitle || 'Tu negocio en un QR. Tus redes, en crecimiento.',
    heroDescription: settings.heroDescription || 'Tarjeta digital con tu WhatsApp, catálogo y ubicación, y servicios para impulsar tus redes con seguidores, likes y vistas.',
    heroBadge: (settings.heroBadge && !/agencia digital colombia/i.test(settings.heroBadge)) ? settings.heroBadge : '',
    heroPrimaryBtnText: settings.heroPrimaryBtnText || 'Ver tarjetas',
    heroSecondaryBtnText: settings.heroSecondaryBtnText || 'Servicios para redes',
    bannerNotice: settings.bannerNotice || '⚡ Entregas el mismo día en Colombia · Pagos con Nequi, Daviplata y Bancolombia',
    step1Title: settings.step1Title || 'Elige lo que necesitas',
    step1Description: settings.step1Description || 'Una tarjeta digital con QR para tu negocio, un impulso para tus redes (seguidores, likes o vistas), o ambos en un paquete.',
    step2Title: settings.step2Title || 'Nos envías tus datos',
    step2Description: settings.step2Description || 'Para la tarjeta, nombre, logo, WhatsApp y ubicación; para redes, solo tu usuario o enlace (nunca contraseñas). Pagas por Nequi o transferencia.',
    step3Title: settings.step3Title || 'Lo recibes',
    step3Description: settings.step3Description || 'Tu tarjeta lista el mismo día, con enlace y QR en PNG y PDF; tu impulso de redes entre 1 y 4 horas con garantía de 30 días.',
  });
  const [savingBrand, setSavingBrand] = useState(false);

  // Configuración Contacto & Canales Oficiales
  const [contactForm, setContactForm] = useState({
    agencyName: settings.agencyName || 'ImpulsaNet',
    whatsappNumber: settings.whatsappNumber || '573212515944',
    whatsappDefaultMessage: settings.whatsappDefaultMessage || 'Hola, vi su web y quiero información',
    contactEmail: settings.contactEmail || 'contacto@impulsanet.digital',
    contactLocation: settings.contactLocation || 'Colombia · Envíos digitales a todo el país',
    logoUrl: settings.logoUrl || 'https://cdn.phototourl.com/member/2026-10-08-92ac8cdb-f316-40bc-ad16-3f22cb980788.png',
    instagram: settings.socialLinks?.instagram || 'https://instagram.com/impulsanet.digital',
    tiktok: settings.socialLinks?.tiktok || 'https://tiktok.com/@impulsanet.digital',
    youtube: settings.socialLinks?.youtube || 'https://youtube.com/@impulsanet',
    facebook: settings.socialLinks?.facebook || 'https://facebook.com/impulsanet',
  });
  const [savingContact, setSavingContact] = useState(false);

  // Sincronizar datos al cambiar settings
  useEffect(() => {
    setCardsForm({
      cardsSectionBadge: settings.cardsSectionBadge || 'MÓDULO 1: TARJETAS VIRTUALES',
      cardsSectionTitle: settings.cardsSectionTitle || 'Tarjetas Virtuales con Código QR & Enlace Web',
      cardsSectionSubtitle: settings.cardsSectionSubtitle || '100% digitales. Comparte tu contacto, WhatsApp, redes y catálogo en 1 toque. Sin costos mensuales.',
      cardsDeliveryTag: settings.cardsDeliveryTag || '● Entrega en 24 horas',
      cardsStartingPrice: settings.cardsStartingPrice || '$79.000 COP',
      packNegocioPrice: (settings.packNegocioPrice && settings.packNegocioPrice !== '$139.000 COP') ? settings.packNegocioPrice : '$80.000 COP',
      solution1Title: settings.solution1Title || 'Tarjeta Digital con QR',

      cardPlan1Badge: settings.cardPlan1Badge || 'Plan Estándar',
      cardPlan1Title: (settings.cardPlan1Title && !/tarjeta (virtual|digital) (est[aá]ndar|b[aá]sica)/i.test(settings.cardPlan1Title.trim())) ? settings.cardPlan1Title : 'Tarjeta Básica',
      cardsBasicPrice: settings.cardsBasicPrice || '$79.000 COP',
      cardPlan1ButtonText: settings.cardPlan1ButtonText || 'Pedir Tarjeta',
      cardPlan1Features: (!settings.cardPlan1Features || settings.cardPlan1Features.some(f => /^(item|feat|nueva)/i.test(f.trim()))) ? [
        'Tarjeta con tu logo y colores',
        'Enlace web propio',
        'QR descargable en PNG y PDF',
        'Botón de WhatsApp y redes',
        'Pago único'
      ] : settings.cardPlan1Features,
      cardPlan2Badge: settings.cardPlan2Badge || 'Comercial / Con Catálogo',
      cardPlan2Title: settings.cardPlan2Title || 'Tarjeta Virtual Pro',
      cardsProPrice: settings.cardsProPrice || '$119.000 COP',
      cardPlan2ButtonText: settings.cardPlan2ButtonText || 'Pedir Tarjeta Pro',
      cardPlan2Features: (!settings.cardPlan2Features || settings.cardPlan2Features.some(f => /^(item|feat|nueva)/i.test(f.trim()))) ? [
        'Todo lo del Estándar',
        'Catálogo de productos o servicios',
        'Botón para guardar tu contacto',
        'Cambios de información durante 1 año'
      ] : settings.cardPlan2Features,
      cardDemoName: (!settings.cardDemoName || /carlos\s*g[oó]mez/i.test(settings.cardDemoName)) ? 'Sergio Vargas' : settings.cardDemoName,
      cardDemoRole: settings.cardDemoRole || 'Emprendedor & Asesor Digital',
      cardDemoCompany: settings.cardDemoCompany || 'ImpulsaNet Studio',
      cardDemoPhone: settings.cardDemoPhone || '+57 321 2515944',
      cardDemoWhatsapp: settings.cardDemoWhatsapp || '573212515944',
      cardsDemoUrl: settings.cardsDemoUrl || 'https://impulsanet.digital/demo-card',
    });

    setSocialHeadersForm({
      socialSectionBadge: settings.socialSectionBadge || 'CRECIMIENTO EN REDES',
      socialSectionTitle: settings.socialSectionTitle || 'Seguidores, Likes y Vistas para tus Redes',
      socialSectionSubtitle: settings.socialSectionSubtitle || 'Impulsa tus métricas, credibilidad y alcance algorítmico sin compartir contraseñas.',
      socialSectionSpeedTag: settings.socialSectionSpeedTag || 'Entrega habitual en 30 minutos · máximo 4 horas',
      socialStartingPrice: settings.socialStartingPrice || '$5.000 COP',
      solution2Title: settings.solution2Title || 'Servicios para Redes Sociales',
    });

    setSolutionsForm({
      solutionsSectionTitle: settings.solutionsSectionTitle || 'Nuestras Soluciones Principales',
      solutionsSectionSubtitle: settings.solutionsSectionSubtitle || 'Explora las demostraciones y los catálogos con precios claros en pesos colombianos.',
      solution1Title: settings.solution1Title || 'Tarjeta Digital con QR',
      solution1Badge: settings.solution1Badge || 'Destacado',
      solution1Description: settings.solution1Description || 'Perfiles interactivos con QR permanente, WhatsApp, catálogo y ubicación.',
      solution2Title: settings.solution2Title || 'Servicios para Redes Sociales',
      solution2Badge: settings.solution2Badge || 'Crecimiento',
      solution2Description: settings.solution2Description || 'Seguidores, likes y reproducciones para tus redes sin contraseñas.',
      solution3Title: settings.solution3Title || 'Pack Negocio: Tarjeta Pro + 1.000 seguidores de Instagram',
      solution3Badge: settings.solution3Badge || 'Pack Negocio',
      solution3Description: settings.solution3Description || 'El paquete integral para presentar tu marca y acelerar tu Instagram al mismo tiempo.',
      packNegocioPrice: (settings.packNegocioPrice && settings.packNegocioPrice !== '$139.000 COP') ? settings.packNegocioPrice : '$80.000 COP',
    });

    setBrandForm({
      agencyName: settings.agencyName || 'ImpulsaNet',
      tagline: settings.tagline || 'Tarjetas Virtuales & Crecimiento en Redes Sociales',
      logoUrl: settings.logoUrl || 'https://cdn.phototourl.com/member/2026-10-08-92ac8cdb-f316-40bc-ad16-3f22cb980788.png',
      heroTitle: settings.heroTitle || 'Tu negocio en un QR. Tus redes, en crecimiento.',
      heroDescription: settings.heroDescription || 'Tarjeta digital con tu WhatsApp, catálogo y ubicación, y servicios para impulsar tus redes con seguidores, likes y vistas.',
      heroBadge: (settings.heroBadge && !/agencia digital colombia/i.test(settings.heroBadge)) ? settings.heroBadge : '',
      heroPrimaryBtnText: settings.heroPrimaryBtnText || 'Ver tarjetas',
      heroSecondaryBtnText: settings.heroSecondaryBtnText || 'Servicios para redes',
      bannerNotice: settings.bannerNotice || '⚡ Entregas el mismo día en Colombia · Pagos con Nequi, Daviplata y Bancolombia',
      step1Title: settings.step1Title || 'Elige lo que necesitas',
      step1Description: settings.step1Description || 'Una tarjeta digital con QR para tu negocio, un impulso para tus redes (seguidores, likes o vistas), o ambos en un paquete.',
      step2Title: settings.step2Title || 'Nos envías tus datos',
      step2Description: settings.step2Description || 'Para la tarjeta, nombre, logo, WhatsApp y ubicación; para redes, solo tu usuario o enlace (nunca contraseñas). Pagas por Nequi o transferencia.',
      step3Title: settings.step3Title || 'Lo recibes',
      step3Description: settings.step3Description || 'Tu tarjeta lista el mismo día, con enlace y QR en PNG y PDF; tu impulso de redes entre 1 y 4 horas con garantía de 30 días.',
    });

    setContactForm({
      agencyName: settings.agencyName || 'ImpulsaNet',
      whatsappNumber: settings.whatsappNumber || '573212515944',
      whatsappDefaultMessage: settings.whatsappDefaultMessage || 'Hola, vi su web y quiero información',
      contactEmail: settings.contactEmail || 'contacto@impulsanet.digital',
      contactLocation: settings.contactLocation || 'Colombia · Envíos digitales a todo el país',
      logoUrl: settings.logoUrl || 'https://cdn.phototourl.com/member/2026-10-08-92ac8cdb-f316-40bc-ad16-3f22cb980788.png',
      instagram: settings.socialLinks?.instagram || 'https://instagram.com/impulsanet.digital',
      tiktok: settings.socialLinks?.tiktok || 'https://tiktok.com/@impulsanet.digital',
      youtube: settings.socialLinks?.youtube || 'https://youtube.com/@impulsanet',
      facebook: settings.socialLinks?.facebook || 'https://facebook.com/impulsanet',
    });

    setSeoForm({
      seoBusinessName: settings.seoBusinessName || 'ImpulsaNet - Agencia Digital & Tarjetas Interactivas',
      seoDescription: settings.seoDescription || 'Agencia de servicios digitales en Colombia. Tarjetas interactivas con QR de pago único y servicios de crecimiento para redes sociales con entrega rápida.',
      seoKeywords: settings.seoKeywords || 'tarjetas digitales con QR Colombia, comprar seguidores instagram colombia, tarjetas interactivas nfc, servicios para redes sociales, impulsanet',
    });

    if (settings.faqs && Array.isArray(settings.faqs) && settings.faqs.length > 0) {
      setFaqsForm(settings.faqs);
    }
  }, [settings]);

  useEffect(() => {
    setServicesList(services);
  }, [services]);

  // ==========================================
  // ESTADOS DEL MÓDULO PREGUNTAS FRECUENTES (FAQ)
  // ==========================================
  const [faqsForm, setFaqsForm] = useState<FAQItem[]>(() => {
    if (settings.faqs && Array.isArray(settings.faqs) && settings.faqs.length > 0) {
      return settings.faqs;
    }
    return [
      {
        question: '¿Necesitan mi contraseña?',
        answer: 'No. Nunca te pedimos contraseñas ni acceso a tu cuenta. Somos una tienda virtual: solo necesitamos el enlace o el usuario público de tu perfil o publicación.',
      },
      {
        question: '¿Cuánto tardan en llegar los seguidores, likes o vistas?',
        answer: 'El tiempo estimado es de 1 a 4 horas. Normalmente llegan en unos 30 minutos.',
      },
      {
        question: '¿Tienen garantía?',
        answer: 'Sí. La mayoría de nuestros servicios incluyen 30 días de garantía. Si tienes algún problema con tu pedido, escríbenos por WhatsApp y lo revisamos.',
      },
      {
        question: '¿Qué son las tarjetas digitales y cómo funcionan?',
        answer: 'Son tarjetas de presentación virtuales con código QR. Quien la escanea ve tu información y tus enlaces (WhatsApp, redes, ubicación, catálogo) al instante, sin papel y sin imprimir de nuevo cuando cambias algo.',
      },
    ];
  });
  const [savingFaqs, setSavingFaqs] = useState(false);

  const handleAddFaq = () => {
    setFaqsForm((prev) => [
      ...prev,
      {
        question: '¿Nueva pregunta frecuente?',
        answer: 'Respuesta clara y detallada para orientar a tus clientes antes de comprar.',
      },
    ]);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqsForm((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    setFaqsForm((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSaveFaqs = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingFaqs(true);
    try {
      await onSaveSettings({ faqs: faqsForm });
      showToast('success', 'Preguntas Frecuentes Guardadas', 'Tus preguntas ahora están publicadas y visibles en el sitio web.');
    } catch (err) {
      showToast('error', 'Error al guardar preguntas', String(err));
    } finally {
      setSavingFaqs(false);
    }
  };

  // Auth Handler: Exclusivo con Google y Cuenta Autorizada
  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      let user = null;
      try {
        const result = await signInWithPopup(auth, googleProvider);
        user = result.user;
      } catch (popupErr: any) {
        const code = popupErr?.code || '';
        if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
          showToast('info', 'Inicio cancelado', 'Se cerró la ventana de Google.');
          return;
        }
        if (code === 'auth/popup-blocked') {
          await signInWithRedirect(auth, googleProvider);
          return;
        }
        throw popupErr;
      }

      if (!user) return;

      const userEmail = (user.email || '').toLowerCase().trim();
      if (userEmail === ADMIN_EMAIL.toLowerCase().trim()) {
        onLoginSuccess();
        sessionStorage.setItem('impulsanet_admin_auth', 'true');
        showToast('success', 'Bienvenido', 'Acceso verificado con Google');
      } else {
        await signOut(auth);
        sessionStorage.removeItem('impulsanet_admin_auth');
        showToast(
          'error',
          'Acceso Denegado',
          `La cuenta "${user.email}" no tiene permisos de administrador. Solo la cuenta autorizada puede ingresar.`
        );
      }
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      const code = err?.code || '';
      if (code === 'auth/unauthorized-domain') {
        showToast(
          'error',
          'Dominio no autorizado',
          `El dominio ${window.location.hostname} debe estar en Authorized Domains de Firebase Auth.`
        );
      } else {
        showToast('error', 'Error con Google', err?.message || 'No se pudo completar el inicio de sesión.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  // ==========================================
  // GUARDAR: MÓDULO TARJETAS VIRTUALES
  // ==========================================
  const [savingCards, setSavingCards] = useState(false);
  const handleSaveCards = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCards(true);
    try {
      await onSaveSettings({
        cardsSectionBadge: cardsForm.cardsSectionBadge,
        cardsSectionTitle: cardsForm.cardsSectionTitle,
        cardsSectionSubtitle: cardsForm.cardsSectionSubtitle,
        cardsDeliveryTag: cardsForm.cardsDeliveryTag,
        cardsPrice: cardsForm.cardsBasicPrice,
        cardsStartingPrice: cardsForm.cardsStartingPrice,
        packNegocioPrice: cardsForm.packNegocioPrice,
        solution1Title: cardsForm.solution1Title || undefined,
        cardPlan1Badge: cardsForm.cardPlan1Badge,
        cardPlan1Title: cardsForm.cardPlan1Title,
        cardsBasicPrice: cardsForm.cardsBasicPrice,
        cardPlan1ButtonText: cardsForm.cardPlan1ButtonText,
        cardPlan1Features: cardsForm.cardPlan1Features,
        cardPlan2Badge: cardsForm.cardPlan2Badge,
        cardPlan2Title: cardsForm.cardPlan2Title,
        cardsProPrice: cardsForm.cardsProPrice,
        cardPlan2ButtonText: cardsForm.cardPlan2ButtonText,
        cardPlan2Features: cardsForm.cardPlan2Features,
        cardDemoName: cardsForm.cardDemoName,
        cardDemoRole: cardsForm.cardDemoRole,
        cardDemoCompany: cardsForm.cardDemoCompany,
        cardDemoPhone: cardsForm.cardDemoPhone,
        cardDemoWhatsapp: cardsForm.cardDemoWhatsapp,
        cardsDemoUrl: cardsForm.cardsDemoUrl,
      });
      showToast('success', 'Módulo de Tarjetas Guardado', 'Todos los textos, precios y características actualizados.');
    } catch (err) {
      showToast('error', 'Error al guardar tarjetas', String(err));
    } finally {
      setSavingCards(false);
    }
  };

  // Guardados individuales de submódulos de Tarjetas
  const handleSaveCardsHeader = async () => {
    try {
      await onSaveSettings({
        cardsSectionBadge: cardsForm.cardsSectionBadge,
        cardsSectionTitle: cardsForm.cardsSectionTitle,
        cardsSectionSubtitle: cardsForm.cardsSectionSubtitle,
        cardsDeliveryTag: cardsForm.cardsDeliveryTag,
        cardsStartingPrice: cardsForm.cardsStartingPrice,
        packNegocioPrice: cardsForm.packNegocioPrice,
        solution1Title: cardsForm.solution1Title || undefined,
      });
      showToast('success', 'Encabezado de Tarjetas Guardado', 'Título, subtítulo y precios actualizados.');
    } catch (err) {
      showToast('error', 'Error al guardar encabezado', String(err));
    }
  };

  const handleSavePlan1 = async () => {
    try {
      await onSaveSettings({
        cardPlan1Badge: cardsForm.cardPlan1Badge,
        cardPlan1Title: cardsForm.cardPlan1Title,
        cardsBasicPrice: cardsForm.cardsBasicPrice,
        cardsPrice: cardsForm.cardsBasicPrice,
        cardPlan1ButtonText: cardsForm.cardPlan1ButtonText,
        cardPlan1Features: cardsForm.cardPlan1Features,
      });
      showToast('success', 'Plan 1 Guardado', 'Tarjeta Básica actualizada.');
    } catch (err) {
      showToast('error', 'Error al guardar Plan 1', String(err));
    }
  };

  const handleSavePlan2 = async () => {
    try {
      await onSaveSettings({
        cardPlan2Badge: cardsForm.cardPlan2Badge,
        cardPlan2Title: cardsForm.cardPlan2Title,
        cardsProPrice: cardsForm.cardsProPrice,
        cardPlan2ButtonText: cardsForm.cardPlan2ButtonText,
        cardPlan2Features: cardsForm.cardPlan2Features,
      });
      showToast('success', 'Plan 2 Guardado', 'Tarjeta Pro actualizada.');
    } catch (err) {
      showToast('error', 'Error al guardar Plan 2', String(err));
    }
  };

  const handleSavePackNegocio = async () => {
    try {
      await onSaveSettings({
        packNegocioPrice: cardsForm.packNegocioPrice,
      });
      showToast('success', 'Pack Negocio Guardado', `Precio de Pack Negocio actualizado a ${cardsForm.packNegocioPrice}.`);
    } catch (err) {
      showToast('error', 'Error al guardar Pack Negocio', String(err));
    }
  };

  const handleSaveDemoCard = async () => {
    try {
      await onSaveSettings({
        cardDemoName: cardsForm.cardDemoName,
        cardDemoRole: cardsForm.cardDemoRole,
        cardDemoCompany: cardsForm.cardDemoCompany,
        cardDemoPhone: cardsForm.cardDemoPhone,
        cardDemoWhatsapp: cardsForm.cardDemoWhatsapp,
        cardsDemoUrl: cardsForm.cardsDemoUrl,
      });
      showToast('success', 'Tarjeta Demo Guardada', 'Datos de muestra y enlace QR actualizados.');
    } catch (err) {
      showToast('error', 'Error al guardar tarjeta demo', String(err));
    }
  };

  // Helpers para editar características de los planes
  const handleUpdatePlanFeature = (planNum: 1 | 2, index: number, value: string) => {
    if (planNum === 1) {
      const updated = [...cardsForm.cardPlan1Features];
      updated[index] = value;
      setCardsForm({ ...cardsForm, cardPlan1Features: updated });
    } else {
      const updated = [...cardsForm.cardPlan2Features];
      updated[index] = value;
      setCardsForm({ ...cardsForm, cardPlan2Features: updated });
    }
  };

  const handleAddPlanFeature = (planNum: 1 | 2) => {
    if (planNum === 1) {
      setCardsForm({
        ...cardsForm,
        cardPlan1Features: [...cardsForm.cardPlan1Features, 'Nueva característica']
      });
    } else {
      setCardsForm({
        ...cardsForm,
        cardPlan2Features: [...cardsForm.cardPlan2Features, 'Nueva característica']
      });
    }
  };

  const handleRemovePlanFeature = (planNum: 1 | 2, index: number) => {
    if (planNum === 1) {
      setCardsForm({
        ...cardsForm,
        cardPlan1Features: cardsForm.cardPlan1Features.filter((_, i) => i !== index)
      });
    } else {
      setCardsForm({
        ...cardsForm,
        cardPlan2Features: cardsForm.cardPlan2Features.filter((_, i) => i !== index)
      });
    }
  };

  // ==========================================
  // GUARDAR: MÓDULO REDES SOCIALES
  // ==========================================
  const [savingSocialHeaders, setSavingSocialHeaders] = useState(false);
  const handleSaveSocialHeaders = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSocialHeaders(true);
    try {
      await onSaveSettings({
        socialSectionBadge: socialHeadersForm.socialSectionBadge,
        socialSectionTitle: socialHeadersForm.socialSectionTitle,
        socialSectionSubtitle: socialHeadersForm.socialSectionSubtitle,
        socialSectionSpeedTag: socialHeadersForm.socialSectionSpeedTag,
        socialStartingPrice: socialHeadersForm.socialStartingPrice,
        solution2Title: socialHeadersForm.solution2Title || undefined,
      });
      showToast('success', 'Encabezado de Redes Guardado', 'Título y subtítulo actualizados en la web.');
    } catch (err) {
      showToast('error', 'Error al guardar encabezados', String(err));
    } finally {
      setSavingSocialHeaders(false);
    }
  };

  // ==========================================
  // GUARDAR: SOLUCIONES PRINCIPALES (INICIO)
  // ==========================================
  const handleSaveSolutions = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingSolutions(true);
    try {
      await onSaveSettings({
        solutionsSectionTitle: solutionsForm.solutionsSectionTitle,
        solutionsSectionSubtitle: solutionsForm.solutionsSectionSubtitle,
        solution1Title: solutionsForm.solution1Title,
        solution1Badge: solutionsForm.solution1Badge,
        solution1Description: solutionsForm.solution1Description,
        solution2Title: solutionsForm.solution2Title,
        solution2Badge: solutionsForm.solution2Badge,
        solution2Description: solutionsForm.solution2Description,
        solution3Title: solutionsForm.solution3Title,
        solution3Badge: solutionsForm.solution3Badge,
        solution3Description: solutionsForm.solution3Description,
        packNegocioPrice: solutionsForm.packNegocioPrice,
      });
      showToast('success', 'Soluciones Actualizadas', 'Los títulos y contenidos de todas las soluciones se guardaron correctamente.');
    } catch (err) {
      console.error(err);
      showToast('error', 'Error al Guardar', 'No se pudieron guardar las soluciones.');
    } finally {
      setSavingSolutions(false);
    }
  };

  // ==========================================
  // GUARDAR: SEO & METADATOS DINÁMICOS
  // ==========================================
  const handleSaveSeo = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingSeo(true);
    try {
      await onSaveSettings({
        seoBusinessName: seoForm.seoBusinessName,
        seoDescription: seoForm.seoDescription,
        seoKeywords: seoForm.seoKeywords,
      });
      showToast('success', 'SEO Actualizado', 'Las etiquetas meta dinámicas y datos estructurados se sincronizaron con éxito.');
    } catch (err) {
      console.error(err);
      showToast('error', 'Error al Guardar SEO', 'No se pudieron guardar las configuraciones de SEO.');
    } finally {
      setSavingSeo(false);
    }
  };

  const handleUpdatePackField = (id: string, field: keyof SocialServicePack, value: any) => {
    setServicesList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleUpdatePackFeature = (packId: string, featureIndex: number, value: string) => {
    setServicesList((prev) =>
      prev.map((s) => {
        if (s.id === packId) {
          const feats = [...s.features];
          feats[featureIndex] = value;
          return { ...s, features: feats };
        }
        return s;
      })
    );
  };

  const handleAddPackFeature = (packId: string) => {
    setServicesList((prev) =>
      prev.map((s) => {
        if (s.id === packId) {
          return { ...s, features: [...s.features, 'Garantía y soporte directo'] };
        }
        return s;
      })
    );
  };

  const handleRemovePackFeature = (packId: string, featureIndex: number) => {
    setServicesList((prev) =>
      prev.map((s) => {
        if (s.id === packId) {
          return { ...s, features: s.features.filter((_, i) => i !== featureIndex) };
        }
        return s;
      })
    );
  };

  const handleTogglePackPopular = (id: string) => {
    setServicesList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, popular: !s.popular } : s))
    );
  };

  const handleTogglePackActive = (id: string) => {
    setServicesList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: s.active === false ? true : false } : s))
    );
  };

  const handleDeletePack = (id: string) => {
    if (window.confirm('¿Eliminar este paquete de la tienda?')) {
      const updated = servicesList.filter((s) => s.id !== id);
      setServicesList(updated);
      onSaveServices(updated);
      showToast('info', 'Paquete eliminado');
    }
  };

  const handleSaveSinglePack = async (packId: string) => {
    const pack = servicesList.find((s) => s.id === packId);
    if (!pack) return;
    try {
      await onSaveServices(servicesList);
      showToast('success', `Paquete Guardado`, `"${pack.title}" actualizado con éxito.`);
    } catch (err) {
      showToast('error', 'Error al guardar paquete', String(err));
    }
  };

  const handleSaveAllServices = async () => {
    try {
      await onSaveServices(servicesList);
      showToast('success', 'Packs de Redes Guardados', 'Todos los paquetes, precios y descripciones actualizados.');
    } catch (err) {
      showToast('error', 'Error al guardar paquetes', String(err));
    }
  };

  const handleCreateNewPack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPack.title || !newPack.price) {
      showToast('error', 'Faltan campos', 'Ingresa título y precio.');
      return;
    }

    const created: SocialServicePack = {
      id: `${newPack.platform}_${Date.now()}`,
      platform: newPack.platform,
      type: newPack.type,
      title: newPack.title.trim(),
      quantity: newPack.quantity.trim() || newPack.title.trim(),
      price: newPack.price.trim(),
      description: newPack.description.trim() || 'Servicio de alta calidad y entrega rápida.',
      features: [newPack.feature1, newPack.feature2, newPack.feature3].filter(Boolean),
      popular: false,
      active: true,
    };

    const updated = [created, ...servicesList];
    setServicesList(updated);
    setShowAddPackModal(false);
    setNewPack({
      platform: 'instagram',
      type: 'seguidores',
      title: '',
      quantity: '',
      price: '',
      description: '',
      feature1: 'Sin contraseñas requeridas',
      feature2: 'Entrega habitual en 30 minutos · máximo 4 horas',
      feature3: 'Garantía activa de reposición',
    });

    try {
      await onSaveServices(updated);
      showToast('success', 'Nuevo Paquete Publicado con Éxito');
    } catch (err) {
      showToast('error', 'Error al crear paquete', String(err));
    }
  };

  // ==========================================
  // 1. GUARDAR: INICIO & MARCA (HERO, PASOS, BANNER)
  // ==========================================
  const handleSaveBrand = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingBrand(true);
    try {
      await onSaveSettings({
        agencyName: brandForm.agencyName.trim(),
        tagline: brandForm.tagline.trim(),
        logoUrl: brandForm.logoUrl.trim(),
        heroTitle: brandForm.heroTitle.trim(),
        heroDescription: brandForm.heroDescription.trim(),
        heroBadge: brandForm.heroBadge.trim(),
        heroPrimaryBtnText: brandForm.heroPrimaryBtnText.trim(),
        heroSecondaryBtnText: brandForm.heroSecondaryBtnText.trim(),
        bannerNotice: brandForm.bannerNotice.trim(),
        step1Title: brandForm.step1Title.trim(),
        step1Description: brandForm.step1Description.trim(),
        step2Title: brandForm.step2Title.trim(),
        step2Description: brandForm.step2Description.trim(),
        step3Title: brandForm.step3Title.trim(),
        step3Description: brandForm.step3Description.trim(),
      });
      showToast('success', 'Inicio & Marca Guardados', 'Los textos del Hero, pasos explicativos y banner se actualizaron en vivo.');
    } catch (err) {
      console.error(err);
      showToast('error', 'Error al Guardar Inicio', String(err));
    } finally {
      setSavingBrand(false);
    }
  };

  // ==========================================
  // 6. GUARDAR: CONTACTO, WHATSAPP & REDES SOCIALES
  // ==========================================
  const [savingWhatsapp, setSavingWhatsapp] = useState(false);
  const handleSaveWhatsapp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingWhatsapp(true);
    try {
      await onSaveSettings({
        agencyName: contactForm.agencyName.trim(),
        whatsappNumber: contactForm.whatsappNumber.replace(/[^0-9]/g, ''),
        whatsappDefaultMessage: contactForm.whatsappDefaultMessage.trim(),
        logoUrl: contactForm.logoUrl.trim(),
        contactEmail: contactForm.contactEmail.trim(),
        contactLocation: contactForm.contactLocation.trim(),
        socialLinks: {
          instagram: contactForm.instagram.trim(),
          tiktok: contactForm.tiktok.trim(),
          youtube: contactForm.youtube.trim(),
          facebook: contactForm.facebook.trim(),
        },
      });
      showToast('success', 'Canales Guardados', 'WhatsApp, redes sociales y datos de contacto actualizados correctamente.');
    } catch (err) {
      showToast('error', 'Error al guardar canales', String(err));
    } finally {
      setSavingWhatsapp(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('¿Restablecer todo a los valores predeterminados de fábrica?')) {
      await onResetDefaults();
      showToast('info', 'Valores restaurados de fábrica');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white border border-zinc-200 rounded-3xl max-w-5xl w-full h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Barra Superior Profesional con Indicadores en Vivo */}
        <div className="px-4 sm:px-6 py-3 border-b border-zinc-200/90 flex items-center justify-between bg-gradient-to-r from-zinc-50 via-white to-zinc-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={settings.logoUrl || "https://cdn.phototourl.com/member/2026-10-08-92ac8cdb-f316-40bc-ad16-3f22cb980788.png"}
                alt="ImpulsaNet Logo"
                className="w-9 h-9 object-contain rounded-xl shadow-xs border border-purple-200 bg-white p-0.5"
              />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm sm:text-base font-black text-zinc-950 tracking-tight">Centro de Control ImpulsaNet</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Firestore Sincronizado
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                <span className="font-mono text-zinc-600">IP: {clientIp}</span>
                <span>•</span>
                <span className="text-[#5e29c8] font-bold">Modo Administrador Propietario</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isLoggedIn && (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors cursor-pointer border border-zinc-200"
                  title="Ver tienda en vivo"
                >
                  <Eye className="w-3.5 h-3.5 text-[#5e29c8]" />
                  <span>Ver Tienda</span>
                </button>
                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 flex items-center gap-1 cursor-pointer transition-all"
                  title="Cerrar Sesión Administrativa"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-xl hover:bg-zinc-200/80 cursor-pointer transition-colors"
              title="Cerrar Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {!isLoggedIn ? (
            /* Login Exclusivo con Correo Autorizado (Sin Contraseña) */
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex items-center justify-center bg-zinc-50/50">
              <div className="max-w-md w-full text-center bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-xl">
                <div className="relative inline-block mb-4">
                  <img
                    src={settings.logoUrl || "https://cdn.phototourl.com/member/2026-10-08-92ac8cdb-f316-40bc-ad16-3f22cb980788.png"}
                    alt="ImpulsaNet Logo"
                    className="w-16 h-16 object-contain mx-auto drop-shadow-sm rounded-2xl bg-white p-1 border border-zinc-200"
                  />
                  <div
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-xs"
                    title="Acceso Seguro por Correo"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                </div>

                <h4 className="text-xl font-black text-zinc-950 mb-1.5">Acceso Administrativo</h4>
                <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
                  Acceso exclusivo para el administrador de ImpulsaNet. Continúa con tu cuenta de Google autorizada para gestionar la tienda.
                </p>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoggingIn}
                    className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-zinc-50 border-2 border-zinc-200 hover:border-zinc-300 disabled:opacity-60 text-zinc-800 text-sm font-bold flex items-center justify-center gap-3 shadow-xs transition-all cursor-pointer"
                  >
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>{isLoggingIn ? 'Iniciando sesión con Google...' : 'Ingresar con Google'}</span>
                  </button>
                </div>

                <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Modo seguro Propietario</span>
                  <span className="font-mono text-zinc-500">IP: {clientIp}</span>
                </div>
              </div>
            </div>
          ) : (
            /* Panel Estructurado */
            <>
              {/* Barra de Navegación Lateral Moderna con Insignias */}
              <aside className="w-full md:w-64 bg-zinc-50/90 border-r border-zinc-200 p-2.5 sm:p-3 shrink-0 flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto no-scrollbar">
                <div className="hidden md:block px-2.5 py-1 text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                  Módulos de Gestión
                </div>

                <button
                  onClick={() => setActiveSection('brand')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer shrink-0 ${
                    activeSection === 'brand'
                      ? 'bg-[#5e29c8] text-white shadow-md shadow-[#5e29c8]/25 ring-1 ring-white/20'
                      : 'text-zinc-700 hover:bg-zinc-200/70 hover:text-zinc-950'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Layout className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>1. Inicio & Marca</span>
                  </div>
                  <span className={`hidden md:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    activeSection === 'brand' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                  }`}>
                    Hero & Pasos
                  </span>
                </button>

                <button
                  onClick={() => setActiveSection('cards')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer shrink-0 ${
                    activeSection === 'cards'
                      ? 'bg-[#5e29c8] text-white shadow-md shadow-[#5e29c8]/25 ring-1 ring-white/20'
                      : 'text-zinc-700 hover:bg-zinc-200/70 hover:text-zinc-950'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-4 h-4 shrink-0" />
                    <span>2. Tarjetas Virtuales</span>
                  </div>
                  <span className={`hidden md:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    activeSection === 'cards' ? 'bg-white/20 text-white' : 'bg-zinc-200 text-zinc-700'
                  }`}>
                    2 planes
                  </span>
                </button>

                <button
                  onClick={() => setActiveSection('social')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer shrink-0 ${
                    activeSection === 'social'
                      ? 'bg-[#5e29c8] text-white shadow-md shadow-[#5e29c8]/25 ring-1 ring-white/20'
                      : 'text-zinc-700 hover:bg-zinc-200/70 hover:text-zinc-950'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <TrendingUp className="w-4 h-4 shrink-0 text-pink-400" />
                    <span>3. Redes Sociales</span>
                  </div>
                  <span className={`hidden md:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    activeSection === 'social' ? 'bg-white/20 text-white' : 'bg-zinc-200 text-zinc-700'
                  }`}>
                    {servicesList.length} packs
                  </span>
                </button>

                <button
                  onClick={() => setActiveSection('solutions')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer shrink-0 ${
                    activeSection === 'solutions'
                      ? 'bg-[#5e29c8] text-white shadow-md shadow-[#5e29c8]/25 ring-1 ring-white/20'
                      : 'text-zinc-700 hover:bg-zinc-200/70 hover:text-zinc-950'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 shrink-0 text-amber-300" />
                    <span>4. Soluciones Inicio</span>
                  </div>
                  <span className={`hidden md:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    activeSection === 'solutions' ? 'bg-white/20 text-white' : 'bg-purple-100 text-[#5e29c8]'
                  }`}>
                    3 tarjetas
                  </span>
                </button>

                <button
                  onClick={() => setActiveSection('seo')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer shrink-0 ${
                    activeSection === 'seo'
                      ? 'bg-[#5e29c8] text-white shadow-md shadow-[#5e29c8]/25 ring-1 ring-white/20'
                      : 'text-zinc-700 hover:bg-zinc-200/70 hover:text-zinc-950'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>5. SEO & Metadatos</span>
                  </div>
                  <span className={`hidden md:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    activeSection === 'seo' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    Google
                  </span>
                </button>

                <button
                  onClick={() => setActiveSection('faqs')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer shrink-0 ${
                    activeSection === 'faqs'
                      ? 'bg-[#5e29c8] text-white shadow-md shadow-[#5e29c8]/25 ring-1 ring-white/20'
                      : 'text-zinc-700 hover:bg-zinc-200/70 hover:text-zinc-950'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 shrink-0" />
                    <span>6. Preguntas Frecuentes</span>
                  </div>
                  <span className={`hidden md:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    activeSection === 'faqs' ? 'bg-white/20 text-white' : 'bg-zinc-200 text-zinc-700'
                  }`}>
                    {faqsForm.length} FAQs
                  </span>
                </button>

                <button
                  onClick={() => setActiveSection('whatsapp')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer shrink-0 ${
                    activeSection === 'whatsapp'
                      ? 'bg-[#5e29c8] text-white shadow-md shadow-[#5e29c8]/25 ring-1 ring-white/20'
                      : 'text-zinc-700 hover:bg-zinc-200/70 hover:text-zinc-950'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MessageCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>7. Contacto & Redes</span>
                  </div>
                  <span className={`hidden md:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    activeSection === 'whatsapp' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    WA & Redes
                  </span>
                </button>

                <button
                  onClick={() => setActiveSection('security')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer shrink-0 ${
                    activeSection === 'security'
                      ? 'bg-[#5e29c8] text-white shadow-md shadow-[#5e29c8]/25 ring-1 ring-white/20'
                      : 'text-zinc-700 hover:bg-zinc-200/70 hover:text-zinc-950'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-blue-400" />
                    <span>8. Seguridad & Acceso</span>
                  </div>
                  <span className={`hidden md:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    activeSection === 'security' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
                  }`}>
                    Protegido
                  </span>
                </button>

                <div className="pt-4 mt-auto border-t border-zinc-200/80 hidden md:block space-y-2">
                  <div className="p-2.5 rounded-xl bg-purple-50/80 border border-purple-100 text-[11px] text-zinc-600">
                    <div className="font-bold text-[#5e29c8] flex items-center gap-1.5 mb-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Sincronización Total</span>
                    </div>
                    <span>Cualquier cambio se aplica en vivo en Firestore y en la web al instante.</span>
                  </div>

                  <button
                    onClick={handleReset}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-semibold text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/60 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restaurar Fábrica</span>
                  </button>
                </div>
              </aside>

              {/* Área Principal con Barra Resumen */}
              <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 bg-white space-y-5">
                {/* Resumen Métricas Rápidas */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-zinc-200/60 shadow-2xs">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-[#5e29c8] flex items-center justify-center shrink-0">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase block truncate">Tarjetas</span>
                      <span className="text-xs font-black text-zinc-900">2 Planes</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-zinc-200/60 shadow-2xs">
                    <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase block truncate">Redes Sociales</span>
                      <span className="text-xs font-black text-zinc-900">{servicesList.length} Packs Activos</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-zinc-200/60 shadow-2xs">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase block truncate">Soluciones</span>
                      <span className="text-xs font-black text-zinc-900">3 Editables</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-zinc-200/60 shadow-2xs">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase block truncate">SEO & Meta</span>
                      <span className="text-xs font-black text-zinc-900">Indexado</span>
                    </div>
                  </div>
                </div>
                {/* ======================================================== */}
                {/* 1. EDITOR: INICIO & IDENTIDAD DE MARCA                   */}
                {/* ======================================================== */}
                {activeSection === 'brand' && (
                  <form onSubmit={handleSaveBrand} className="space-y-6 max-w-4xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200">
                      <div>
                        <h4 className="text-base font-black text-zinc-950 flex items-center gap-2">
                          <Layout className="w-5 h-5 text-amber-500" />
                          <span>Editor de "Inicio & Identidad de Marca"</span>
                        </h4>
                        <p className="text-xs text-zinc-500">
                          Personaliza el nombre de tu agencia, eslogan, logo, cintillo de anuncio, títulos del Hero y los 3 pasos de compra.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={savingBrand}
                        className="px-5 py-2.5 rounded-xl bg-[#5e29c8] hover:bg-[#4f21ab] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#5e29c8]/25 disabled:opacity-50 shrink-0"
                      >
                        <Save className="w-4 h-4" />
                        <span>{savingBrand ? 'Guardando...' : 'Guardar Cambios de Inicio'}</span>
                      </button>
                    </div>

                    {/* Acordeón 1: Identidad de Marca & Logotipo */}
                    <div className="rounded-2xl bg-zinc-50 border border-zinc-200 overflow-hidden transition-all shadow-xs">
                      <div
                        onClick={() => toggleAccordion('brand-identity')}
                        className="px-4 py-3.5 flex items-center justify-between cursor-pointer hover:bg-zinc-100/70 select-none transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold font-mono">1</span>
                          <div>
                            <span className="text-xs font-black uppercase text-zinc-900 block">Identidad de Marca & Logotipo</span>
                            <span className="text-[11px] text-zinc-500">Nombre comercial, eslogan, banner superior y logo oficial</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-500">
                            {openSections['brand-identity'] ? <ChevronDown className="w-4 h-4 text-[#5e29c8]" /> : <ChevronRight className="w-4 h-4" />}
                          </div>
                        </div>
                      </div>

                      {openSections['brand-identity'] && (
                        <div className="p-4 pt-3 border-t border-zinc-200 space-y-3.5 bg-white">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-zinc-800 mb-1">Nombre Comercial de la Agencia</label>
                              <input
                                type="text"
                                value={brandForm.agencyName}
                                onChange={(e) => setBrandForm({ ...brandForm, agencyName: e.target.value })}
                                placeholder="ImpulsaNet"
                                className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs font-bold bg-white"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-zinc-800 mb-1">Eslogan Corto / Tagline</label>
                              <input
                                type="text"
                                value={brandForm.tagline}
                                onChange={(e) => setBrandForm({ ...brandForm, tagline: e.target.value })}
                                placeholder="Tarjetas Virtuales & Crecimiento en Redes Sociales"
                                className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-zinc-800 mb-1">URL del Logotipo Oficial</label>
                            <div className="flex items-center gap-3">
                              <img
                                src={brandForm.logoUrl || "https://cdn.phototourl.com/member/2026-10-08-92ac8cdb-f316-40bc-ad16-3f22cb980788.png"}
                                alt="Logo Preview"
                                className="w-10 h-10 object-contain rounded-xl border border-zinc-200 bg-white p-1 shadow-2xs shrink-0"
                              />
                              <input
                                type="url"
                                value={brandForm.logoUrl}
                                onChange={(e) => setBrandForm({ ...brandForm, logoUrl: e.target.value })}
                                placeholder="https://..."
                                className="flex-1 px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white font-mono"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-zinc-800 mb-1">
                              Cintillo de Anuncio Superior (Banner informativo en portada)
                            </label>
                            <input
                              type="text"
                              value={brandForm.bannerNotice}
                              onChange={(e) => setBrandForm({ ...brandForm, bannerNotice: e.target.value })}
                              placeholder="Ej: ⚡ Entregas el mismo día en Colombia · Pagos con Nequi y Bancolombia"
                              className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white font-medium text-[#5e29c8]"
                            />
                            <span className="text-[10px] text-zinc-500 mt-0.5 block">
                              Se muestra en la barra superior del sitio como aviso destacado (deja en blanco para ocultar).
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Acordeón 2: Hero de la Portada Principal */}
                    <div className="rounded-2xl bg-zinc-50 border border-zinc-200 overflow-hidden transition-all shadow-xs">
                      <div
                        onClick={() => toggleAccordion('brand-hero')}
                        className="px-4 py-3.5 flex items-center justify-between cursor-pointer hover:bg-zinc-100/70 select-none transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#5e29c8] flex items-center justify-center text-xs font-bold font-mono">2</span>
                          <div>
                            <span className="text-xs font-black uppercase text-zinc-900 block">Hero Principal de la Portada</span>
                            <span className="text-[11px] text-zinc-500">Insignia, título principal, descripción y textos de botones de acción</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-500">
                            {openSections['brand-hero'] ? <ChevronDown className="w-4 h-4 text-[#5e29c8]" /> : <ChevronRight className="w-4 h-4" />}
                          </div>
                        </div>
                      </div>

                      {openSections['brand-hero'] && (
                        <div className="p-4 pt-3 border-t border-zinc-200 space-y-3.5 bg-white">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="sm:col-span-1">
                              <label className="block text-xs font-bold text-zinc-800 mb-1">Insignia / Badge Superior</label>
                              <input
                                type="text"
                                value={brandForm.heroBadge}
                                onChange={(e) => setBrandForm({ ...brandForm, heroBadge: e.target.value })}
                                placeholder="Ej: Agencia Digital Colombia · Pagos Seguros"
                                className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white font-medium"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-xs font-bold text-zinc-800 mb-1">Título Principal del Hero</label>
                              <input
                                type="text"
                                value={brandForm.heroTitle}
                                onChange={(e) => setBrandForm({ ...brandForm, heroTitle: e.target.value })}
                                placeholder="Tu negocio en un QR. Tus redes, en crecimiento."
                                className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs font-black text-zinc-950 bg-white"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-zinc-800 mb-1">Subtítulo / Descripción del Hero</label>
                            <textarea
                              rows={2}
                              value={brandForm.heroDescription}
                              onChange={(e) => setBrandForm({ ...brandForm, heroDescription: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white text-zinc-800 leading-relaxed"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div>
                              <label className="block text-xs font-bold text-zinc-800 mb-1">Texto Botón Primario (Tarjetas)</label>
                              <input
                                type="text"
                                value={brandForm.heroPrimaryBtnText}
                                onChange={(e) => setBrandForm({ ...brandForm, heroPrimaryBtnText: e.target.value })}
                                placeholder="Ver tarjetas"
                                className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white font-bold"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-zinc-800 mb-1">Texto Botón Secundario (Redes)</label>
                              <input
                                type="text"
                                value={brandForm.heroSecondaryBtnText}
                                onChange={(e) => setBrandForm({ ...brandForm, heroSecondaryBtnText: e.target.value })}
                                placeholder="Servicios para redes"
                                className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white font-bold"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Acordeón 3: Los 3 Pasos del "¿Cómo funciona?" */}
                    <div className="rounded-2xl bg-zinc-50 border border-zinc-200 overflow-hidden transition-all shadow-xs">
                      <div
                        onClick={() => toggleAccordion('brand-steps')}
                        className="px-4 py-3.5 flex items-center justify-between cursor-pointer hover:bg-zinc-100/70 select-none transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center text-xs font-bold font-mono">3</span>
                          <div>
                            <span className="text-xs font-black uppercase text-zinc-900 block">Sección "¿Cómo funciona?" (3 Pasos)</span>
                            <span className="text-[11px] text-zinc-500">Paso 01 (Elección), Paso 02 (Envío de datos) y Paso 03 (Entrega y activación)</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-500">
                            {openSections['brand-steps'] ? <ChevronDown className="w-4 h-4 text-[#5e29c8]" /> : <ChevronRight className="w-4 h-4" />}
                          </div>
                        </div>
                      </div>

                      {openSections['brand-steps'] && (
                        <div className="p-4 pt-3 border-t border-zinc-200 space-y-4 bg-white">
                          {/* Paso 1 */}
                          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-purple-100 text-[#5e29c8]">
                              Paso 01
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <div className="sm:col-span-1">
                                <label className="block text-[10px] font-bold text-zinc-700 mb-0.5">Título del Paso</label>
                                <input
                                  type="text"
                                  value={brandForm.step1Title}
                                  onChange={(e) => setBrandForm({ ...brandForm, step1Title: e.target.value })}
                                  placeholder="Elige lo que necesitas"
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 text-xs font-bold bg-white"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-[10px] font-bold text-zinc-700 mb-0.5">Descripción</label>
                                <textarea
                                  rows={2}
                                  value={brandForm.step1Description}
                                  onChange={(e) => setBrandForm({ ...brandForm, step1Description: e.target.value })}
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 text-xs bg-white"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Paso 2 */}
                          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-purple-100 text-[#5e29c8]">
                              Paso 02
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <div className="sm:col-span-1">
                                <label className="block text-[10px] font-bold text-zinc-700 mb-0.5">Título del Paso</label>
                                <input
                                  type="text"
                                  value={brandForm.step2Title}
                                  onChange={(e) => setBrandForm({ ...brandForm, step2Title: e.target.value })}
                                  placeholder="Nos envías tus datos"
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 text-xs font-bold bg-white"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-[10px] font-bold text-zinc-700 mb-0.5">Descripción</label>
                                <textarea
                                  rows={2}
                                  value={brandForm.step2Description}
                                  onChange={(e) => setBrandForm({ ...brandForm, step2Description: e.target.value })}
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 text-xs bg-white"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Paso 3 */}
                          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-purple-100 text-[#5e29c8]">
                              Paso 03
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <div className="sm:col-span-1">
                                <label className="block text-[10px] font-bold text-zinc-700 mb-0.5">Título del Paso</label>
                                <input
                                  type="text"
                                  value={brandForm.step3Title}
                                  onChange={(e) => setBrandForm({ ...brandForm, step3Title: e.target.value })}
                                  placeholder="Lo recibes"
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 text-xs font-bold bg-white"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-[10px] font-bold text-zinc-700 mb-0.5">Descripción</label>
                                <textarea
                                  rows={2}
                                  value={brandForm.step3Description}
                                  onChange={(e) => setBrandForm({ ...brandForm, step3Description: e.target.value })}
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 text-xs bg-white"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Vista Previa Visual del Hero en Vivo */}
                    <div className="rounded-2xl bg-zinc-900 text-white p-4 sm:p-5 space-y-3 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                            Vista Previa en Vivo: Portada Principal
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-400 font-mono">Tiempo Real</span>
                      </div>

                      <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 text-center space-y-2.5">
                        {brandForm.bannerNotice && (
                          <div className="inline-block px-3 py-1 rounded-full bg-[#5e29c8]/50 text-white text-[10px] font-bold border border-[#8B5CF6]/40 mb-1">
                            {brandForm.bannerNotice}
                          </div>
                        )}
                        <h5 className="text-lg sm:text-2xl font-black text-white leading-tight">
                          {brandForm.heroTitle}
                        </h5>
                        <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed">
                          {brandForm.heroDescription}
                        </p>
                        <div className="flex items-center justify-center gap-2.5 pt-2">
                          <span className="px-3.5 py-1.5 rounded-lg bg-[#5e29c8] text-white text-xs font-bold">
                            {brandForm.heroPrimaryBtnText}
                          </span>
                          <span className="px-3.5 py-1.5 rounded-lg bg-white/10 text-zinc-200 text-xs font-bold border border-white/20">
                            {brandForm.heroSecondaryBtnText}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={savingBrand}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#5e29c8] hover:bg-[#4f21ab] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#5e29c8]/25 disabled:opacity-50 transition-all"
                      >
                        <Save className="w-4 h-4" />
                        <span>{savingBrand ? 'Guardando Todo...' : 'Guardar Todos los Cambios de Inicio & Marca'}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* ======================================================== */}
                {/* 2. EDITOR COMPLETO: TARJETAS VIRTUALES CON CÓDIGO QR   */}
                {/* ======================================================== */}
                {activeSection === 'cards' && (
                  <form onSubmit={handleSaveCards} className="space-y-6 max-w-4xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200">
                      <div>
                        <h4 className="text-base font-black text-zinc-950 flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-[#5e29c8]" />
                          <span>Editor de "Tarjetas Virtuales con Código QR & Enlace Web"</span>
                        </h4>
                        <p className="text-xs text-zinc-500">
                          Edita todo el contenido: títulos, planes básico y pro, precios, características y datos de la tarjeta demo.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={savingCards}
                        className="px-5 py-2.5 rounded-xl bg-[#5e29c8] hover:bg-[#4f21ab] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#5e29c8]/25 disabled:opacity-50 shrink-0"
                      >
                        <Save className="w-4 h-4" />
                        <span>{savingCards ? 'Guardando...' : 'Guardar Todo el Módulo'}</span>
                      </button>
                    </div>

                    {/* Encabezado de la Sección (Plegable) */}
                    <div className="rounded-2xl bg-zinc-50 border border-zinc-200 overflow-hidden transition-all shadow-xs">
                      <div 
                        onClick={() => toggleAccordion('cards-header')}
                        className="px-4 py-3.5 flex items-center justify-between cursor-pointer hover:bg-zinc-100/70 select-none transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#5e29c8] flex items-center justify-center text-xs font-bold font-mono">1</span>
                          <div>
                            <span className="text-xs font-black uppercase text-zinc-900 block">Encabezado y Textos Principales</span>
                            <span className="text-[11px] text-zinc-500">Badge, título, descripción y etiqueta de entrega</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveCardsHeader();
                            }}
                            className="px-3 py-1 rounded-lg bg-[#5e29c8] hover:bg-[#4f21ab] text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                          >
                            <Save className="w-3 h-3" />
                            <span>Guardar</span>
                          </button>
                          <div className="w-7 h-7 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-500">
                            {openSections['cards-header'] ? <ChevronDown className="w-4 h-4 text-[#5e29c8]" /> : <ChevronRight className="w-4 h-4" />}
                          </div>
                        </div>
                      </div>
                      
                      {openSections['cards-header'] && (
                        <div className="p-4 pt-2 border-t border-zinc-200 space-y-3 bg-white">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-zinc-800 mb-1">Insignia / Badge Superior</label>
                              <input
                                type="text"
                                value={cardsForm.cardsSectionBadge}
                                onChange={(e) => setCardsForm({ ...cardsForm, cardsSectionBadge: e.target.value })}
                                className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white font-semibold"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-zinc-800 mb-1">Etiqueta de Entrega</label>
                              <input
                                type="text"
                                value={cardsForm.cardsDeliveryTag}
                                onChange={(e) => setCardsForm({ ...cardsForm, cardsDeliveryTag: e.target.value })}
                                className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white font-semibold"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-zinc-800 mb-1">Título Principal de la Sección</label>
                            <input
                              type="text"
                              value={cardsForm.cardsSectionTitle}
                              onChange={(e) => setCardsForm({ ...cardsForm, cardsSectionTitle: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white font-bold"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-zinc-800 mb-1">Subtítulo / Descripción</label>
                            <textarea
                              rows={2}
                              value={cardsForm.cardsSectionSubtitle}
                              onChange={(e) => setCardsForm({ ...cardsForm, cardsSectionSubtitle: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-zinc-800 mb-1">
                                Precio "Desde" Tarjetas (Inicio)
                              </label>
                              <input
                                type="text"
                                value={cardsForm.cardsStartingPrice}
                                onChange={(e) => setCardsForm({ ...cardsForm, cardsStartingPrice: e.target.value })}
                                placeholder="Ej: $79.000 COP"
                                className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white font-bold text-[#5e29c8]"
                                required
                              />
                              <span className="text-[10px] text-zinc-500 mt-0.5 block">
                                Aparece como "desde $___" en Solución 01 de la página principal.
                              </span>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-zinc-800 mb-1">
                                Precio "Pack Negocio" (Inicio)
                              </label>
                              <input
                                type="text"
                                value={cardsForm.packNegocioPrice}
                                onChange={(e) => setCardsForm({ ...cardsForm, packNegocioPrice: e.target.value })}
                                placeholder="Ej: $80.000 COP"
                                className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white font-bold text-[#5e29c8]"
                                required
                              />
                              <span className="text-[10px] text-zinc-500 mt-0.5 block">
                                Precio de Solución 03 (Tarjeta Pro + 1.000 seguidores de Instagram).
                              </span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-zinc-100">
                            <label className="block text-xs font-bold text-zinc-800 mb-1">
                              Título de la Solución 01 en la portada de Inicio
                            </label>
                            <input
                              type="text"
                              value={cardsForm.solution1Title || ''}
                              onChange={(e) => setCardsForm({ ...cardsForm, solution1Title: e.target.value })}
                              placeholder="Tarjeta Digital con QR"
                              className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white font-bold"
                            />
                            <span className="text-[10px] text-zinc-500 mt-0.5 block">
                              Título mostrado en la tarjeta de Solución 01 en la portada principal.
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Planes de Precios y Características (Plegable) */}
                    <div className="rounded-2xl bg-zinc-50 border border-zinc-200 overflow-hidden transition-all shadow-xs">
                      <div 
                        onClick={() => toggleAccordion('cards-plans')}
                        className="px-4 py-3.5 flex items-center justify-between cursor-pointer hover:bg-zinc-100/70 select-none transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#5e29c8] flex items-center justify-center text-xs font-bold font-mono">2</span>
                          <div>
                            <span className="text-xs font-black uppercase text-zinc-900 block">Planes de Precios y Beneficios</span>
                            <span className="text-[11px] text-zinc-500">Estándar ({cardsForm.cardsBasicPrice}), Pro ({cardsForm.cardsProPrice}) y Pack Negocio ({cardsForm.packNegocioPrice})</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-500">
                            {openSections['cards-plans'] ? <ChevronDown className="w-4 h-4 text-[#5e29c8]" /> : <ChevronRight className="w-4 h-4" />}
                          </div>
                        </div>
                      </div>

                      {openSections['cards-plans'] && (
                        <div className="p-4 pt-3 border-t border-zinc-200 bg-white">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Plan 1: Básica */}
                            <div className="p-4 rounded-2xl bg-zinc-50 border-2 border-zinc-200 space-y-3">
                              <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-black text-zinc-950 uppercase">Plan 1: Tarjeta Básica</span>
                                  <span className="text-[10px] font-bold text-[#5e29c8] bg-purple-50 px-2 py-0.5 rounded">Digital</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={handleSavePlan1}
                                  className="px-2.5 py-1 rounded-lg bg-[#5e29c8] hover:bg-[#4f21ab] text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                                >
                                  <Save className="w-3 h-3" />
                                  <span>Guardar Plan 1</span>
                                </button>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[10px] font-bold text-zinc-700 mb-0.5">Título del Plan</label>
                                  <input
                                    type="text"
                                    value={cardsForm.cardPlan1Title}
                                    onChange={(e) => setCardsForm({ ...cardsForm, cardPlan1Title: e.target.value })}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 text-xs font-bold bg-white"
                                    required
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-zinc-700 mb-0.5">Precio</label>
                                  <input
                                    type="text"
                                    value={cardsForm.cardsBasicPrice}
                                    onChange={(e) => setCardsForm({ ...cardsForm, cardsBasicPrice: e.target.value })}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 text-xs font-black text-zinc-950 bg-white"
                                    required
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[10px] font-bold text-zinc-700 mb-0.5">Etiqueta Badge</label>
                                  <input
                                    type="text"
                                    value={cardsForm.cardPlan1Badge}
                                    onChange={(e) => setCardsForm({ ...cardsForm, cardPlan1Badge: e.target.value })}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 text-xs bg-white"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-zinc-700 mb-0.5">Texto Botón</label>
                                  <input
                                    type="text"
                                    value={cardsForm.cardPlan1ButtonText}
                                    onChange={(e) => setCardsForm({ ...cardsForm, cardPlan1ButtonText: e.target.value })}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 text-xs bg-white"
                                  />
                                </div>
                              </div>

                              {/* Bullets de características */}
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <label className="text-[10px] font-bold text-zinc-700 uppercase">Lista de Beneficios</label>
                                  <button
                                    type="button"
                                    onClick={() => handleAddPlanFeature(1)}
                                    className="text-[10px] font-bold text-[#5e29c8] hover:underline flex items-center gap-0.5 cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3" /> Añadir
                                  </button>
                                </div>

                                <div className="space-y-1.5">
                                  {cardsForm.cardPlan1Features.map((feat, idx) => (
                                    <div key={idx} className="flex items-center gap-1.5">
                                      <input
                                        type="text"
                                        value={feat}
                                        onChange={(e) => handleUpdatePlanFeature(1, idx, e.target.value)}
                                        className="w-full px-2 py-1 rounded-md border border-zinc-200 text-xs bg-white"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleRemovePlanFeature(1, idx)}
                                        className="p-1 text-zinc-400 hover:text-rose-500 rounded cursor-pointer"
                                        title="Quitar"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Plan 2: Pro */}
                            <div className="p-4 rounded-2xl bg-purple-50/30 border-2 border-[#5e29c8] space-y-3">
                              <div className="flex items-center justify-between pb-2 border-b border-purple-100">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-black text-zinc-950 uppercase">Plan 2: Tarjeta Pro</span>
                                  <span className="text-[10px] font-bold text-white bg-[#5e29c8] px-2 py-0.5 rounded">Recomendado</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={handleSavePlan2}
                                  className="px-2.5 py-1 rounded-lg bg-[#5e29c8] hover:bg-[#4f21ab] text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                                >
                                  <Save className="w-3 h-3" />
                                  <span>Guardar Plan 2</span>
                                </button>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[10px] font-bold text-zinc-700 mb-0.5">Título del Plan</label>
                                  <input
                                    type="text"
                                    value={cardsForm.cardPlan2Title}
                                    onChange={(e) => setCardsForm({ ...cardsForm, cardPlan2Title: e.target.value })}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 text-xs font-bold bg-white"
                                    required
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-zinc-700 mb-0.5">Precio</label>
                                  <input
                                    type="text"
                                    value={cardsForm.cardsProPrice}
                                    onChange={(e) => setCardsForm({ ...cardsForm, cardsProPrice: e.target.value })}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 text-xs font-black text-[#5e29c8] bg-white"
                                    required
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[10px] font-bold text-zinc-700 mb-0.5">Etiqueta Badge</label>
                                  <input
                                    type="text"
                                    value={cardsForm.cardPlan2Badge}
                                    onChange={(e) => setCardsForm({ ...cardsForm, cardPlan2Badge: e.target.value })}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 text-xs bg-white"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-zinc-700 mb-0.5">Texto Botón</label>
                                  <input
                                    type="text"
                                    value={cardsForm.cardPlan2ButtonText}
                                    onChange={(e) => setCardsForm({ ...cardsForm, cardPlan2ButtonText: e.target.value })}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 text-xs bg-white"
                                  />
                                </div>
                              </div>

                              {/* Bullets de características */}
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <label className="text-[10px] font-bold text-zinc-700 uppercase">Lista de Beneficios</label>
                                  <button
                                    type="button"
                                    onClick={() => handleAddPlanFeature(2)}
                                    className="text-[10px] font-bold text-[#5e29c8] hover:underline flex items-center gap-0.5 cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3" /> Añadir
                                  </button>
                                </div>

                                <div className="space-y-1.5">
                                  {cardsForm.cardPlan2Features.map((feat, idx) => (
                                    <div key={idx} className="flex items-center gap-1.5">
                                      <input
                                        type="text"
                                        value={feat}
                                        onChange={(e) => handleUpdatePlanFeature(2, idx, e.target.value)}
                                        className="w-full px-2 py-1 rounded-md border border-zinc-200 text-xs bg-white"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleRemovePlanFeature(2, idx)}
                                        className="p-1 text-zinc-400 hover:text-rose-500 rounded cursor-pointer"
                                        title="Quitar"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Plan 3 / Pack Negocio: Tarjeta Pro + 1.000 Seguidores IG */}
                            <div className="lg:col-span-2 p-4 rounded-2xl bg-gradient-to-r from-purple-50/60 via-white to-pink-50/60 border-2 border-purple-300 space-y-3">
                              <div className="flex items-center justify-between pb-2 border-b border-purple-200">
                                <div className="flex items-center gap-1.5">
                                  <Sparkles className="w-4 h-4 text-[#5e29c8]" />
                                  <span className="text-xs font-black text-zinc-950 uppercase">Pack Negocio: Tarjeta Pro + 1.000 Seguidores Instagram</span>
                                  <span className="text-[10px] font-bold text-white bg-gradient-to-r from-[#5e29c8] to-pink-600 px-2 py-0.5 rounded">Combo Solución 03</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={handleSavePackNegocio}
                                  className="px-2.5 py-1 rounded-lg bg-[#5e29c8] hover:bg-[#4f21ab] text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                                >
                                  <Save className="w-3 h-3" />
                                  <span>Guardar Pack Negocio</span>
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                                <div>
                                  <label className="block text-[10px] font-bold text-zinc-700 uppercase mb-1">
                                    Precio del Pack Negocio
                                  </label>
                                  <input
                                    type="text"
                                    value={cardsForm.packNegocioPrice}
                                    onChange={(e) => setCardsForm({ ...cardsForm, packNegocioPrice: e.target.value })}
                                    placeholder="Ej: $80.000 COP"
                                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs font-black text-[#5e29c8] bg-white shadow-2xs"
                                    required
                                  />
                                </div>
                                <div className="text-[11px] text-zinc-600 leading-relaxed">
                                  Configura el precio que se muestra en la <strong>Solución 03</strong> de la página principal. Por defecto: <strong>$80.000 COP</strong>. Puedes guardarlo directamente aquí o con el botón general.
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Datos de la Tarjeta Interactiva de Demo (Plegable) */}
                    <div className="rounded-2xl bg-zinc-50 border border-zinc-200 overflow-hidden transition-all shadow-xs">
                      <div 
                        onClick={() => toggleAccordion('cards-demo')}
                        className="px-4 py-3.5 flex items-center justify-between cursor-pointer hover:bg-zinc-100/70 select-none transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#5e29c8] flex items-center justify-center text-xs font-bold font-mono">3</span>
                          <div>
                            <span className="text-xs font-black uppercase text-zinc-900 block">Datos de la Tarjeta Demo Interactiva</span>
                            <span className="text-[11px] text-zinc-500">Nombre, cargo, empresa, teléfono y enlace QR ({cardsForm.cardDemoName})</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveDemoCard();
                            }}
                            className="px-3 py-1 rounded-lg bg-[#5e29c8] hover:bg-[#4f21ab] text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                          >
                            <Save className="w-3 h-3" />
                            <span>Guardar Demo</span>
                          </button>
                          <div className="w-7 h-7 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-500">
                            {openSections['cards-demo'] ? <ChevronDown className="w-4 h-4 text-[#5e29c8]" /> : <ChevronRight className="w-4 h-4" />}
                          </div>
                        </div>
                      </div>

                      {openSections['cards-demo'] && (
                        <div className="p-4 pt-2 border-t border-zinc-200 space-y-3 bg-white">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-zinc-700 mb-1">Nombre en la Tarjeta</label>
                              <input
                                type="text"
                                value={cardsForm.cardDemoName}
                                onChange={(e) => setCardsForm({ ...cardsForm, cardDemoName: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 text-xs bg-white"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-zinc-700 mb-1">Cargo / Especialidad</label>
                              <input
                                type="text"
                                value={cardsForm.cardDemoRole}
                                onChange={(e) => setCardsForm({ ...cardsForm, cardDemoRole: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 text-xs bg-white"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-zinc-700 mb-1">Empresa</label>
                              <input
                                type="text"
                                value={cardsForm.cardDemoCompany}
                                onChange={(e) => setCardsForm({ ...cardsForm, cardDemoCompany: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 text-xs bg-white"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-zinc-700 mb-1">Teléfono Móvil</label>
                              <input
                                type="text"
                                value={cardsForm.cardDemoPhone}
                                onChange={(e) => setCardsForm({ ...cardsForm, cardDemoPhone: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 text-xs bg-white"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-zinc-700 mb-1">WhatsApp de Contacto</label>
                              <input
                                type="text"
                                value={cardsForm.cardDemoWhatsapp}
                                onChange={(e) => setCardsForm({ ...cardsForm, cardDemoWhatsapp: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 text-xs bg-white"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-zinc-700 mb-1">Enlace Web Demo (para QR)</label>
                              <input
                                type="text"
                                value={cardsForm.cardsDemoUrl}
                                onChange={(e) => setCardsForm({ ...cardsForm, cardsDemoUrl: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 text-xs bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={savingCards}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#5e29c8] hover:bg-[#4f21ab] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#5e29c8]/25 disabled:opacity-50 transition-all"
                      >
                        <Save className="w-4 h-4" />
                        <span>{savingCards ? 'Guardando Todo...' : 'Guardar Todos los Cambios de Tarjetas Virtuales'}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* ======================================================== */}
                {/* 2. EDITOR COMPLETO: SEGUIDORES, LIKES Y VISTAS (REDES) */}
                {/* ======================================================== */}
                {activeSection === 'social' && (
                  <div className="space-y-6 max-w-4xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200">
                      <div>
                        <h4 className="text-base font-black text-zinc-950 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-[#5e29c8]" />
                          <span>Editor de "Seguidores, Likes y Vistas para tus Redes"</span>
                        </h4>
                        <p className="text-xs text-zinc-500">
                          Edita el título, subtítulo de la sección y cada paquete individual (título, precio, beneficios y estado).
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowAddPackModal(true)}
                          className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Añadir Paquete</span>
                        </button>

                        <button
                          onClick={handleSaveAllServices}
                          className="px-4 py-2 rounded-xl bg-[#5e29c8] hover:bg-[#4f21ab] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#5e29c8]/25"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Guardar Todos los Paquetes</span>
                        </button>
                      </div>
                    </div>

                    {/* Encabezado General de la Sección de Redes (Plegable) */}
                    <div className="rounded-2xl bg-zinc-50 border border-zinc-200 overflow-hidden transition-all shadow-xs">
                      <div 
                        onClick={() => toggleAccordion('social-header')}
                        className="px-4 py-3.5 flex items-center justify-between cursor-pointer hover:bg-zinc-100/70 select-none transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#5e29c8] flex items-center justify-center text-xs font-bold font-mono">1</span>
                          <div>
                            <span className="text-xs font-black uppercase text-zinc-900 block">Encabezado y Textos del Módulo</span>
                            <span className="text-[11px] text-zinc-500">Insignia, título principal, velocidad y subtítulo</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-500">
                            {openSections['social-header'] ? <ChevronDown className="w-4 h-4 text-[#5e29c8]" /> : <ChevronRight className="w-4 h-4" />}
                          </div>
                        </div>
                      </div>

                      {openSections['social-header'] && (
                        <form onSubmit={handleSaveSocialHeaders} className="p-4 pt-2 border-t border-zinc-200 space-y-3 bg-white">
                          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                            <span className="text-[11px] font-bold text-zinc-600">Edita los textos que se ven en la cabecera de la sección</span>
                            <button
                              type="submit"
                              disabled={savingSocialHeaders}
                              className="px-3 py-1 rounded-lg bg-[#5e29c8] text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            >
                              <Save className="w-3 h-3" />
                              <span>{savingSocialHeaders ? 'Guardando...' : 'Guardar Encabezado'}</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-zinc-800 mb-0.5">Insignia / Badge Superior</label>
                              <input
                                type="text"
                                value={socialHeadersForm.socialSectionBadge}
                                onChange={(e) => setSocialHeadersForm({ ...socialHeadersForm, socialSectionBadge: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 text-xs bg-white"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-zinc-800 mb-0.5">Etiqueta de Velocidad</label>
                              <input
                                type="text"
                                value={socialHeadersForm.socialSectionSpeedTag}
                                onChange={(e) => setSocialHeadersForm({ ...socialHeadersForm, socialSectionSpeedTag: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 text-xs bg-white"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-zinc-800 mb-0.5">Título de la Sección</label>
                            <input
                              type="text"
                              value={socialHeadersForm.socialSectionTitle}
                              onChange={(e) => setSocialHeadersForm({ ...socialHeadersForm, socialSectionTitle: e.target.value })}
                              className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 text-xs bg-white font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-zinc-800 mb-0.5">Subtítulo / Descripción</label>
                            <textarea
                              rows={2}
                              value={socialHeadersForm.socialSectionSubtitle}
                              onChange={(e) => setSocialHeadersForm({ ...socialHeadersForm, socialSectionSubtitle: e.target.value })}
                              className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 text-xs bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-zinc-800 mb-0.5">
                              Precio "Desde" visible en la portada de Inicio
                            </label>
                            <input
                              type="text"
                              value={socialHeadersForm.socialStartingPrice}
                              onChange={(e) => setSocialHeadersForm({ ...socialHeadersForm, socialStartingPrice: e.target.value })}
                              placeholder="Ej: $5.000 COP"
                              className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 text-xs bg-white font-bold text-[#5e29c8]"
                            />
                            <span className="text-[10px] text-zinc-500 mt-0.5 block">
                              Aparece como "desde $___" en la tarjeta de Servicios para Redes Sociales de la página principal.
                            </span>
                          </div>

                          <div className="pt-2 border-t border-zinc-100">
                            <label className="block text-xs font-bold text-zinc-800 mb-0.5">
                              Título de la Solución 02 en la portada de Inicio
                            </label>
                            <input
                              type="text"
                              value={socialHeadersForm.solution2Title || ''}
                              onChange={(e) => setSocialHeadersForm({ ...socialHeadersForm, solution2Title: e.target.value })}
                              placeholder="Servicios para Redes Sociales"
                              className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 text-xs bg-white font-bold"
                            />
                            <span className="text-[10px] text-zinc-500 mt-0.5 block">
                              Título mostrado en la tarjeta de Solución 02 en la portada principal.
                            </span>
                          </div>
                        </form>
                      )}
                    </div>

                    {/* Catálogo de Paquetes por Red Social (Plegable) */}
                    <div className="rounded-2xl bg-zinc-50 border border-zinc-200 overflow-hidden transition-all shadow-xs">
                      <div 
                        onClick={() => toggleAccordion('social-packs')}
                        className="px-4 py-3.5 flex items-center justify-between cursor-pointer hover:bg-zinc-100/70 select-none transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#5e29c8] flex items-center justify-center text-xs font-bold font-mono">2</span>
                          <div>
                            <span className="text-xs font-black uppercase text-zinc-900 block">Catálogo y Edición de Paquetes</span>
                            <span className="text-[11px] text-zinc-500">Instagram, TikTok, YouTube y Facebook ({servicesList.length} paquetes activos)</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-500">
                            {openSections['social-packs'] ? <ChevronDown className="w-4 h-4 text-[#5e29c8]" /> : <ChevronRight className="w-4 h-4" />}
                          </div>
                        </div>
                      </div>

                      {openSections['social-packs'] && (
                        <div className="p-4 pt-3 border-t border-zinc-200 space-y-4 bg-white">
                          {/* 1. Selector de Plataforma con Contador */}
                          <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-xl max-w-lg">
                            {(['instagram', 'tiktok', 'youtube', 'facebook'] as SocialPlatform[]).map((plat) => {
                              const count = servicesList.filter((p) => p.platform === plat && p.active !== false).length;
                              return (
                                <button
                                  key={plat}
                                  onClick={() => setSelectedPlatform(plat)}
                                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                    selectedPlatform === plat
                                      ? 'bg-white text-zinc-950 shadow-2xs text-[#5e29c8]'
                                      : 'text-zinc-600 hover:text-zinc-950'
                                  }`}
                                >
                                  <span>{plat}</span>
                                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                    selectedPlatform === plat ? 'bg-purple-100 text-[#5e29c8]' : 'bg-zinc-200 text-zinc-600'
                                  }`}>
                                    {count}
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          {/* 2. Filtro por Tipo de Servicio (Todos, Seguidores, Likes, Vistas) */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 pb-1">
                            <div className="flex items-center gap-1.5 p-1 bg-zinc-50 border border-zinc-200 rounded-xl">
                              {(
                                [
                                  { id: 'all', label: 'Todos' },
                                  { id: 'seguidores', label: 'Seguidores' },
                                  { id: 'likes', label: 'Me gusta' },
                                  { id: 'vistas', label: 'Vistas' },
                                ] as const
                              ).map((tf) => {
                                const count = tf.id === 'all'
                                  ? servicesList.filter((p) => p.platform === selectedPlatform && p.active !== false).length
                                  : servicesList.filter((p) => p.platform === selectedPlatform && p.type === tf.id && p.active !== false).length;
                                return (
                                  <button
                                    key={tf.id}
                                    onClick={() => setAdminTypeFilter(tf.id)}
                                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                      adminTypeFilter === tf.id
                                        ? 'bg-[#5e29c8] text-white shadow-2xs'
                                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                                    }`}
                                  >
                                    <span>{tf.label}</span>
                                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                      adminTypeFilter === tf.id ? 'bg-white/20 text-white' : 'bg-zinc-200 text-zinc-600'
                                    }`}>
                                      {count}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>

                            <div className="relative w-full sm:w-64">
                              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                              <input
                                type="text"
                                value={adminSearchQuery}
                                onChange={(e) => setAdminSearchQuery(e.target.value)}
                                placeholder="Buscar paquete o precio..."
                                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-zinc-200 text-xs bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5e29c8]/30"
                              />
                            </div>
                          </div>

                          {/* Lista Completa de Paquetes Ordenados de Menor a Mayor Cantidad */}
                          <div className="space-y-3">
                            {servicesList
                              .filter((p) => p.platform === selectedPlatform)
                              .filter((p) => adminTypeFilter === 'all' || p.type === adminTypeFilter)
                              .filter((p) => {
                                if (!adminSearchQuery.trim()) return true;
                                const q = adminSearchQuery.toLowerCase();
                                return (
                                  p.title.toLowerCase().includes(q) ||
                                  p.price.toLowerCase().includes(q) ||
                                  p.quantity.toLowerCase().includes(q) ||
                                  p.id.toLowerCase().includes(q)
                                );
                              })
                              .sort(sortSocialServicePacks)
                              .map((pack) => (
                          <div
                            key={pack.id}
                            className={`p-4 rounded-2xl border transition-all space-y-3 ${
                              pack.active === false
                                ? 'bg-zinc-100/70 border-zinc-300 opacity-60'
                                : pack.popular
                                ? 'bg-purple-50/25 border-purple-300 shadow-2xs'
                                : 'bg-white border-zinc-200'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-100">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-zinc-600">Tipo:</span>
                                <select
                                  value={pack.type}
                                  onChange={(e) => handleUpdatePackField(pack.id, 'type', e.target.value)}
                                  className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 text-zinc-800 border border-zinc-200 uppercase cursor-pointer"
                                >
                                  <option value="seguidores">Seguidores</option>
                                  <option value="likes">Me gusta</option>
                                  <option value="vistas">Vistas</option>
                                </select>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-[#5e29c8] border border-purple-200">
                                  {pack.quantity || 'Cantidad'}
                                </span>
                                <span className="text-[10px] font-mono text-zinc-400">
                                  {pack.id}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleTogglePackPopular(pack.id)}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer border ${
                                    pack.popular
                                      ? 'bg-[#5e29c8] text-white border-[#5e29c8]'
                                      : 'bg-zinc-50 text-zinc-600 border-zinc-200'
                                  }`}
                                >
                                  {pack.popular ? '★ Más Vendido' : 'Marcar Popular'}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleTogglePackActive(pack.id)}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer border ${
                                    pack.active !== false
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : 'bg-zinc-200 text-zinc-600 border-zinc-300'
                                  }`}
                                >
                                  {pack.active !== false ? 'Activo en Web' : 'Oculto'}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeletePack(pack.id)}
                                  className="p-1 text-zinc-400 hover:text-rose-600 rounded cursor-pointer"
                                  title="Eliminar paquete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                              <div className="sm:col-span-6">
                                <label className="block text-[10px] font-bold text-zinc-700 mb-0.5">Título del Paquete</label>
                                <input
                                  type="text"
                                  value={pack.title}
                                  onChange={(e) => handleUpdatePackField(pack.id, 'title', e.target.value)}
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 text-xs font-bold text-zinc-950 bg-white"
                                />
                              </div>

                              <div className="sm:col-span-3">
                                <label className="block text-[10px] font-bold text-zinc-700 mb-0.5">Cantidad / Métrica</label>
                                <input
                                  type="text"
                                  placeholder="Ej: 1.000 Seguidores"
                                  value={pack.quantity || ''}
                                  onChange={(e) => handleUpdatePackField(pack.id, 'quantity', e.target.value)}
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 text-xs text-zinc-800 bg-white"
                                />
                              </div>

                              <div className="sm:col-span-3">
                                <label className="block text-[10px] font-bold text-zinc-700 mb-0.5">Precio de Venta</label>
                                <input
                                  type="text"
                                  value={pack.price}
                                  onChange={(e) => handleUpdatePackField(pack.id, 'price', e.target.value)}
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 text-xs font-black text-[#5e29c8] bg-white"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-zinc-700 mb-0.5">Descripción</label>
                              <input
                                type="text"
                                value={pack.description}
                                onChange={(e) => handleUpdatePackField(pack.id, 'description', e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 text-xs text-zinc-700 bg-white"
                              />
                            </div>

                            {/* Bullets de beneficios del paquete */}
                            <div className="pt-1">
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-[10px] font-bold text-zinc-700 uppercase">Beneficios incluidos (bullets)</label>
                                <button
                                  type="button"
                                  onClick={() => handleAddPackFeature(pack.id)}
                                  className="text-[10px] font-bold text-[#5e29c8] hover:underline flex items-center gap-0.5 cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" /> Añadir beneficio
                                </button>
                              </div>

                              <div className="space-y-1">
                                {pack.features.map((feat, fIdx) => (
                                  <div key={fIdx} className="flex items-center gap-1.5">
                                    <input
                                      type="text"
                                      value={feat}
                                      onChange={(e) => handleUpdatePackFeature(pack.id, fIdx, e.target.value)}
                                      className="w-full px-2 py-1 rounded-md border border-zinc-200 text-xs bg-white"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleRemovePackFeature(pack.id, fIdx)}
                                      className="p-1 text-zinc-400 hover:text-rose-500 rounded cursor-pointer"
                                      title="Quitar"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Botón Guardar Este Paquete Individual */}
                            <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                              <span className="text-[10px] text-zinc-500">
                                Modifica los campos y guarda este paquete al instante
                              </span>
                              <button
                                type="button"
                                onClick={() => handleSaveSinglePack(pack.id)}
                                className="px-3.5 py-1.5 rounded-lg bg-[#5e29c8] hover:bg-[#4f21ab] text-white text-[11px] font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Guardar este paquete</span>
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>

                          <div className="pt-4 flex justify-end">
                            <button
                              type="button"
                              onClick={handleSaveAllServices}
                              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#5e29c8] hover:bg-[#4f21ab] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#5e29c8]/25 transition-all"
                            >
                              <Save className="w-4 h-4" />
                              <span>Guardar Todos los Paquetes de Redes</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 3. EDITOR: SOLUCIONES PRINCIPALES (PÁGINA DE INICIO)     */}
                {/* ======================================================== */}
                {activeSection === 'solutions' && (
                  <form onSubmit={handleSaveSolutions} className="space-y-6 max-w-4xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200">
                      <div>
                        <h4 className="text-base font-black text-zinc-950 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-[#5e29c8]" />
                          <span>Editor de "Nuestras Soluciones Principales" (Inicio)</span>
                        </h4>
                        <p className="text-xs text-zinc-500">
                          Edita los títulos, insignias y descripciones de las 3 tarjetas de soluciones de la página de inicio.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={savingSolutions}
                        className="px-5 py-2.5 rounded-xl bg-[#5e29c8] hover:bg-[#4f21ab] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#5e29c8]/25 disabled:opacity-50 shrink-0"
                      >
                        <Save className="w-4 h-4" />
                        <span>{savingSolutions ? 'Guardando...' : 'Guardar Soluciones'}</span>
                      </button>
                    </div>

                    {/* Encabezado General de la Sección de Soluciones */}
                    <div className="rounded-2xl bg-zinc-50 border border-zinc-200 p-4 sm:p-5 space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-zinc-200/80">
                        <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#5e29c8] flex items-center justify-center text-xs font-bold">★</span>
                        <h5 className="text-xs font-black uppercase text-zinc-900 tracking-wider">
                          Encabezado de la Sección de Soluciones en Inicio
                        </h5>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-zinc-800 mb-1">
                            Título Principal de la Sección
                          </label>
                          <input
                            type="text"
                            value={solutionsForm.solutionsSectionTitle}
                            onChange={(e) => setSolutionsForm({ ...solutionsForm, solutionsSectionTitle: e.target.value })}
                            placeholder="Nuestras Soluciones Principales"
                            className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white font-bold"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-800 mb-1">
                            Subtítulo de la Sección
                          </label>
                          <input
                            type="text"
                            value={solutionsForm.solutionsSectionSubtitle}
                            onChange={(e) => setSolutionsForm({ ...solutionsForm, solutionsSectionSubtitle: e.target.value })}
                            placeholder="Explora las demostraciones y los catálogos con precios claros en pesos colombianos."
                            className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Tarjeta 1: Solución 01 */}
                    <div className="rounded-2xl bg-white border-2 border-purple-200 p-4 sm:p-5 space-y-3.5 shadow-2xs">
                      <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#5e29c8] text-white flex items-center justify-center">
                            <CreditCard className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-black text-[#5e29c8] uppercase block">Solución 01</span>
                            <span className="text-xs font-bold text-zinc-900">Tarjeta Digital con QR</span>
                          </div>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-[#5e29c8]">
                          {solutionsForm.solution1Badge || 'Destacado'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-zinc-800 mb-1">
                            Título de la Solución 01 (Editable)
                          </label>
                          <input
                            type="text"
                            value={solutionsForm.solution1Title}
                            onChange={(e) => setSolutionsForm({ ...solutionsForm, solution1Title: e.target.value })}
                            placeholder="Tarjeta Digital con QR"
                            className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white font-black text-zinc-950"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-800 mb-1">
                            Insignia / Badge
                          </label>
                          <input
                            type="text"
                            value={solutionsForm.solution1Badge}
                            onChange={(e) => setSolutionsForm({ ...solutionsForm, solution1Badge: e.target.value })}
                            placeholder="Destacado"
                            className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-800 mb-1">
                          Descripción Corta
                        </label>
                        <textarea
                          rows={2}
                          value={solutionsForm.solution1Description}
                          onChange={(e) => setSolutionsForm({ ...solutionsForm, solution1Description: e.target.value })}
                          placeholder="Perfiles interactivos con QR permanente, WhatsApp, catálogo y ubicación."
                          className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white"
                        />
                      </div>
                    </div>

                    {/* Tarjeta 2: Solución 02 */}
                    <div className="rounded-2xl bg-white border-2 border-purple-200 p-4 sm:p-5 space-y-3.5 shadow-2xs">
                      <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#5e29c8] text-white flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <span className="text-xs font-black text-[#5e29c8] uppercase block">Solución 02</span>
                            <span className="text-xs font-bold text-zinc-900">Servicios para Redes Sociales</span>
                          </div>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-[#5e29c8]">
                          {solutionsForm.solution2Badge || 'Crecimiento'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-zinc-800 mb-1">
                            Título de la Solución 02 (Editable)
                          </label>
                          <input
                            type="text"
                            value={solutionsForm.solution2Title}
                            onChange={(e) => setSolutionsForm({ ...solutionsForm, solution2Title: e.target.value })}
                            placeholder="Servicios para Redes Sociales"
                            className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white font-black text-zinc-950"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-800 mb-1">
                            Insignia / Badge
                          </label>
                          <input
                            type="text"
                            value={solutionsForm.solution2Badge}
                            onChange={(e) => setSolutionsForm({ ...solutionsForm, solution2Badge: e.target.value })}
                            placeholder="Crecimiento"
                            className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-800 mb-1">
                          Descripción Corta
                        </label>
                        <textarea
                          rows={2}
                          value={solutionsForm.solution2Description}
                          onChange={(e) => setSolutionsForm({ ...solutionsForm, solution2Description: e.target.value })}
                          placeholder="Seguidores, likes y reproducciones para tus redes sin contraseñas."
                          className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white"
                        />
                      </div>
                    </div>

                    {/* Tarjeta 3: Solución 03 */}
                    <div className="rounded-2xl bg-white border-2 border-purple-300 p-4 sm:p-5 space-y-3.5 shadow-2xs">
                      <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#5e29c8] to-pink-600 text-white flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-amber-300" />
                          </div>
                          <div>
                            <span className="text-xs font-black text-[#5e29c8] uppercase block">Solución 03</span>
                            <span className="text-xs font-bold text-zinc-900">Pack Negocio</span>
                          </div>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-[#5e29c8] to-pink-600 text-white shadow-2xs">
                          {solutionsForm.solution3Badge || 'Pack Negocio'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-zinc-800 mb-1">
                            Título de la Solución 03 (Editable)
                          </label>
                          <input
                            type="text"
                            value={solutionsForm.solution3Title}
                            onChange={(e) => setSolutionsForm({ ...solutionsForm, solution3Title: e.target.value })}
                            placeholder="Pack Negocio: Tarjeta Pro + 1.000 seguidores de Instagram"
                            className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white font-black text-zinc-950"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-800 mb-1">
                            Insignia / Badge
                          </label>
                          <input
                            type="text"
                            value={solutionsForm.solution3Badge}
                            onChange={(e) => setSolutionsForm({ ...solutionsForm, solution3Badge: e.target.value })}
                            placeholder="Pack Negocio"
                            className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white font-bold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-zinc-800 mb-1">
                            Descripción Corta
                          </label>
                          <textarea
                            rows={2}
                            value={solutionsForm.solution3Description}
                            onChange={(e) => setSolutionsForm({ ...solutionsForm, solution3Description: e.target.value })}
                            placeholder="El paquete integral para presentar tu marca y acelerar tu Instagram al mismo tiempo."
                            className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-800 mb-1">
                            Precio Pack Negocio
                          </label>
                          <input
                            type="text"
                            value={solutionsForm.packNegocioPrice}
                            onChange={(e) => setSolutionsForm({ ...solutionsForm, packNegocioPrice: e.target.value })}
                            placeholder="$80.000 COP"
                            className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white font-bold text-[#5e29c8]"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Vista Previa en Vivo de las Soluciones */}
                    <div className="rounded-2xl bg-zinc-900 text-white p-4 sm:p-5 space-y-3 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-purple-400" />
                          <span className="text-xs font-black uppercase tracking-wider text-purple-300">
                            Vista Previa en Vivo (Página de Inicio)
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-400 font-mono">Actualización instantánea</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                        <div className="p-3 rounded-xl bg-zinc-800/90 border border-zinc-700/80 space-y-1.5">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/30 text-purple-200">
                            {solutionsForm.solution1Badge || 'Destacado'}
                          </span>
                          <h6 className="text-xs font-black text-white line-clamp-2">
                            {solutionsForm.solution1Title || 'Tarjeta Digital con QR'}
                          </h6>
                          <p className="text-[11px] text-zinc-400 line-clamp-2">
                            {solutionsForm.solution1Description}
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-zinc-800/90 border border-zinc-700/80 space-y-1.5">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-pink-500/30 text-pink-200">
                            {solutionsForm.solution2Badge || 'Crecimiento'}
                          </span>
                          <h6 className="text-xs font-black text-white line-clamp-2">
                            {solutionsForm.solution2Title || 'Servicios para Redes Sociales'}
                          </h6>
                          <p className="text-[11px] text-zinc-400 line-clamp-2">
                            {solutionsForm.solution2Description}
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-zinc-800/90 border border-purple-500/40 space-y-1.5 bg-gradient-to-br from-purple-950/40 to-zinc-900">
                          <div className="flex items-center justify-between">
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500 text-white">
                              {solutionsForm.solution3Badge || 'Pack Negocio'}
                            </span>
                            <span className="text-[10px] font-black text-amber-400">
                              {solutionsForm.packNegocioPrice}
                            </span>
                          </div>
                          <h6 className="text-xs font-black text-white line-clamp-2">
                            {solutionsForm.solution3Title || 'Pack Negocio'}
                          </h6>
                          <p className="text-[11px] text-zinc-400 line-clamp-2">
                            {solutionsForm.solution3Description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={savingSolutions}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#5e29c8] hover:bg-[#4f21ab] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#5e29c8]/25 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        <span>{savingSolutions ? 'Guardando Soluciones...' : 'Guardar Todos los Títulos de Soluciones'}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* ======================================================== */}
                {/* 4. GESTOR DE SEO & METADATOS DINÁMICOS                   */}
                {/* ======================================================== */}
                {activeSection === 'seo' && (
                  <form onSubmit={handleSaveSeo} className="space-y-6 max-w-4xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200">
                      <div>
                        <h4 className="text-base font-black text-zinc-950 flex items-center gap-2">
                          <Globe className="w-5 h-5 text-emerald-600" />
                          <span>SEO & Posicionamiento Orgánico Dinámico</span>
                        </h4>
                        <p className="text-xs text-zinc-500">
                          Configura las metaetiquetas que se sincronizan desde Firestore para Google, WhatsApp, redes sociales y Schema.org.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={savingSeo}
                        className="px-5 py-2.5 rounded-xl bg-[#5e29c8] hover:bg-[#4f21ab] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#5e29c8]/25 disabled:opacity-50 shrink-0"
                      >
                        <Save className="w-4 h-4" />
                        <span>{savingSeo ? 'Guardando SEO...' : 'Guardar SEO'}</span>
                      </button>
                    </div>

                    {/* Formulario de Metadatos */}
                    <div className="rounded-2xl bg-zinc-50 border border-zinc-200 p-4 sm:p-5 space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-zinc-800 mb-1">
                          Nombre del Negocio / Título SEO Principal
                        </label>
                        <input
                          type="text"
                          value={seoForm.seoBusinessName}
                          onChange={(e) => setSeoForm({ ...seoForm, seoBusinessName: e.target.value })}
                          placeholder="ImpulsaNet - Agencia Digital & Tarjetas Interactivas"
                          className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 text-xs bg-white font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#5e29c8]/30"
                          required
                        />
                        <span className="text-[11px] text-zinc-500 mt-1 block">
                          Aparece como título en la pestaña del navegador y como encabezado principal en los resultados de Google.
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-zinc-800">
                            Descripción Corta (Meta Description)
                          </label>
                          <span className={`text-[11px] font-mono font-bold ${
                            seoForm.seoDescription.length > 160 ? 'text-amber-600' : 'text-emerald-700'
                          }`}>
                            {seoForm.seoDescription.length}/160 caracteres (recomendado: 120-160)
                          </span>
                        </div>
                        <textarea
                          rows={3}
                          value={seoForm.seoDescription}
                          onChange={(e) => setSeoForm({ ...seoForm, seoDescription: e.target.value })}
                          placeholder="Agencia de servicios digitales en Colombia. Tarjetas interactivas con QR de pago único y servicios de crecimiento para redes sociales con entrega rápida."
                          className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 text-xs bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#5e29c8]/30"
                          required
                        />
                        <span className="text-[11px] text-zinc-500 mt-1 block">
                          El fragmento de texto que describe tu negocio en Google y al compartir el enlace por WhatsApp.
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-800 mb-1">
                          Palabras Clave (Keywords para Posicionamiento Orgánico)
                        </label>
                        <textarea
                          rows={2}
                          value={seoForm.seoKeywords}
                          onChange={(e) => setSeoForm({ ...seoForm, seoKeywords: e.target.value })}
                          placeholder="tarjetas digitales con QR Colombia, comprar seguidores instagram colombia, tarjetas interactivas nfc, servicios para redes sociales, impulsanet"
                          className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 text-xs bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#5e29c8]/30 font-mono text-[11px]"
                          required
                        />
                        <span className="text-[11px] text-zinc-500 mt-1 block">
                          Términos de búsqueda separados por comas. Orientan a los motores de búsqueda sobre el contenido de tu web.
                        </span>
                      </div>
                    </div>

                    {/* Simulador Interactivo de Búsqueda de Google */}
                    <div className="rounded-2xl bg-white border-2 border-emerald-200 p-4 sm:p-5 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-white border border-zinc-200 flex items-center justify-center p-0.5">
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                            </svg>
                          </div>
                          <span className="text-xs font-black text-zinc-900">
                            Simulador en Tiempo Real de Google Search
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Previsualización SERP
                        </span>
                      </div>

                      {/* Card estilo Google */}
                      <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1">
                        <div className="flex items-center gap-2 text-xs text-zinc-600">
                          <img
                            src={settings.logoUrl || "https://cdn.phototourl.com/member/2026-10-08-92ac8cdb-f316-40bc-ad16-3f22cb980788.png"}
                            alt=""
                            className="w-4 h-4 rounded-full"
                          />
                          <span className="font-medium text-zinc-800">{settings.agencyName || 'ImpulsaNet'}</span>
                          <span className="text-zinc-400">›</span>
                          <span className="text-zinc-500 font-mono text-[11px]">https://impulsanet.digital</span>
                        </div>

                        <h5 className="text-base font-medium text-[#1a0dab] hover:underline cursor-pointer line-clamp-1">
                          {seoForm.seoBusinessName || 'ImpulsaNet - Agencia Digital & Tarjetas Interactivas'}
                        </h5>

                        <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                          {seoForm.seoDescription || 'Agencia de servicios digitales en Colombia. Tarjetas interactivas con QR de pago único y servicios de crecimiento para redes sociales con entrega rápida.'}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 pt-1 text-[11px] text-zinc-500">
                        <span className="flex items-center gap-1 font-bold text-emerald-700">
                          <Check className="w-3.5 h-3.5" /> Schema.org JSON-LD Activo
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-bold text-emerald-700">
                          <Check className="w-3.5 h-3.5" /> OpenGraph & Twitter Cards
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={savingSeo}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#5e29c8] hover:bg-[#4f21ab] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#5e29c8]/25 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        <span>{savingSeo ? 'Guardando...' : 'Guardar Etiquetas SEO'}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* ======================================================== */}
                {/* 5. GESTOR DE PREGUNTAS FRECUENTES (FAQ)                  */}
                {/* ======================================================== */}
                {activeSection === 'faqs' && (
                  <div className="space-y-5 max-w-3xl">
                    <div className="pb-3 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-base font-black text-zinc-950 flex items-center gap-2">
                          <HelpCircle className="w-5 h-5 text-[#5e29c8]" />
                          <span>Preguntas Frecuentes (FAQ)</span>
                        </h4>
                        <p className="text-xs text-zinc-500">
                          Edita, añade o elimina las preguntas desplegables que se muestran en la página principal.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleAddFaq}
                          className="px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#5e29c8] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-purple-200"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Agregar Pregunta</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSaveFaqs()}
                          disabled={savingFaqs}
                          className="px-4 py-2 rounded-xl bg-[#5e29c8] hover:bg-[#4f21ab] disabled:opacity-60 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-[#5e29c8]/25 cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{savingFaqs ? 'Publicando...' : 'Publicar Cambios'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Aviso informativo de publicación */}
                    <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-200/60 flex items-start gap-3">
                      <Sparkles className="w-4 h-4 text-[#5e29c8] shrink-0 mt-0.5" />
                      <div className="text-xs text-zinc-600 leading-relaxed">
                        <strong className="text-[#5e29c8]">Visible en vivo en la tienda:</strong> Todos los cambios que guardes aquí se sincronizan de inmediato en la base de datos Firestore y se actualizan al instante en la sección desplegable del inicio para todos tus visitantes.
                      </div>
                    </div>

                    {/* Lista de Preguntas */}
                    <div className="space-y-3.5">
                      {faqsForm.map((faq, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-purple-200 transition-all space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-zinc-200 text-xs font-bold text-zinc-700">
                              <HelpCircle className="w-3.5 h-3.5 text-[#5e29c8]" />
                              <span>Pregunta #{index + 1}</span>
                            </span>

                            <button
                              type="button"
                              onClick={() => handleRemoveFaq(index)}
                              className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Eliminar pregunta"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-1">
                              Título de la Pregunta
                            </label>
                            <input
                              type="text"
                              value={faq.question}
                              onChange={(e) => handleUpdateFaq(index, 'question', e.target.value)}
                              placeholder="Ej: ¿Necesitan mi contraseña?"
                              className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs font-semibold bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-1">
                              Respuesta Desplegable
                            </label>
                            <textarea
                              rows={3}
                              value={faq.answer}
                              onChange={(e) => handleUpdateFaq(index, 'answer', e.target.value)}
                              placeholder="Escribe la respuesta detallada..."
                              className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] leading-relaxed"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={handleAddFaq}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Agregar otra pregunta</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSaveFaqs()}
                        disabled={savingFaqs}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#5e29c8] hover:bg-[#4f21ab] disabled:opacity-60 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-[#5e29c8]/25 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>{savingFaqs ? 'Guardando...' : 'Guardar y Publicar Preguntas Frecuentes'}</span>
                      </button>
                    </div>
                  </div>
                )}
                {/* ======================================================== */}
                {/* 7. EDITOR: CONTACTO, WHATSAPP & REDES OFICIALES         */}
                {/* ======================================================== */}
                {activeSection === 'whatsapp' && (
                  <form onSubmit={handleSaveWhatsapp} className="space-y-6 max-w-4xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200">
                      <div>
                        <h4 className="text-base font-black text-zinc-950 flex items-center gap-2">
                          <MessageCircle className="w-5 h-5 text-emerald-500" />
                          <span>Editor de "Contacto, WhatsApp & Redes Oficiales"</span>
                        </h4>
                        <p className="text-xs text-zinc-500">
                          Configura la línea oficial de WhatsApp para pedidos y todos los enlaces de Instagram, TikTok, YouTube y Facebook.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={savingWhatsapp}
                        className="px-5 py-2.5 rounded-xl bg-[#5e29c8] hover:bg-[#4f21ab] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#5e29c8]/25 disabled:opacity-50 shrink-0"
                      >
                        <Save className="w-4 h-4" />
                        <span>{savingWhatsapp ? 'Guardando...' : 'Guardar Todos los Canales'}</span>
                      </button>
                    </div>

                    {/* Acordeón 1: WhatsApp Oficial */}
                    <div className="rounded-2xl bg-zinc-50 border border-zinc-200 overflow-hidden transition-all shadow-xs">
                      <div 
                        onClick={() => toggleAccordion('contact-wa')}
                        className="px-4 py-3.5 flex items-center justify-between cursor-pointer hover:bg-zinc-100/70 select-none transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold font-mono">WA</span>
                          <div>
                            <span className="text-xs font-black uppercase text-zinc-900 block">Línea Oficial de WhatsApp</span>
                            <span className="text-[11px] text-zinc-500">Número: +{contactForm.whatsappNumber} · Mensaje predeterminado de inicio</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-500">
                            {openSections['contact-wa'] ? <ChevronDown className="w-4 h-4 text-[#5e29c8]" /> : <ChevronRight className="w-4 h-4" />}
                          </div>
                        </div>
                      </div>

                      {openSections['contact-wa'] && (
                        <div className="p-4 pt-3 border-t border-zinc-200 space-y-4 bg-white">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-zinc-800 mb-1">
                                Número de WhatsApp (código de país sin espacios ni '+')
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400 font-mono">+</span>
                                <input
                                  type="text"
                                  placeholder="573212515944"
                                  value={contactForm.whatsappNumber}
                                  onChange={(e) => setContactForm({ ...contactForm, whatsappNumber: e.target.value })}
                                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-zinc-300 text-xs font-mono font-bold text-emerald-700 bg-white"
                                  required
                                />
                              </div>
                              <span className="text-[10px] text-zinc-500 mt-1 block">
                                Enlace generado: <code className="text-zinc-700">wa.me/{contactForm.whatsappNumber.replace(/[^0-9]/g, '')}</code>
                              </span>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-zinc-800 mb-1">Correo de Soporte / Atención</label>
                              <div className="relative">
                                <AtSign className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                  type="email"
                                  placeholder="contacto@impulsanet.digital"
                                  value={contactForm.contactEmail}
                                  onChange={(e) => setContactForm({ ...contactForm, contactEmail: e.target.value })}
                                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white"
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-zinc-800 mb-1">Mensaje Predeterminado de Consulta</label>
                            <textarea
                              rows={2}
                              value={contactForm.whatsappDefaultMessage}
                              onChange={(e) => setContactForm({ ...contactForm, whatsappDefaultMessage: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white"
                              required
                            />
                            <span className="text-[10px] text-zinc-500 mt-0.5 block">
                              Texto con el que se abre el chat cuando el cliente pulsa el botón de WhatsApp general.
                            </span>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-zinc-800 mb-1">Ubicación / Cobertura de la Agencia</label>
                            <div className="relative">
                              <MapPin className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                              <input
                                type="text"
                                placeholder="Colombia · Envíos digitales a todo el país"
                                value={contactForm.contactLocation}
                                onChange={(e) => setContactForm({ ...contactForm, contactLocation: e.target.value })}
                                className="w-full pl-8 pr-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Acordeón 2: Redes Sociales Oficiales */}
                    <div className="rounded-2xl bg-zinc-50 border border-zinc-200 overflow-hidden transition-all shadow-xs">
                      <div 
                        onClick={() => toggleAccordion('contact-social')}
                        className="px-4 py-3.5 flex items-center justify-between cursor-pointer hover:bg-zinc-100/70 select-none transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center text-xs font-bold font-mono">IG</span>
                          <div>
                            <span className="text-xs font-black uppercase text-zinc-900 block">Redes Sociales Oficiales</span>
                            <span className="text-[11px] text-zinc-500">Instagram, TikTok, YouTube y Facebook vinculados a la tienda</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-500">
                            {openSections['contact-social'] ? <ChevronDown className="w-4 h-4 text-[#5e29c8]" /> : <ChevronRight className="w-4 h-4" />}
                          </div>
                        </div>
                      </div>

                      {openSections['contact-social'] && (
                        <div className="p-4 pt-3 border-t border-zinc-200 space-y-3.5 bg-white">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {/* Instagram */}
                            <div className="p-3 rounded-xl bg-pink-50/50 border border-pink-100 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-pink-900 flex items-center gap-1.5">
                                  <span>Instagram Oficial</span>
                                </label>
                                {contactForm.instagram && (
                                  <a
                                    href={contactForm.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] font-bold text-pink-600 hover:underline flex items-center gap-0.5"
                                  >
                                    <span>Ver</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                              <input
                                type="url"
                                value={contactForm.instagram}
                                onChange={(e) => setContactForm({ ...contactForm, instagram: e.target.value })}
                                placeholder="https://instagram.com/tu_cuenta"
                                className="w-full px-3 py-1.5 rounded-lg border border-pink-200 text-xs bg-white font-mono"
                              />
                            </div>

                            {/* TikTok */}
                            <div className="p-3 rounded-xl bg-zinc-100/60 border border-zinc-200 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                                  <span>TikTok Oficial</span>
                                </label>
                                {contactForm.tiktok && (
                                  <a
                                    href={contactForm.tiktok}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] font-bold text-zinc-700 hover:underline flex items-center gap-0.5"
                                  >
                                    <span>Ver</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                              <input
                                type="url"
                                value={contactForm.tiktok}
                                onChange={(e) => setContactForm({ ...contactForm, tiktok: e.target.value })}
                                placeholder="https://tiktok.com/@tu_cuenta"
                                className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 text-xs bg-white font-mono"
                              />
                            </div>

                            {/* YouTube */}
                            <div className="p-3 rounded-xl bg-red-50/50 border border-red-100 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-red-900 flex items-center gap-1.5">
                                  <span>Canal de YouTube</span>
                                </label>
                                {contactForm.youtube && (
                                  <a
                                    href={contactForm.youtube}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] font-bold text-red-600 hover:underline flex items-center gap-0.5"
                                  >
                                    <span>Ver</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                              <input
                                type="url"
                                value={contactForm.youtube}
                                onChange={(e) => setContactForm({ ...contactForm, youtube: e.target.value })}
                                placeholder="https://youtube.com/@tu_canal"
                                className="w-full px-3 py-1.5 rounded-lg border border-red-200 text-xs bg-white font-mono"
                              />
                            </div>

                            {/* Facebook */}
                            <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                                  <span>Página de Facebook</span>
                                </label>
                                {contactForm.facebook && (
                                  <a
                                    href={contactForm.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-0.5"
                                  >
                                    <span>Ver</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                              <input
                                type="url"
                                value={contactForm.facebook}
                                onChange={(e) => setContactForm({ ...contactForm, facebook: e.target.value })}
                                placeholder="https://facebook.com/tu_pagina"
                                className="w-full px-3 py-1.5 rounded-lg border border-blue-200 text-xs bg-white font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={savingWhatsapp}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#5e29c8] hover:bg-[#4f21ab] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#5e29c8]/25 disabled:opacity-50 transition-all"
                      >
                        <Save className="w-4 h-4" />
                        <span>{savingWhatsapp ? 'Guardando Canales...' : 'Guardar Todos los Canales de Contacto'}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* ======================================================== */}
                {/* 4. SEGURIDAD & ACCESO AL SISTEMA                         */}
                {/* ======================================================== */}
                {activeSection === 'security' && (
                  <div className="space-y-5 max-w-2xl">
                    <div className="pb-3 border-b border-zinc-200">
                      <h4 className="text-base font-black text-zinc-950 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-[#5e29c8]" />
                        <span>Seguridad & Acceso al Sistema</span>
                      </h4>
                      <p className="text-xs text-zinc-500">
                        Configuración de autenticación y privilegios de administración.
                      </p>
                    </div>

                    {/* Tarjeta Informativa Principal */}
                    <div className="rounded-2xl bg-zinc-50 border border-zinc-200 overflow-hidden shadow-xs">
                      <div className="p-5 space-y-4 bg-white">
                        <div className="flex items-start justify-between gap-4 pb-4 border-b border-zinc-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#5e29c8] flex items-center justify-center font-bold">
                              <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                              <h5 className="text-xs font-black uppercase text-zinc-900">
                                Acceso sin contraseña habilitado
                              </h5>
                              <p className="text-[11px] text-zinc-500">
                                El sistema solo acepta inicios de sesión verificados mediante Google con el correo designado.
                              </p>
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                            Activo
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
                            <span className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">
                              Correo Autorizado Único
                            </span>
                            <span className="font-mono text-xs font-bold text-zinc-900 break-all select-all block">
                              {ADMIN_EMAIL}
                            </span>
                            <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-flex items-center gap-1">
                              <Check className="w-3 h-3" /> Verificado y protegido
                            </span>
                          </div>

                          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
                            <span className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">
                              Acceso por Contraseña
                            </span>
                            <span className="text-xs font-bold text-zinc-700 block">
                              Deshabilitado Totalmente
                            </span>
                            <span className="text-[10px] text-zinc-500 mt-1 block">
                              Sin riesgo de contraseñas filtradas
                            </span>
                          </div>

                          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
                            <span className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">
                              Método de Autenticación
                            </span>
                            <span className="text-xs font-bold text-zinc-900 block">
                              Google SSO Seguro
                            </span>
                            <span className="text-[10px] text-zinc-500 mt-1 block">
                              Inicio de sesión en un toque
                            </span>
                          </div>

                          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
                            <span className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">
                              Dirección IP Conectada
                            </span>
                            <span className="font-mono text-xs font-bold text-zinc-900 block">
                              {clientIp}
                            </span>
                            <span className="text-[10px] text-zinc-500 mt-1 block">
                              Monitoreo de conexión activo
                            </span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2 text-xs text-zinc-600">
                            <UserCheck className="w-4 h-4 text-emerald-600" />
                            <span>Sesión activa como Propietario</span>
                          </div>

                          <button
                            type="button"
                            onClick={onLogout}
                            className="px-3.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-rose-50 hover:text-rose-600 text-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Cerrar Sesión</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Mantenimiento de Fábrica */}
                    <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-zinc-900 block">Restablecimiento de Fábrica</span>
                        <span className="text-[11px] text-zinc-500">Restaura todos los textos, servicios y precios iniciales.</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-200 text-xs font-bold text-zinc-700 flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Restaurar Fábrica</span>
                      </button>
                    </div>
                  </div>
                )}
              </main>
            </>
          )}
        </div>
      </div>

      {/* Modal: Crear Nuevo Paquete de Redes */}
      {showAddPackModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-zinc-200 rounded-3xl max-w-md w-full p-5 shadow-2xl relative">
            <button
              onClick={() => setShowAddPackModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="text-base font-black text-zinc-950 mb-1">Crear Nuevo Paquete</h4>
            <p className="text-xs text-zinc-500 mb-4">Añade una nueva oferta a la web en tiempo real.</p>

            <form onSubmit={handleCreateNewPack} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 mb-1">Plataforma</label>
                  <select
                    value={newPack.platform}
                    onChange={(e) => setNewPack({ ...newPack, platform: e.target.value as SocialPlatform })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 text-xs bg-white"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube</option>
                    <option value="facebook">Facebook</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 mb-1">Tipo</label>
                  <select
                    value={newPack.type}
                    onChange={(e) => setNewPack({ ...newPack, type: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-300 text-xs bg-white"
                  >
                    <option value="seguidores">Seguidores</option>
                    <option value="likes">Me gusta</option>
                    <option value="vistas">Vistas</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">Título del Paquete</label>
                <input
                  type="text"
                  placeholder="Ej: 5.000 Seguidores Instagram"
                  value={newPack.title}
                  onChange={(e) => setNewPack({ ...newPack, title: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 text-xs text-zinc-900"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">Precio Referencial</label>
                <input
                  type="text"
                  placeholder="Ej: $35.000 COP"
                  value={newPack.price}
                  onChange={(e) => setNewPack({ ...newPack, price: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 text-xs font-bold text-[#5e29c8]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">Descripción Breve</label>
                <input
                  type="text"
                  placeholder="Cuentas activas con entrega rápida..."
                  value={newPack.description}
                  onChange={(e) => setNewPack({ ...newPack, description: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 text-xs text-zinc-900"
                />
              </div>

              <div className="space-y-1 pt-1">
                <label className="block text-[10px] font-bold text-zinc-700 uppercase">3 Beneficios del Paquete</label>
                <input
                  type="text"
                  value={newPack.feature1}
                  onChange={(e) => setNewPack({ ...newPack, feature1: e.target.value })}
                  className="w-full px-2 py-1 rounded border border-zinc-300 text-xs"
                />
                <input
                  type="text"
                  value={newPack.feature2}
                  onChange={(e) => setNewPack({ ...newPack, feature2: e.target.value })}
                  className="w-full px-2 py-1 rounded border border-zinc-300 text-xs"
                />
                <input
                  type="text"
                  value={newPack.feature3}
                  onChange={(e) => setNewPack({ ...newPack, feature3: e.target.value })}
                  className="w-full px-2 py-1 rounded border border-zinc-300 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPackModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-xs font-semibold text-zinc-700 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#5e29c8] hover:bg-[#4f21ab] text-white text-xs font-bold cursor-pointer"
                >
                  Publicar Paquete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
