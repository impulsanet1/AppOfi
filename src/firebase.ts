import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDocFromServer,
} from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with explicit database ID from config
export const db = getFirestore(app, (firebaseConfig as { firestoreDatabaseId: string }).firestoreDatabaseId);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot as mandated by the Firebase skill
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'settings', 'general'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore connection check: Client may be offline or initializing.", error.message);
    }
  }
}
testConnection();

// Types
export interface AgencySettings {
  agencyName: string;
  tagline: string;
  heroTitle?: string;
  heroDescription: string;
  heroBadge?: string;
  heroPrimaryBtnText?: string;
  heroSecondaryBtnText?: string;
  bannerNotice?: string;
  step1Title?: string;
  step1Description?: string;
  step2Title?: string;
  step2Description?: string;
  step3Title?: string;
  step3Description?: string;
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  contactEmail?: string;
  contactLocation?: string;
  logoUrl?: string;

  // 1. SECCIÓN: Tarjetas Virtuales con Código QR & Enlace Web
  cardsSectionBadge?: string;
  cardsSectionTitle: string;
  cardsSectionSubtitle: string;
  cardsDeliveryTag?: string;
  cardsPrice?: string;
  cardsStartingPrice?: string;

  // Plan 1: Básica
  cardPlan1Badge?: string;
  cardPlan1Title?: string;
  cardsBasicPrice?: string;
  cardPlan1Features?: string[];
  cardPlan1ButtonText?: string;

  // Plan 2: Pro con Catálogo
  cardPlan2Badge?: string;
  cardPlan2Title?: string;
  cardsProPrice?: string;
  cardPlan2Features?: string[];
  cardPlan2ButtonText?: string;

  // Demo interactivo de tarjeta
  cardDemoName?: string;
  cardDemoRole?: string;
  cardDemoCompany?: string;
  cardDemoPhone?: string;
  cardDemoWhatsapp?: string;
  cardsDemoUrl: string;

  // 2. SECCIÓN: Seguidores, Likes y Vistas para tus Redes
  socialSectionBadge?: string;
  socialSectionTitle?: string;
  socialSectionSubtitle?: string;
  socialSectionSpeedTag?: string;
  socialStartingPrice?: string;

  // 3. SECCIÓN: Preguntas Frecuentes
  faqs?: FAQItem[];

  // Pack Negocio
  packNegocioPrice?: string;

  // 4. SECCIÓN: Nuestras Soluciones Principales (Inicio)
  solutionsSectionTitle?: string;
  solutionsSectionSubtitle?: string;
  solution1Title?: string;
  solution1Badge?: string;
  solution1Description?: string;
  solution2Title?: string;
  solution2Badge?: string;
  solution2Description?: string;
  solution3Title?: string;
  solution3Badge?: string;
  solution3Description?: string;

  // 5. SEO & Metadatos Dinámicos
  seoBusinessName?: string;
  seoDescription?: string;
  seoKeywords?: string;

  // Otros
  socialLinks?: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    facebook?: string;
  };
  blockedIps?: string[];
  updatedAt?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export type SocialPlatform = 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'cards';

export interface SocialServicePack {
  id: string;
  platform: SocialPlatform;
  type: 'seguidores' | 'likes' | 'vistas' | 'tarjeta';
  title: string;
  quantity: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  active?: boolean;
}

export interface DigitalCardData {
  id: string;
  type: 'commercial' | 'creator';
  name: string;
  role: string;
  company: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  tiktok: string;
  qrCodeUrl?: string;
  demoUrl: string;
}

