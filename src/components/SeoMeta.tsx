import { useEffect } from 'react';
import { AgencySettings } from '../firebase';

interface SeoMetaProps {
  settings: AgencySettings;
  currentPath: string;
}

export const SeoMeta: React.FC<SeoMetaProps> = ({ settings, currentPath }) => {
  useEffect(() => {
    const businessName = settings.seoBusinessName || settings.agencyName || 'ImpulsaNet - Agencia Digital & Tarjetas Interactivas';
    const description = settings.seoDescription || 'Agencia de servicios digitales en Colombia. Tarjetas interactivas con QR de pago único y servicios de crecimiento para redes sociales con entrega rápida.';
    const keywords = settings.seoKeywords || 'tarjetas digitales con QR Colombia, comprar seguidores instagram colombia, tarjetas interactivas nfc, servicios para redes sociales, impulsanet';
    const logoUrl = settings.logoUrl || 'https://cdn.phototourl.com/member/2026-10-08-92ac8cdb-f316-40bc-ad16-3f22cb980788.png';

    // 1. Título dinámico por sección
    let dynamicTitle = businessName;
    if (currentPath === '/tarjetas') {
      dynamicTitle = `Tarjetas Virtuales con QR y Catálogo | ${settings.agencyName || 'ImpulsaNet'}`;
    } else if (currentPath.startsWith('/redes')) {
      dynamicTitle = `Servicios de Crecimiento para Redes Sociales | ${settings.agencyName || 'ImpulsaNet'}`;
    } else if (currentPath === '/promos') {
      dynamicTitle = `Promociones y Ofertas Digitales | ${settings.agencyName || 'ImpulsaNet'}`;
    }

    document.title = dynamicTitle;

    // Helper para actualizar o crear meta tags
    const setMetaTag = (attr: 'name' | 'property', attrValue: string, content: string) => {
      let meta = document.querySelector(`meta[${attr}="${attrValue}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, attrValue);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // 2. Metadatos esenciales de SEO
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);
    setMetaTag('name', 'author', settings.agencyName || 'ImpulsaNet Digital');
    setMetaTag('name', 'robots', 'index, follow');

    // 3. Open Graph
    setMetaTag('property', 'og:title', dynamicTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:site_name', settings.agencyName || 'ImpulsaNet');
    setMetaTag('property', 'og:image', logoUrl);

    // 4. Twitter Card
    setMetaTag('name', 'twitter:title', dynamicTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', logoUrl);

    // 5. JSON-LD Datos Estructurados (Schema.org)
    const jsonLdId = 'impulsanet-schema-jsonld';
    let script = document.getElementById(jsonLdId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = jsonLdId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: settings.agencyName || 'ImpulsaNet',
      description,
      image: logoUrl,
      telephone: settings.whatsappNumber ? `+${settings.whatsappNumber}` : '+573212515944',
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'CO',
      },
      makesOffer: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Tarjetas Digitales con Código QR',
            description: 'Perfiles interactivos con QR descargable permanente, enlace web propio y WhatsApp.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Crecimiento de Redes Sociales',
            description: 'Seguidores, likes y reproducciones para Instagram, TikTok, YouTube y Facebook sin contraseñas.',
          },
        },
      ],
    };

    script.textContent = JSON.stringify(schemaData);
  }, [settings, currentPath]);

  return null;
};
