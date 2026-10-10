import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Minus,
  PackageCheck,
  Phone,
  Plus,
  Ruler,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import {
  CATALOG_EXTRAS,
  CATALOG_INCLUDED_ITEMS,
  CATALOG_WIDTHS,
  catalogProducts,
  getCatalogBasePrice,
  getCatalogProduct,
  getCatalogSku,
  getPriceWithVat,
  type CatalogExtraId,
  type CatalogProduct,
  type CatalogWidth,
} from '../../catalog/catalogData';
import { company, whatsappContactUrl } from '../../config/company';
import { formatCurrency } from '../../utils/pricing';
import { OPEN_COOKIE_SETTINGS_EVENT } from '../legal/CookieBanner';
import { Button, Card } from '../ui/Ui';
import { SequraFinancingSlot } from './SequraFinancingSlot';

type CatalogPageProps = {
  productSlug?: string | null;
  onNavigate: (slug?: string) => void;
  onBackToWebsite: () => void;
  onLegalPage: (page: 'aviso-legal' | 'privacidad' | 'cookies') => void;
};

const useCatalogMetadata = (product?: CatalogProduct) => {
  useEffect(() => {
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const metadata = [
      document.querySelector<HTMLMetaElement>('meta[name="description"]'),
      document.querySelector<HTMLMetaElement>('meta[property="og:title"]'),
      document.querySelector<HTMLMetaElement>('meta[property="og:description"]'),
      document.querySelector<HTMLMetaElement>('meta[property="og:url"]'),
    ];
    const previousTitle = document.title;
    const previousCanonical = canonical?.href;
    const previousMetadata = metadata.map((node) => node?.content);
    const title = product
      ? `${product.name} | Módulos Prefabricados San José`
      : 'Catálogo de módulos prefabricados | Módulos San José';
    const description = product
      ? `${product.name} en panel sándwich, con medidas y extras configurables. Consulta el precio y las opciones de financiación.`
      : 'Catálogo de módulos prefabricados con medidas, precios base, equipamiento y extras configurables.';
    const path = product ? `/catalogo/${product.slug}` : '/catalogo';
    const canonicalUrl = `https://modulosprefabricadossanjose.com${path}`;

    document.title = title;
    if (canonical) canonical.href = canonicalUrl;
    if (metadata[0]) metadata[0].content = description;
    if (metadata[1]) metadata[1].content = title;
    if (metadata[2]) metadata[2].content = description;
    if (metadata[3]) metadata[3].content = canonicalUrl;

    return () => {
      document.title = previousTitle;
      if (canonical && previousCanonical) canonical.href = previousCanonical;
      metadata.forEach((node, index) => {
        if (node && previousMetadata[index] !== undefined) node.content = previousMetadata[index] ?? '';
      });
    };
  }, [product]);
};

const CatalogHeader = ({ onBackToWebsite, onNavigate }: Pick<CatalogPageProps, 'onBackToWebsite' | 'onNavigate'>) => (
  <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
    <div className="container-page flex items-center justify-between gap-4 py-4">
      <button type="button" onClick={onBackToWebsite} className="flex min-w-0 items-center gap-3 text-left">
        <img
          src="/images/logo-modulos-prefabricados-san-jose.png"
          alt="Módulos Prefabricados San José S.L."
          width="48"
          height="48"
          className="h-12 w-12 shrink-0 object-contain"
        />
        <div className="min-w-0">
          <p className="truncate font-black text-slate-900">{company.name}</p>
          <p className="text-xs font-semibold text-slate-500">Catálogo de módulos</p>
        </div>
      </button>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => onNavigate()} className="hidden text-sm font-black text-slate-600 hover:text-brand-orange sm:block">
          Ver catálogo
        </button>
        <a href={`tel:${company.phoneHref}`}><Button variant="outline"><Phone size={18} /> <span className="hidden sm:inline">Llamar</span></Button></a>
      </div>
    </div>
  </header>
);

