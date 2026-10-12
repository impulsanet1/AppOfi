import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDocFromServer,
} from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
} from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with explicit database ID from config
export const db = getFirestore(app, (firebaseConfig as { firestoreDatabaseId: string }).firestoreDatabaseId);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

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
  heroDescription: string;
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  logoUrl?: string;

  // 1. SECCIÓN: Tarjetas Virtuales con Código QR & Enlace Web
  cardsSectionBadge?: string;
  cardsSectionTitle: string;
  cardsSectionSubtitle: string;
  cardsDeliveryTag?: string;
  cardsPrice?: string;

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
  heroDescription: "Crea tu tarjeta virtual profesional con QR y haz crecer tus redes en Instagram, TikTok, YouTube y Facebook con seguidores, likes y vistas de entrega rápida.",
  whatsappNumber: "573212515944",
  whatsappDefaultMessage: "¡Hola ImpulsaNet! Me interesa solicitar un servicio de redes o mi tarjeta virtual.",
  logoUrl: "https://cdn.phototourl.com/member/2026-10-08-92ac8cdb-f316-40bc-ad16-3f22cb980788.png",

  // 1. Tarjetas Virtuales
  cardsSectionBadge: "MÓDULO 1: TARJETAS VIRTUALES",
  cardsSectionTitle: "Tarjetas Virtuales con Código QR & Enlace Web",
  cardsSectionSubtitle: "100% digitales. Comparte tu contacto, WhatsApp, redes y catálogo en 1 toque. Sin costos mensuales.",
  cardsDeliveryTag: "● Entrega en 24 horas",
  cardsPrice: "$79.000 COP",

  // Plan 1
  cardPlan1Badge: "Plan Estándar",
  cardPlan1Title: "Tarjeta Virtual Básica",
  cardsBasicPrice: "$79.000 COP",
  cardPlan1Features: [
    "Enlace web permanente 100% online",
    "Código QR de alta definición para compartir",
    "Botón para guardar contacto en la agenda (.vcf)",
    "Botones a WhatsApp, llamada y redes"
  ],
  cardPlan1ButtonText: "Pedir Tarjeta Virtual",

  // Plan 2
  cardPlan2Badge: "Comercial / Con Catálogo",
  cardPlan2Title: "Tarjeta Virtual Pro",
  cardsProPrice: "$119.000 COP",
  cardPlan2Features: [
    "Todo lo de la tarjeta básica",
    "Catálogo interactivo de servicios o productos",
    "Botones de datos bancarios para cobrar",
    "Actualizaciones de datos ilimitadas"
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
  socialSectionSpeedTag: "Inicio en 15-45 min",

  socialLinks: {
    instagram: "https://instagram.com/impulsanet.digital",
    tiktok: "https://tiktok.com/@impulsanet.digital",
    youtube: "https://youtube.com/@impulsanet",
    facebook: "https://facebook.com/impulsanet",
  },
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

  return {
    ...raw,
    cardsSectionBadge: cardsBadge(raw.cardsSectionBadge),
    socialSectionBadge: cleanBadge(raw.socialSectionBadge, 'CRECIMIENTO EN REDES'),
    socialSectionTitle: cleanTitle(raw.socialSectionTitle, 'Seguidores, Likes y Vistas para tus Redes'),
    socialSectionSubtitle: cleanSubtitle(raw.socialSectionSubtitle, 'Impulsa tus métricas, credibilidad y alcance algorítmico sin compartir contraseñas.'),
    socialSectionSpeedTag: (!raw.socialSectionSpeedTag || /^\d+\s*min$/i.test(raw.socialSectionSpeedTag.trim())) ? 'Inicio en 15-45 min' : raw.socialSectionSpeedTag,
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
    features: ["Sin contraseñas (solo tu @usuario)", "Comienza en 15-45 minutos", "Garantía de reposición 30 días", "Entrega gradual y segura"],
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
    features: ["Sin contraseñas (solo tu @usuario)", "Comienza en 15-45 minutos", "Garantía de reposición 30 días", "Entrega gradual y segura"],
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
    features: ["Solo enlace del reel", "Inicio instantáneo", "Impulso algorítmico", "100% seguro para tu cuenta"],
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
