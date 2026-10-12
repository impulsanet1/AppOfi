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

type AdminSection = 'cards' | 'social' | 'faqs' | 'whatsapp' | 'security';

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

  const [activeSection, setActiveSection] = useState<AdminSection>('cards');
  const [clientIp, setClientIp] = useState<string>('Detectando...');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Acordeón para desplegar / contraer secciones dentro de cada módulo
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'cards-header': true,
    'cards-plans': false,
    'cards-demo': false,
    'social-header': false,
    'social-packs': true,
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

    // Plan 1: Básica
    cardPlan1Badge: settings.cardPlan1Badge || 'Plan Estándar',
    cardPlan1Title: settings.cardPlan1Title || 'Tarjeta Virtual Básica',
    cardsBasicPrice: settings.cardsBasicPrice || '$79.000 COP',
    cardPlan1ButtonText: settings.cardPlan1ButtonText || 'Pedir Tarjeta Virtual',
    cardPlan1Features: settings.cardPlan1Features || [
      'Enlace web permanente 100% online',
      'Código QR de alta definición para compartir',
      'Botón para guardar contacto en la agenda (.vcf)',
      'Botones a WhatsApp, llamada y redes'
    ],

    // Plan 2: Pro
    cardPlan2Badge: settings.cardPlan2Badge || 'Comercial / Con Catálogo',
    cardPlan2Title: settings.cardPlan2Title || 'Tarjeta Virtual Pro',
    cardsProPrice: settings.cardsProPrice || '$119.000 COP',
    cardPlan2ButtonText: settings.cardPlan2ButtonText || 'Pedir Tarjeta Pro',
    cardPlan2Features: settings.cardPlan2Features || [
      'Todo lo de la tarjeta básica',
      'Catálogo interactivo de servicios o productos',
      'Botones de datos bancarios para cobrar',
      'Actualizaciones de datos ilimitadas'
    ],

    // Demo Interactivo
    cardDemoName: settings.cardDemoName || 'Sergio Vargas',
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
    socialSectionSpeedTag: settings.socialSectionSpeedTag || 'Inicio en 15-45 min',
  });

  const [servicesList, setServicesList] = useState<SocialServicePack[]>(services);
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('instagram');
  const [adminTypeFilter, setAdminTypeFilter] = useState<'all' | 'seguidores' | 'likes' | 'vistas'>('all');

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
    feature2: 'Comienza en 15-45 minutos',
    feature3: 'Garantía activa de reposición',
  });

  // Configuración WhatsApp
  const [whatsappForm, setWhatsappForm] = useState({
    agencyName: settings.agencyName || 'ImpulsaNet',
    whatsappNumber: settings.whatsappNumber || '573212515944',
    whatsappDefaultMessage: settings.whatsappDefaultMessage || '¡Hola ImpulsaNet! Me interesa solicitar información.',
    logoUrl: settings.logoUrl || 'https://cdn.phototourl.com/member/2026-10-08-92ac8cdb-f316-40bc-ad16-3f22cb980788.png',
  });

  // Sincronizar datos al cambiar settings
  useEffect(() => {
    setCardsForm({
      cardsSectionBadge: settings.cardsSectionBadge || 'MÓDULO 1: TARJETAS VIRTUALES',
      cardsSectionTitle: settings.cardsSectionTitle || 'Tarjetas Virtuales con Código QR & Enlace Web',
      cardsSectionSubtitle: settings.cardsSectionSubtitle || '100% digitales. Comparte tu contacto, WhatsApp, redes y catálogo en 1 toque. Sin costos mensuales.',
      cardsDeliveryTag: settings.cardsDeliveryTag || '● Entrega en 24 horas',
      cardPlan1Badge: settings.cardPlan1Badge || 'Plan Estándar',
      cardPlan1Title: settings.cardPlan1Title || 'Tarjeta Virtual Básica',
      cardsBasicPrice: settings.cardsBasicPrice || '$79.000 COP',
      cardPlan1ButtonText: settings.cardPlan1ButtonText || 'Pedir Tarjeta Virtual',
      cardPlan1Features: settings.cardPlan1Features || [
        'Enlace web permanente 100% online',
        'Código QR de alta definición para compartir',
        'Botón para guardar contacto en la agenda (.vcf)',
        'Botones a WhatsApp, llamada y redes'
      ],
      cardPlan2Badge: settings.cardPlan2Badge || 'Comercial / Con Catálogo',
      cardPlan2Title: settings.cardPlan2Title || 'Tarjeta Virtual Pro',
      cardsProPrice: settings.cardsProPrice || '$119.000 COP',
      cardPlan2ButtonText: settings.cardPlan2ButtonText || 'Pedir Tarjeta Pro',
      cardPlan2Features: settings.cardPlan2Features || [
        'Todo lo de la tarjeta básica',
        'Catálogo interactivo de servicios o productos',
        'Botones de datos bancarios para cobrar',
        'Actualizaciones de datos ilimitadas'
      ],
      cardDemoName: settings.cardDemoName || 'Sergio Vargas',
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
      socialSectionSpeedTag: settings.socialSectionSpeedTag || 'Inicio en 15-45 min',
    });

    setWhatsappForm({
      agencyName: settings.agencyName || 'ImpulsaNet',
      whatsappNumber: settings.whatsappNumber || '573212515944',
      whatsappDefaultMessage: settings.whatsappDefaultMessage || '¡Hola ImpulsaNet! Me interesa solicitar información.',
      logoUrl: settings.logoUrl || 'https://cdn.phototourl.com/member/2026-10-08-92ac8cdb-f316-40bc-ad16-3f22cb980788.png',
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
      });
      showToast('success', 'Encabezado de Tarjetas Guardado', 'Título y subtítulo actualizados.');
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
      });
      showToast('success', 'Encabezado de Redes Guardado', 'Título y subtítulo actualizados en la web.');
    } catch (err) {
      showToast('error', 'Error al guardar encabezados', String(err));
    } finally {
      setSavingSocialHeaders(false);
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
      feature2: 'Comienza en 15-45 minutos',
      feature3: 'Garantía activa de reposición',
    });

    try {
      await onSaveServices(updated);
      showToast('success', 'Nuevo Paquete Publicado con Éxito');
    } catch (err) {
      showToast('error', 'Error al crear paquete', String(err));
    }
  };

  // WhatsApp Save
  const [savingWhatsapp, setSavingWhatsapp] = useState(false);
  const handleSaveWhatsapp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingWhatsapp(true);
    try {
      await onSaveSettings(whatsappForm);
      showToast('success', 'Datos de WhatsApp Guardados');
    } catch (err) {
      showToast('error', 'Error al guardar WhatsApp', String(err));
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
        {/* Barra Superior */}
        <div className="px-5 py-3.5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <img
              src={settings.logoUrl || "https://cdn.phototourl.com/member/2026-10-08-92ac8cdb-f316-40bc-ad16-3f22cb980788.png"}
              alt="ImpulsaNet Logo"
              className="w-8 h-8 object-contain rounded-xl shadow-xs border border-zinc-200 bg-white p-0.5"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-zinc-950">Centro de Edición de Sistema ImpulsaNet</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                  En Vivo
                </span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">
                IP: {clientIp}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isLoggedIn && (
              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-600 hover:text-rose-600 hover:bg-rose-50 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Salir</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-200 cursor-pointer"
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
              {/* Barra de Navegación Lateral */}
              <aside className="w-full md:w-64 bg-zinc-50 border-r border-zinc-200 p-3 shrink-0 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-y-auto">
                <button
                  onClick={() => setActiveSection('cards')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer shrink-0 ${
                    activeSection === 'cards'
                      ? 'bg-[#5e29c8] text-white shadow-xs'
                      : 'text-zinc-700 hover:bg-zinc-200/70'
                  }`}
                >
                  <CreditCard className="w-4 h-4 shrink-0" />
                  <span>1. Tarjetas Virtuales</span>
                </button>

                <button
                  onClick={() => setActiveSection('social')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer shrink-0 ${
                    activeSection === 'social'
                      ? 'bg-[#5e29c8] text-white shadow-xs'
                      : 'text-zinc-700 hover:bg-zinc-200/70'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 shrink-0" />
                  <span>2. Redes Sociales (Packs)</span>
                </button>

                <button
                  onClick={() => setActiveSection('faqs')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer shrink-0 ${
                    activeSection === 'faqs'
                      ? 'bg-[#5e29c8] text-white shadow-xs'
                      : 'text-zinc-700 hover:bg-zinc-200/70'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <span>3. Preguntas Frecuentes</span>
                </button>

                <button
                  onClick={() => setActiveSection('whatsapp')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer shrink-0 ${
                    activeSection === 'whatsapp'
                      ? 'bg-[#5e29c8] text-white shadow-xs'
                      : 'text-zinc-700 hover:bg-zinc-200/70'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>4. WhatsApp & Contacto</span>
                </button>

                <button
                  onClick={() => setActiveSection('security')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer shrink-0 ${
                    activeSection === 'security'
                      ? 'bg-[#5e29c8] text-white shadow-xs'
                      : 'text-zinc-700 hover:bg-zinc-200/70'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>5. Seguridad & Acceso</span>
                </button>

                <div className="pt-4 mt-auto border-t border-zinc-200 hidden md:block">
                  <button
                    onClick={handleReset}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-semibold text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/60 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restaurar Fábrica</span>
                  </button>
                </div>
              </aside>

              {/* Área Principal */}
              <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white">
                {/* ======================================================== */}
                {/* 1. EDITOR COMPLETO: TARJETAS VIRTUALES CON CÓDIGO QR   */}
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
                            <span className="text-[11px] text-zinc-500">Tarjeta Básica ({cardsForm.cardsBasicPrice}) y Tarjeta Pro ({cardsForm.cardsProPrice})</span>
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
                                  { id: 'likes', label: 'Likes' },
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

                            <span className="text-[11px] font-semibold text-zinc-500 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100 text-[#5e29c8]">
                              ✓ Ordenado por cantidad: 1.000 arriba, luego 1.500 o 2.000
                            </span>
                          </div>

                          {/* Lista Completa de Paquetes Ordenados de Menor a Mayor Cantidad */}
                          <div className="space-y-3">
                            {servicesList
                              .filter((p) => p.platform === selectedPlatform)
                              .filter((p) => adminTypeFilter === 'all' || p.type === adminTypeFilter)
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
                                  <option value="likes">Likes</option>
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
                {/* 3. GESTOR DE PREGUNTAS FRECUENTES (FAQ)                  */}
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
                {activeSection === 'whatsapp' && (
                  <div className="space-y-4 max-w-xl">
                    <div className="pb-3 border-b border-zinc-200">
                      <h4 className="text-base font-black text-zinc-950 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-[#5e29c8]" />
                        <span>Canal WhatsApp & Datos de Contacto</span>
                      </h4>
                      <p className="text-xs text-zinc-500">Configura la línea oficial a donde llegan las compras y consultas de clientes.</p>
                    </div>

                    <div className="rounded-2xl bg-zinc-50 border border-zinc-200 overflow-hidden transition-all shadow-xs">
                      <div 
                        onClick={() => toggleAccordion('whatsapp-config')}
                        className="px-4 py-3.5 flex items-center justify-between cursor-pointer hover:bg-zinc-100/70 select-none transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold font-mono">WA</span>
                          <div>
                            <span className="text-xs font-black uppercase text-zinc-900 block">Línea WhatsApp y Mensaje Predeterminado</span>
                            <span className="text-[11px] text-zinc-500">Número: +{whatsappForm.whatsappNumber} ({whatsappForm.agencyName})</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-500">
                            {openSections['whatsapp-config'] ? <ChevronDown className="w-4 h-4 text-[#5e29c8]" /> : <ChevronRight className="w-4 h-4" />}
                          </div>
                        </div>
                      </div>

                      {openSections['whatsapp-config'] && (
                        <form onSubmit={handleSaveWhatsapp} className="p-4 pt-3 border-t border-zinc-200 space-y-4 bg-white">
                          <div>
                            <label className="block text-xs font-bold text-zinc-700 mb-1">Nombre Comercial de la Agencia</label>
                            <input
                              type="text"
                              value={whatsappForm.agencyName}
                              onChange={(e) => setWhatsappForm({ ...whatsappForm, agencyName: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-zinc-700 mb-1">Logo Oficial de ImpulsaNet (URL)</label>
                            <div className="flex items-center gap-3">
                              <img
                                src={whatsappForm.logoUrl || "https://cdn.phototourl.com/member/2026-10-08-92ac8cdb-f316-40bc-ad16-3f22cb980788.png"}
                                alt="Logo Preview"
                                className="w-10 h-10 object-contain rounded-xl border border-zinc-200 bg-white p-1 shadow-2xs shrink-0"
                              />
                              <input
                                type="url"
                                value={whatsappForm.logoUrl || ''}
                                onChange={(e) => setWhatsappForm({ ...whatsappForm, logoUrl: e.target.value })}
                                placeholder="https://..."
                                className="flex-1 px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white font-mono"
                              />
                            </div>
                            <p className="text-[10px] text-zinc-500 mt-1">
                              Enlace CDN activo del logotipo oficial de la marca.
                            </p>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-zinc-700 mb-1">Número de WhatsApp (con código de país sin espacios)</label>
                            <input
                              type="text"
                              placeholder="573212515944"
                              value={whatsappForm.whatsappNumber}
                              onChange={(e) => setWhatsappForm({ ...whatsappForm, whatsappNumber: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs font-mono font-bold text-emerald-700 bg-white"
                              required
                            />
                            <p className="text-[10px] text-zinc-500 mt-1">
                              Número oficial actual de ImpulsaNet: <strong className="text-zinc-800">573212515944</strong> (+57 321 2515944)
                            </p>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-zinc-700 mb-1">Mensaje Predeterminado de Consulta</label>
                            <textarea
                              rows={3}
                              value={whatsappForm.whatsappDefaultMessage}
                              onChange={(e) => setWhatsappForm({ ...whatsappForm, whatsappDefaultMessage: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs bg-white"
                              required
                            />
                          </div>

                          <div className="flex justify-end pt-2">
                            <button
                              type="submit"
                              disabled={savingWhatsapp}
                              className="px-5 py-2.5 rounded-xl bg-[#5e29c8] hover:bg-[#4f21ab] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#5e29c8]/25"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>{savingWhatsapp ? 'Guardando...' : 'Guardar Datos WhatsApp'}</span>
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
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
                    <option value="likes">Likes</option>
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