// Defaults
export const DEFAULT_SETTINGS: AgencySettings = {
  agencyName: "ImpulsaNet",
  tagline: "Tarjetas Virtuales & Crecimiento en Redes Sociales",
  heroTitle: "Tu negocio en un QR. Tus redes, en crecimiento.",
  heroDescription: "Tarjeta digital con tu WhatsApp, catálogo y ubicación, y servicios para impulsar tus redes con seguidores, likes y vistas.",
  heroBadge: "Agencia Digital Colombia · Pagos Seguros",
  heroPrimaryBtnText: "Ver tarjetas",
  heroSecondaryBtnText: "Servicios para redes",
  bannerNotice: "⚡ Entregas el mismo día en Colombia · Pagos con Nequi, Daviplata y Bancolombia",
  step1Title: "Elige lo que necesitas",
  step1Description: "Una tarjeta digital con QR para tu negocio, un impulso para tus redes (seguidores, likes o vistas), o ambos en un paquete.",
  step2Title: "Nos envías tus datos",
  step2Description: "Para la tarjeta, nombre, logo, WhatsApp y ubicación; para redes, solo tu usuario o enlace (nunca contraseñas). Pagas por Nequi o transferencia.",
  step3Title: "Lo recibes",
  step3Description: "Tu tarjeta lista el mismo día, con enlace y QR en PNG y PDF; tu impulso de redes entre 1 y 4 horas con garantía de 30 días.",
  whatsappNumber: "573212515944",
  whatsappDefaultMessage: "Hola, vi su web y quiero información",
  contactEmail: "contacto@impulsanet.digital",
  contactLocation: "Colombia · Envíos digitales a todo el país",
  logoUrl: "https://cdn.phototourl.com/member/2026-10-08-92ac8cdb-f316-40bc-ad16-3f22cb980788.png",

  // 1. Tarjetas Virtuales
  cardsSectionBadge: "MÓDULO 1: TARJETAS VIRTUALES",
  cardsSectionTitle: "Tarjetas Virtuales con Código QR & Enlace Web",
  cardsSectionSubtitle: "100% digitales. Comparte tu contacto, WhatsApp, redes y catálogo en 1 toque. Sin costos mensuales.",
  cardsDeliveryTag: "● Entrega en 24 horas",
  cardsPrice: "$79.000 COP",
  cardsStartingPrice: "$79.000 COP",

  // Plan 1: Estándar
  cardPlan1Badge: "Plan Estándar",
  cardPlan1Title: "Tarjeta Básica",
  cardsBasicPrice: "$79.000 COP",
  cardPlan1Features: [
    "Tarjeta con tu logo y colores",
    "Enlace web propio",
    "QR descargable en PNG y PDF",
    "Botón de WhatsApp y redes",
    "Pago único"
  ],
  cardPlan1ButtonText: "Pedir Tarjeta",

  // Plan 2: Pro
  cardPlan2Badge: "Comercial / Con Catálogo",
  cardPlan2Title: "Tarjeta Virtual Pro",
  cardsProPrice: "$119.000 COP",
  cardPlan2Features: [
    "Todo lo del Estándar",
    "Catálogo de productos o servicios",
    "Botón para guardar tu contacto",
    "Cambios de información durante 1 año"
  ],
  cardPlan2ButtonText: "Pedir Tarjeta Pro",

  // Demo
  cardDemoName: "Sergio Vargas",
  cardDemoRole: "Emprendedor & Asesor Digital",
  cardDemoCompany: "ImpulsaNet Studio",
  cardDemoPhone: "+57 321 2515944",
  cardDemoWhatsapp: "573212515944",
  cardsDemoUrl: "https://impulsanet.digital/demo-card",

  // 2. Redes Sociales
  socialSectionBadge: "CRECIMIENTO EN REDES",
  socialSectionTitle: "Seguidores, Likes y Vistas para tus Redes",
  socialSectionSubtitle: "Impulsa tus métricas, credibilidad y alcance algorítmico sin compartir contraseñas.",
  socialSectionSpeedTag: "Entrega habitual en 30 minutos · máximo 4 horas",
  socialStartingPrice: "$5.000 COP",

  // Pack Negocio
  packNegocioPrice: "$80.000 COP",

  // 4. Nuestras Soluciones Principales (Inicio)
  solutionsSectionTitle: "Nuestras Soluciones Principales",
  solutionsSectionSubtitle: "Explora las demostraciones y los catálogos con precios claros en pesos colombianos.",
  solution1Title: "Tarjeta Digital con QR",
  solution1Badge: "Destacado",
  solution1Description: "Perfiles interactivos con QR permanente, WhatsApp, catálogo y ubicación.",
  solution2Title: "Servicios para Redes Sociales",
  solution2Badge: "Crecimiento",
  solution2Description: "Seguidores, likes y reproducciones para tus redes sin contraseñas.",
  solution3Title: "Pack Negocio: Tarjeta Pro + 1.000 seguidores de Instagram",
  solution3Badge: "Pack Negocio",
  solution3Description: "El paquete integral para presentar tu marca y acelerar tu Instagram al mismo tiempo.",

  // 5. SEO Dinámico
  seoBusinessName: "ImpulsaNet - Agencia Digital & Tarjetas Interactivas",
  seoDescription: "Agencia de servicios digitales en Colombia. Tarjetas interactivas con QR de pago único y servicios de crecimiento para redes sociales con entrega rápida.",
  seoKeywords: "tarjetas digitales con QR Colombia, comprar seguidores instagram colombia, tarjetas interactivas nfc, servicios para redes sociales, impulsanet",

  socialLinks: {
    instagram: "https://instagram.com/impulsanet.digital",
    tiktok: "https://tiktok.com/@impulsanet.digital",
    youtube: "https://youtube.com/@impulsanet",
    facebook: "https://facebook.com/impulsanet",
  },
  faqs: [
    {
      question: '¿Necesitan mi contraseña?',
      answer:
        'No. Nunca te pedimos contraseñas ni acceso a tu cuenta. Somos una tienda virtual: solo necesitamos el enlace o el usuario público de tu perfil o publicación.',
    },
    {
      question: '¿Cuánto tardan en llegar los seguidores, likes o vistas?',
      answer:
        'El tiempo estimado es de 1 a 4 horas. Normalmente llegan en unos 30 minutos.',
    },
    {
      question: '¿Tienen garantía?',
      answer:
        'Sí. La mayoría de nuestros servicios incluyen 30 días de garantía. Si tienes algún problema con tu pedido, escríbenos por WhatsApp y lo revisamos.',
    },
    {
      question: '¿Qué son las tarjetas digitales y cómo funcionan?',
      answer:
        'Son tarjetas de presentación virtuales con código QR. Quien la escanea ve tu información y tus enlaces (WhatsApp, redes, ubicación, catálogo) al instante, sin papel y sin imprimir de nuevo cuando cambias algo.',
    },
  ],
  blockedIps: [],
};