const CatalogFooter = ({ onLegalPage }: Pick<CatalogPageProps, 'onLegalPage'>) => (
  <footer className="mt-16 border-t border-slate-800 bg-slate-950 text-white">
    <div className="container-page grid gap-8 py-10 md:grid-cols-3">
      <div>
        <p className="text-lg font-black">{company.name}</p>
        <p className="mt-3 text-sm leading-6 text-slate-300">Fabricación de módulos prefabricados con panel sándwich en Sevilla.</p>
      </div>
      <div>
        <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">Información comercial</p>
        <p className="mt-3 text-sm leading-6 text-slate-300">Precios orientativos. Transporte, montaje, accesos y modificaciones especiales se confirman por separado.</p>
      </div>
      <div>
        <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">Legal</p>
        <div className="mt-3 space-y-2 text-sm text-slate-300">
          <button type="button" onClick={() => onLegalPage('aviso-legal')} className="block hover:text-white">Aviso legal</button>
          <button type="button" onClick={() => onLegalPage('privacidad')} className="block hover:text-white">Política de privacidad</button>
          <button type="button" onClick={() => onLegalPage('cookies')} className="block hover:text-white">Política de cookies</button>
          <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT))} className="block hover:text-white">Configurar cookies</button>
        </div>
      </div>
    </div>
    <div className="border-t border-slate-800"><div className="container-page py-5 text-xs text-slate-500">© {new Date().getFullYear()} {company.name}</div></div>
  </footer>
);