export function convertToColombianPrice(priceStr?: string): string {
  if (!priceStr) return '$79.000 COP';
  if (priceStr.includes('COP')) return priceStr;

  const map: Record<string, string> = {
    '$19 USD': '$79.000 COP',
    '$29 USD': '$119.000 COP',
    '$9 USD': '$36.000 COP',
    '$4 USD': '$16.000 COP',
    '$3 USD': '$12.000 COP',
    '$11 USD': '$45.000 COP',
    '$8 USD': '$32.000 COP',
    '$5 USD': '$20.000 COP',
    '$10 USD': '$40.000 COP',
    '$18 USD': '$72.000 COP',
    '19 USD': '$79.000 COP',
    '29 USD': '$119.000 COP',
    '9 USD': '$36.000 COP',
    '4 USD': '$16.000 COP',
    '3 USD': '$12.000 COP',
    '11 USD': '$45.000 COP',
    '8 USD': '$32.000 COP',
    '5 USD': '$20.000 COP',
    '10 USD': '$40.000 COP',
    '18 USD': '$72.000 COP',
  };

  const trimmed = priceStr.trim();
  if (map[trimmed]) return map[trimmed];

  if (priceStr.toUpperCase().includes('USD') || /^\s*\$\d+/.test(priceStr)) {
    const match = priceStr.match(/\d+/);
    if (match) {
      const num = parseInt(match[0], 10);
      if (num < 1000) {
        const cop = Math.round((num * 4000) / 1000) * 1000;
        return `$${cop.toLocaleString('es-CO')} COP`;
      } else {
        return `$${num.toLocaleString('es-CO')} COP`;
      }
    }
  }

  return priceStr;
}

export function parseQuantityNumber(pack: { quantity?: string; title?: string; id?: string }): number {
  const sources = [pack.quantity || '', pack.title || '', pack.id || ''];
  for (const str of sources) {
    if (!str) continue;
    // Check for 'k' notation e.g. 1.5k, 2k, 10k
    const kMatch = str.match(/(\d+(?:[.,]\d+)?)\s*k/i);
    if (kMatch) {
      const val = parseFloat(kMatch[1].replace(',', '.'));
      if (!isNaN(val) && val > 0) return Math.round(val * 1000);
    }
    // Check for 'm' notation e.g. 1m
    const mMatch = str.match(/(\d+(?:[.,]\d+)?)\s*m/i);
    if (mMatch) {
      const val = parseFloat(mMatch[1].replace(',', '.'));
      if (!isNaN(val) && val > 0) return Math.round(val * 1000000);
    }
    // Check for numbers with thousand separator e.g. 1.000, 2.000, 1,500, 10.000
    const thousandMatch = str.match(/\b(\d{1,3}(?:[.,]\d{3})+)\b/);
    if (thousandMatch) {
      const val = parseInt(thousandMatch[1].replace(/[.,]/g, ''), 10);
      if (!isNaN(val) && val > 0) return val;
    }
    // Check for raw digits e.g. 500, 1000, 2500
    const numMatch = str.match(/\b(\d+)\b/);
    if (numMatch) {
      const val = parseInt(numMatch[1], 10);
      if (!isNaN(val) && val > 0) return val;
    }
  }
  return 0;
}

export function sortSocialServicePacks(a: SocialServicePack, b: SocialServicePack): number {
  const typeOrder: Record<string, number> = {
    seguidores: 1,
    likes: 2,
    vistas: 3,
    tarjeta: 4,
  };
  const orderA = typeOrder[a.type] || 99;
  const orderB = typeOrder[b.type] || 99;
  if (orderA !== orderB) {
    return orderA - orderB;
  }
  const qtyA = parseQuantityNumber(a);
  const qtyB = parseQuantityNumber(b);
  if (qtyA !== qtyB) {
    return qtyA - qtyB; // Ascendente: 1.000 arriba, luego 1.500 o 2.000 abajo
  }
  return a.id.localeCompare(b.id);
}