const CatalogIndex = ({ onNavigate }: Pick<CatalogPageProps, 'onNavigate'>) => {
  useCatalogMetadata();

  useEffect(() => {
    const script = document.createElement('script');
    script.id = 'catalog-json-ld';
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Catálogo de módulos prefabricados',
      itemListElement: catalogProducts.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://modulosprefabricadossanjose.com/catalogo/${product.slug}`,
        name: product.name,
      })),
    });
    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  return (
    <main>
      <section className="overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">
        <div className="container-page py-14 md:py-20">
          <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-black ring-1 ring-white/20">Catálogo comercial · Medidas estándar</span>
          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">Elige el módulo que mejor encaja con tu proyecto</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-200">Compara medidas y precios, elige el ancho y añade equipamiento. Las modificaciones especiales se revisan antes de confirmar el pedido.</p>
          <div className="mt-8 grid gap-3 text-sm font-bold text-slate-200 sm:grid-cols-3">
            <span className="flex items-center gap-2"><PackageCheck className="text-brand-green" size={19} /> Equipamiento básico incluido</span>
            <span className="flex items-center gap-2"><ShieldCheck className="text-brand-green" size={19} /> Precios transparentes</span>
            <span className="flex items-center gap-2"><Truck className="text-brand-green" size={19} /> Transporte calculado aparte</span>
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-orange">Nuestros módulos</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">Modelos por longitud</h2>
          </div>
          <p className="max-w-xl text-sm font-semibold leading-6 text-slate-600">Todos los precios mostrados son sin IVA. En cada ficha podrás elegir ancho de 2,40 o 2,50 m.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {catalogProducts.map((product) => {
            const basePrice = getCatalogBasePrice(product, 2.4);
            return (
              <article key={product.slug} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-xl">
                <div className="relative">
                  <img src={product.image} alt={product.imageAlt} className="h-64 w-full object-cover" loading="lazy" />
                  {product.badge ? <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-900 shadow-lg">{product.badge}</span> : null}
                </div>
                <div className="p-6">
                  <p className="text-sm font-black text-brand-blue">{product.length} × 2,40 m o 2,50 m</p>
                  <h3 className="mt-2 text-2xl font-black text-slate-900">{product.shortName}</h3>
                  <p className="mt-3 min-h-12 text-sm font-semibold leading-6 text-slate-600">{product.recommendedUse}</p>
                  <div className="mt-5 flex items-end justify-between gap-3 border-t border-slate-100 pt-5">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Desde</p>
                      <p className="text-2xl font-black text-slate-900">{formatCurrency(basePrice)}</p>
                      <p className="text-xs font-bold text-slate-500">sin IVA</p>
                    </div>
                    <a
                      href={`/catalogo/${product.slug}`}
                      onClick={(event) => { event.preventDefault(); onNavigate(product.slug); }}
                      className="inline-flex items-center gap-1 rounded-2xl bg-brand-orange px-4 py-3 text-sm font-black text-white transition hover:bg-orange-600"
                    >
                      Ver producto <ChevronRight size={17} />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="container-page pb-6">
        <Card className="border-2 border-slate-900 bg-slate-950 text-white">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-400">¿Necesitas otra medida?</p>
              <h2 className="mt-2 text-2xl font-black">Fabricamos también configuraciones especiales</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">Cuéntanos el uso, las medidas y el lugar de instalación. Prepararemos un presupuesto personalizado.</p>
            </div>
            <a href={whatsappContactUrl} target="_blank" rel="noreferrer"><Button>Solicitar presupuesto</Button></a>
          </div>
        </Card>
      </section>
    </main>
  );
};

const createInitialExtraQuantities = () =>
  Object.fromEntries(CATALOG_EXTRAS.map((extra) => [extra.id, 0])) as Record<CatalogExtraId, number>;

const ProductDetail = ({ product, onNavigate }: { product: CatalogProduct; onNavigate: CatalogPageProps['onNavigate'] }) => {
  const [width, setWidth] = useState<CatalogWidth>(2.4);
  const [extraQuantities, setExtraQuantities] = useState(createInitialExtraQuantities);
  useCatalogMetadata(product);

  const basePrice = getCatalogBasePrice(product, width);
  const extrasPrice = useMemo(
    () => CATALOG_EXTRAS.reduce((total, extra) => total + extra.unitPrice * extraQuantities[extra.id], 0),
    [extraQuantities],
  );
  const priceWithoutVat = basePrice + extrasPrice;
  const priceWithVat = getPriceWithVat(priceWithoutVat);
  const sku = getCatalogSku(product, width);
  const selectedExtras = CATALOG_EXTRAS.filter((extra) => extraQuantities[extra.id] > 0);
  const consultationText = [
    `Hola, quiero información sobre ${product.name}.`,
    `Referencia: ${sku}.`,
    `Medidas: ${product.length} x ${width.toLocaleString('es-ES')} m.`,
    selectedExtras.length
      ? `Extras: ${selectedExtras.map((extra) => `${extraQuantities[extra.id]} × ${extra.label}`).join(', ')}.`
      : 'Sin extras añadidos.',
    `Total orientativo: ${formatCurrency(priceWithVat)} con IVA.`,
  ].join('\n');
  const consultationUrl = `https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(consultationText)}`;

  useEffect(() => {
    const script = document.createElement('script');
    script.id = 'catalog-product-json-ld';
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      sku,
      image: `https://modulosprefabricadossanjose.com${product.image}`,
      brand: { '@type': 'Brand', name: 'Módulos Prefabricados San José' },
      offers: {
        '@type': 'Offer',
        url: `https://modulosprefabricadossanjose.com/catalogo/${product.slug}`,
        priceCurrency: 'EUR',
        price: priceWithVat,
        availability: 'https://schema.org/PreOrder',
        seller: { '@type': 'Organization', name: company.name },
      },
    });
    document.head.appendChild(script);
    return () => script.remove();
  }, [priceWithVat, product, sku]);

  const changeExtra = (id: CatalogExtraId, delta: number, maxQuantity: number) => {
    setExtraQuantities((current) => ({
      ...current,
      [id]: Math.max(0, Math.min(maxQuantity, current[id] + delta)),
    }));
  };

  return (
    <main className="container-page py-8 md:py-12">
      <a
        href="/catalogo"
        onClick={(event) => { event.preventDefault(); onNavigate(); }}
        className="mb-7 inline-flex items-center gap-2 text-sm font-black text-slate-600 hover:text-brand-orange"
      >
        <ArrowLeft size={18} /> Volver al catálogo
      </a>

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-soft">
            <img src={product.image} alt={product.imageAlt} className="h-[360px] w-full object-cover md:h-[520px]" />
          </div>

          <Card>
            <h2 className="text-2xl font-black text-slate-900">Qué incluye el precio base</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {CATALOG_INCLUDED_ITEMS.map((item) => (
                <p key={item} className="flex items-start gap-3 text-sm font-semibold leading-6 text-slate-700">
                  <Check className="mt-1 shrink-0 text-brand-green" size={17} /> {item}
                </p>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6 lg:sticky lg:top-6">
          <Card>
            <div className="flex flex-wrap items-center gap-2">
              {product.badge ? <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-brand-orange">{product.badge}</span> : null}
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">Referencia {sku}</span>
            </div>
            <h1 className="mt-4 text-3xl font-black text-slate-900 md:text-4xl">{product.name}</h1>
            <p className="mt-3 font-semibold leading-7 text-slate-600">{product.description}</p>

            <div className="mt-6">
              <p className="flex items-center gap-2 text-sm font-black text-slate-900"><Ruler size={18} className="text-brand-blue" /> Selecciona el ancho</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {CATALOG_WIDTHS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setWidth(option)}
                    className={`rounded-2xl border p-4 text-left transition ${width === option ? 'border-brand-blue bg-blue-50 text-brand-blue ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <p className="font-black">{product.length} × {option.toLocaleString('es-ES')} m</p>
                    <p className="mt-1 text-xs font-bold">{formatCurrency(getCatalogBasePrice(product, option))} sin IVA</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-3xl bg-slate-950 p-5 text-white">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Precio configurado</p>
                  <p className="mt-2 text-3xl font-black">{formatCurrency(priceWithoutVat)}</p>
                  <p className="text-sm font-semibold text-slate-300">sin IVA</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400">Total con IVA</p>
                  <p className="text-xl font-black text-orange-400">{formatCurrency(priceWithVat)}</p>
                </div>
              </div>
              {extrasPrice ? <p className="mt-3 border-t border-slate-700 pt-3 text-sm text-slate-300">Base {formatCurrency(basePrice)} + extras {formatCurrency(extrasPrice)}, sin IVA</p> : null}
            </div>
          </Card>

          <Card>
            <h2 className="text-2xl font-black text-slate-900">Añade equipamiento</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">Elige cantidades para calcular el precio orientativo de la configuración.</p>
            <div className="mt-5 divide-y divide-slate-100">
              {CATALOG_EXTRAS.map((extra) => {
                const quantity = extraQuantities[extra.id];
                return (
                  <div key={extra.id} className="grid gap-3 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div>
                      <p className="font-black text-slate-900">{extra.label}</p>
                      <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">{extra.description}</p>
                      <p className="mt-1 text-sm font-black text-brand-orange">+ {formatCurrency(extra.unitPrice)} sin IVA</p>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-1 sm:justify-start">
                      <button type="button" onClick={() => changeExtra(extra.id, -1, extra.maxQuantity)} disabled={quantity === 0} aria-label={`Quitar ${extra.label}`} className="rounded-xl p-2 text-slate-700 hover:bg-white disabled:opacity-30"><Minus size={17} /></button>
                      <output className="min-w-7 text-center font-black text-slate-900" aria-label={`Cantidad de ${extra.label}`}>{quantity}</output>
                      <button type="button" onClick={() => changeExtra(extra.id, 1, extra.maxQuantity)} disabled={quantity === extra.maxQuantity} aria-label={`Añadir ${extra.label}`} className="rounded-xl p-2 text-slate-700 hover:bg-white disabled:opacity-30"><Plus size={17} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <SequraFinancingSlot amountWithVat={priceWithVat} sku={sku} consultationUrl={consultationUrl} />

          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm font-semibold leading-6 text-amber-950">
            Precio orientativo sujeto a revisión técnica y disponibilidad. Transporte, montaje, accesos, grúa, cimentación y permisos no están incluidos.
          </div>
        </div>
      </div>
    </main>
  );
};

const ProductNotFound = ({ onNavigate }: Pick<CatalogPageProps, 'onNavigate'>) => {
  useCatalogMetadata();
  return (
    <main className="container-page py-20 text-center">
      <h1 className="text-4xl font-black text-slate-900">Producto no encontrado</h1>
      <p className="mt-4 text-slate-600">El enlace no corresponde a ningún módulo del catálogo.</p>
      <Button onClick={() => onNavigate()} className="mt-6"><ArrowLeft size={18} /> Volver al catálogo</Button>
    </main>
  );
};

export const CatalogPage = ({ productSlug, onNavigate, onBackToWebsite, onLegalPage }: CatalogPageProps) => {
  const product = productSlug ? getCatalogProduct(productSlug) : undefined;

  return (
    <div className="min-h-screen bg-brand-light">
      <CatalogHeader onBackToWebsite={onBackToWebsite} onNavigate={onNavigate} />
      {!productSlug ? <CatalogIndex onNavigate={onNavigate} /> : product ? <ProductDetail product={product} onNavigate={onNavigate} /> : <ProductNotFound onNavigate={onNavigate} />}
      <CatalogFooter onLegalPage={onLegalPage} />
    </div>
  );
};