export function sanitizeAgencySettings(raw: AgencySettings): AgencySettings {
  const cleanBadge = (b?: string, def = 'CRECIMIENTO EN REDES') => {
    if (!b || /^(badge|insignia)\s*redes$/i.test(b.trim())) return def;
    return b.replace(/MÓDULO\s*\d+:\s*/i, '').trim() || def;
  };
  const cleanTitle = (t?: string, def = 'Seguidores, Likes y Vistas para tus Redes') => {
    if (!t || /^(titulo|título)\s*redes$/i.test(t.trim())) return def;
    return t.trim() || def;
  };
  const cleanSubtitle = (s?: string, def = 'Impulsa tus métricas, credibilidad y alcance algorítmico sin compartir contraseñas.') => {
    if (!s || /^(subtitulo|subtítulo)\s*redes$/i.test(s.trim())) return def;
    return s.trim() || def;
  };

  const cardsBadge = (b?: string) => {
    if (!b) return 'TARJETAS VIRTUALES CON QR';
    return b.replace(/MÓDULO\s*\d+:\s*/i, '').trim() || 'TARJETAS VIRTUALES CON QR';
  };

  const cleanFeatures = (feats: string[] | undefined, fallback: string[]) => {
    if (!feats || !Array.isArray(feats) || feats.length === 0) return fallback;
    const hasPlaceholder = feats.some((f) => /^(item|feat|nueva)/i.test(f.trim()));
    if (hasPlaceholder) return fallback;
    const filtered = feats.filter((f) => !/^(item|feat\s*\d|nueva)/i.test(f.trim()));
    return filtered.length >= 3 ? filtered : fallback;
  };

  const cleanTagline = (t?: string) => {
    if (!t || /tagline/i.test(t.trim()) || /nueva/i.test(t.trim())) return 'Tarjeta digital con tu WhatsApp, catálogo y ubicación.';
    return t.trim();
  };

  const cleanCardDemoName = (n?: string) => {
    if (!n || /carlos\s*g[oó]mez/i.test(n.trim())) return 'Sergio Vargas';
    return n.trim();
  };

  return {
    ...raw,
    tagline: cleanTagline(raw.tagline),
    cardDemoName: cleanCardDemoName(raw.cardDemoName),
    cardsSectionBadge: cardsBadge(raw.cardsSectionBadge),
    cardsStartingPrice: raw.cardsStartingPrice || DEFAULT_SETTINGS.cardsStartingPrice,
    cardPlan1Features: cleanFeatures(raw.cardPlan1Features, DEFAULT_SETTINGS.cardPlan1Features!),
    cardPlan2Features: cleanFeatures(raw.cardPlan2Features, DEFAULT_SETTINGS.cardPlan2Features!),
    socialSectionBadge: cleanBadge(raw.socialSectionBadge, 'CRECIMIENTO EN REDES'),
    socialSectionTitle: cleanTitle(raw.socialSectionTitle, 'Seguidores, Likes y Vistas para tus Redes'),
    socialSectionSubtitle: cleanSubtitle(raw.socialSectionSubtitle, 'Impulsa tus métricas, credibilidad y alcance algorítmico sin compartir contraseñas.'),
    socialSectionSpeedTag: (!raw.socialSectionSpeedTag || /15-45/i.test(raw.socialSectionSpeedTag)) ? 'Entrega habitual en 30 minutos · máximo 4 horas' : raw.socialSectionSpeedTag,
    socialStartingPrice: raw.socialStartingPrice || DEFAULT_SETTINGS.socialStartingPrice,
    packNegocioPrice: (raw.packNegocioPrice && raw.packNegocioPrice !== '$139.000 COP')
      ? raw.packNegocioPrice
      : DEFAULT_SETTINGS.packNegocioPrice,
    whatsappDefaultMessage: raw.whatsappDefaultMessage && !raw.whatsappDefaultMessage.includes('¡Hola ImpulsaNet!')
      ? raw.whatsappDefaultMessage
      : 'Hola, vi su web y quiero información',
    heroTitle: raw.heroTitle || DEFAULT_SETTINGS.heroTitle,
    heroDescription: raw.heroDescription || DEFAULT_SETTINGS.heroDescription,
    heroBadge: raw.heroBadge || DEFAULT_SETTINGS.heroBadge,
    heroPrimaryBtnText: raw.heroPrimaryBtnText || DEFAULT_SETTINGS.heroPrimaryBtnText,
    heroSecondaryBtnText: raw.heroSecondaryBtnText || DEFAULT_SETTINGS.heroSecondaryBtnText,
    bannerNotice: raw.bannerNotice ?? DEFAULT_SETTINGS.bannerNotice,
    step1Title: raw.step1Title || DEFAULT_SETTINGS.step1Title,
    step1Description: raw.step1Description || DEFAULT_SETTINGS.step1Description,
    step2Title: raw.step2Title || DEFAULT_SETTINGS.step2Title,
    step2Description: raw.step2Description || DEFAULT_SETTINGS.step2Description,
    step3Title: raw.step3Title || DEFAULT_SETTINGS.step3Title,
    step3Description: raw.step3Description || DEFAULT_SETTINGS.step3Description,
    contactEmail: raw.contactEmail || DEFAULT_SETTINGS.contactEmail,
    contactLocation: raw.contactLocation || DEFAULT_SETTINGS.contactLocation,
    socialLinks: {
      instagram: raw.socialLinks?.instagram || DEFAULT_SETTINGS.socialLinks?.instagram || 'https://instagram.com/impulsanet.digital',
      tiktok: raw.socialLinks?.tiktok || DEFAULT_SETTINGS.socialLinks?.tiktok || 'https://tiktok.com/@impulsanet.digital',
      youtube: raw.socialLinks?.youtube || DEFAULT_SETTINGS.socialLinks?.youtube || 'https://youtube.com/@impulsanet',
      facebook: raw.socialLinks?.facebook || DEFAULT_SETTINGS.socialLinks?.facebook || 'https://facebook.com/impulsanet',
    },
    solutionsSectionTitle: raw.solutionsSectionTitle || DEFAULT_SETTINGS.solutionsSectionTitle,
    solutionsSectionSubtitle: raw.solutionsSectionSubtitle || DEFAULT_SETTINGS.solutionsSectionSubtitle,
    solution1Title: raw.solution1Title || DEFAULT_SETTINGS.solution1Title,
    solution1Badge: raw.solution1Badge || DEFAULT_SETTINGS.solution1Badge,
    solution1Description: raw.solution1Description || DEFAULT_SETTINGS.solution1Description,
    solution2Title: raw.solution2Title || DEFAULT_SETTINGS.solution2Title,
    solution2Badge: raw.solution2Badge || DEFAULT_SETTINGS.solution2Badge,
    solution2Description: raw.solution2Description || DEFAULT_SETTINGS.solution2Description,
    solution3Title: raw.solution3Title || DEFAULT_SETTINGS.solution3Title,
    solution3Badge: raw.solution3Badge || DEFAULT_SETTINGS.solution3Badge,
    solution3Description: raw.solution3Description || DEFAULT_SETTINGS.solution3Description,
    seoBusinessName: raw.seoBusinessName || DEFAULT_SETTINGS.seoBusinessName,
    seoDescription: raw.seoDescription || DEFAULT_SETTINGS.seoDescription,
    seoKeywords: raw.seoKeywords || DEFAULT_SETTINGS.seoKeywords,
    faqs: Array.isArray(raw.faqs) && raw.faqs.length > 0 ? raw.faqs : DEFAULT_SETTINGS.faqs,
  };
}

export const DEFAULT_SOCIAL_SERVICES: SocialServicePack[] = [
  // INSTAGRAM
  {
    id: "ig_seg_1k",
    platform: "instagram",
    type: "seguidores",
    title: "1.000 Seguidores Instagram",
    quantity: "1.000 Seguidores",
    price: "$36.000 COP",
    description: "Cuentas con foto de perfil y publicaciones. Aumenta la credibilidad de tu perfil al instante.",
    features: ["Sin contraseñas (solo tu @usuario)", "Entrega habitual en 30 minutos · máximo 4 horas", "Garantía de reposición 30 días", "Entrega gradual y segura"],
    popular: true,
    active: true,
  },
  {
    id: "ig_seg_2k",
    platform: "instagram",
    type: "seguidores",
    title: "2.000 Seguidores Instagram",
    quantity: "2.000 Seguidores",
    price: "$65.000 COP",
    description: "Duplica tu presencia y alcance en Instagram con entrega segura y directa.",
    features: ["Sin contraseñas (solo tu @usuario)", "Entrega habitual en 30 minutos · máximo 4 horas", "Garantía de reposición 30 días", "Entrega gradual y segura"],
    popular: false,
    active: true,
  },
  {
    id: "ig_likes_1k",
    platform: "instagram",
    type: "likes",
    title: "1.000 Likes para Posts / Reels",
    quantity: "1.000 Likes",
    price: "$16.000 COP",
    description: "Distribúyelos en tus fotos o reels para disparar la interacción de tu cuenta.",
    features: ["Solo enlace del post", "Entrega casi inmediata", "Mejora posicionamiento en feed", "Soporte directo por WhatsApp"],
    popular: false,
    active: true,
  },
  {
    id: "ig_views_5k",
    platform: "instagram",
    type: "vistas",
    title: "5.000 Vistas para Reels",
    quantity: "5.000 Vistas",
    price: "$12.000 COP",
    description: "Haz que tus reels alcancen más audiencia y el algoritmo los recomiende a nuevos usuarios.",
    features: ["Solo enlace del reel", "Inicio instantáneo", "Impulso algorítmico", "Sin contraseñas para tu cuenta"],
    popular: false,
    active: true,
  },

  // TIKTOK
  {
    id: "tt_seg_1k",
    platform: "tiktok",
    type: "seguidores",
    title: "1.000 Seguidores TikTok (Habilita LIVE)",
    quantity: "1.000 Seguidores",
    price: "$45.000 COP",
    description: "Alcanza los 1.000 seguidores requeridos para transmitir en vivo y colocar enlaces en tu biografía.",
    features: ["Desbloquea TikTok LIVE", "Sin contraseñas (solo tu @usuario)", "Garantía activa de reposición", "Entrega progresiva"],
    popular: true,
    active: true,
  },
  {
    id: "tt_likes_1k",
    platform: "tiktok",
    type: "likes",
    title: "1.000 Likes TikTok",
    quantity: "1.000 Likes",
    price: "$16.000 COP",
    description: "Aumenta la tasa de 'Me gusta' de tus videos para entrar al feed Para Ti (FYP).",
    features: ["Solo enlace del video", "Alta velocidad de entrega", "Máxima retención", "Atención por WhatsApp"],
    popular: false,
    active: true,
  },
  {
    id: "tt_views_10k",
    platform: "tiktok",
    type: "vistas",
    title: "10.000 Vistas para TikTok",
    quantity: "10.000 Vistas",
    price: "$12.000 COP",
    description: "Genera el efecto bola de nieve en tus videos con reproducciones de alta velocidad.",
    features: ["Solo enlace del video", "Comienza en minutos", "Económico y masivo", "Sin riesgo de baneo"],
    popular: false,
    active: true,
  },

  // YOUTUBE
  {
    id: "yt_sub_1k",
    platform: "youtube",
    type: "seguidores",
    title: "1.000 Suscriptores YouTube",
    quantity: "1.000 Suscriptores",
    price: "$119.000 COP",
    description: "Cumple el requisito esencial del Programa de Socios de YouTube para monetizar tu canal.",
    features: ["Solo enlace de tu canal", "Suscriptores estables", "Garantía de reposición", "Entrega gradual y natural"],
    popular: true,
    active: true,
  },
  {
    id: "yt_views_2k",
    platform: "youtube",
    type: "vistas",
    title: "2.000 Vistas de Alta Retención",
    quantity: "2.000 Vistas",
    price: "$32.000 COP",
    description: "Reproducciones de calidad que suman horas de visualización para la monetización de tu canal.",
    features: ["Suma horas de reproducción", "Vistas mundiales seguras", "Solo enlace del video", "Apto para videos y Shorts"],
    popular: false,
    active: true,
  },
  {
    id: "yt_likes_500",
    platform: "youtube",
    type: "likes",
    title: "500 Likes para Videos o Shorts",
    quantity: "500 Likes",
    price: "$20.000 COP",
    description: "Mejora el ratio de interacción y posiciona tu video en las búsquedas sugeridas.",
    features: ["Solo enlace del video", "Likes permanentes", "Entrega garantizada", "Soporte personalizado"],
    popular: false,
    active: true,
  },

  // FACEBOOK
  {
    id: "fb_seg_1k",
    platform: "facebook",
    type: "seguidores",
    title: "1.000 Seguidores para Página / Perfil",
    quantity: "1.000 Seguidores",
    price: "$40.000 COP",
    description: "Transmite confianza a tus clientes cuando visiten la página de tu negocio o marca.",
    features: ["Para Páginas o Perfiles públicos", "Solo enlace de la página", "Garantía de 30 días", "Entrega segura"],
    popular: true,
    active: true,
  },
  {
    id: "fb_likes_1k",
    platform: "facebook",
    type: "likes",
    title: "1.000 Likes / Reacciones para Posts",
    quantity: "1.000 Likes",
    price: "$20.000 COP",
    description: "Haz que tus publicaciones comerciales se vean concurridas y llamativas.",
    features: ["Elige likes o reacciones", "Solo enlace del post", "Comienza al instante", "Atención directa"],
    popular: false,
    active: true,
  },
  {
    id: "fb_views_5k",
    platform: "facebook",
    type: "vistas",
    title: "5.000 Vistas para Videos / Reels FB",
    quantity: "5.000 Vistas",
    price: "$16.000 COP",
    description: "Multiplica las reproducciones de tus contenidos audiovisuales en Facebook Watch y Reels.",
    features: ["Solo enlace del video", "Alta velocidad", "Sin accesos a tu cuenta", "Soporte 24/7"],
    popular: false,
    active: true,
  },
];

export const DEFAULT_CARDS_DATA: DigitalCardData = {
  id: "card_demo",
  type: "commercial",
  name: "Sergio Vargas",
  role: "Emprendedor & Asesor Digital",
  company: "ImpulsaNet Studio",
  phone: "+57 321 2515944",
  whatsapp: "573212515944",
  instagram: "@sergio.impulsanet",
  tiktok: "@sergio_digital",
  demoUrl: "https://impulsanet.digital/tarjeta-demo",
};
