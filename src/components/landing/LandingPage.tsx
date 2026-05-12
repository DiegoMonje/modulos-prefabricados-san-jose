import { Building2, Calculator, CheckCircle2, FileText, Mail, MapPin, MessageCircle, Phone, Ruler, ShieldCheck } from 'lucide-react';
import { company, whatsappContactUrl } from '../../config/company';
import { SocialLinks } from '../ui/SocialLinks';
import { Button } from '../ui/Ui';

type LegalPage = 'aviso-legal' | 'privacidad' | 'cookies';

type LandingPageProps = {
  onStart: () => void;
  onLegalPage: (page: LegalPage) => void;
  onAdmin: () => void;
};

const navItems = [
  ['Servicios', '#servicios'],
  ['Configurador', '#calculadora'],
  ['Galería', '#galeria'],
  ['Proceso', '#proceso'],
  ['Modelos', '#modelos'],
  ['Contacto', '#contacto'],
] as const;

const useCases = [
  {
    title: 'Casetas para fincas',
    description: 'Para herramientas, maquinaria, aperos o zonas auxiliares en terrenos particulares.',
    image: '/images/caseta-prefabricada-frontal-finca.webp',
    alt: 'Caseta prefabricada blanca frontal para finca',
  },
  {
    title: 'Módulos oficina',
    description: 'Espacios de trabajo para empresas, talleres, obras o negocios que necesitan una solución rápida.',
    image: '/images/interior-modulo-prefabricado-oficina.webp',
    alt: 'Interior acondicionado de módulo prefabricado con instalación eléctrica',
  },
  {
    title: 'Casetas de obra',
    description: 'Módulos resistentes para obras, almacenes temporales, vestuarios o zonas de trabajo.',
    image: '/images/modulo-prefabricado-obra-dos-ventanas.webp',
    alt: 'Módulo prefabricado de obra con dos ventanas',
  },
  {
    title: 'Vestuarios y almacenes',
    description: 'Soluciones para trabajadores, instalaciones deportivas, empresas y almacenamiento profesional.',
    image: '/images/modulo-prefabricado-finca-dos-ventanas.webp',
    alt: 'Módulo prefabricado largo para finca con dos ventanas',
  },
] as const;

const galleryImages = [
  {
    src: '/images/hero-modulo-prefabricado-jardin.webp',
    title: 'Módulo instalado en exterior',
    alt: 'Módulo prefabricado con panel sándwich blanco instalado en jardín',
  },
  {
    src: '/images/caseta-prefabricada-compacta-olivar.webp',
    title: 'Caseta compacta para finca',
    alt: 'Caseta prefabricada compacta instalada en olivar',
  },
  {
    src: '/images/modulo-prefabricado-perspectiva-jardin.webp',
    title: 'Acabado exterior limpio',
    alt: 'Módulo prefabricado visto en perspectiva en entorno ajardinado',
  },
  {
    src: '/images/interior-modulo-prefabricado-oficina.webp',
    title: 'Interior acondicionado',
    alt: 'Interior acondicionado de módulo prefabricado con instalación eléctrica',
  },
] as const;

const processSteps = [
  ['01', 'Eliges medidas y uso', 'Definimos longitud, ancho, uso previsto y ubicación de instalación.'],
  ['02', 'Configuras distribución', 'Añades puertas, ventanas, enchufes, iluminación, baño u otros extras.'],
  ['03', 'Envías la solicitud', 'La web prepara la información para revisar el proyecto con más claridad.'],
  ['04', 'Confirmamos presupuesto', 'Comprobamos transporte, montaje, accesos y detalles técnicos finales.'],
] as const;

const models = [
  ['3 x 2,40 m', 'Compacto', 'Herramientas, finca o pequeño almacén'],
  ['4 x 2,40 m', 'Auxiliar', 'Fincas, uso auxiliar y almacenamiento'],
  ['5 x 2,40 m', 'Medio', 'Almacén, obra o espacio auxiliar'],
  ['6 x 2,40 m', 'Más vendido', 'Oficina pequeña, finca o caseta de obra'],
  ['7 x 2,40 m', 'Grande', 'Vestuario, oficina o módulo amplio'],
  ['8 x 2,40 m', 'Especial', 'Bajo consulta técnica y transporte'],
] as const;

const SectionIntro = ({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) => (
  <div className="max-w-3xl">
    <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-orange">{eyebrow}</p>
    <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">{title}</h2>
    {description ? <p className="mt-4 text-base leading-8 text-slate-600">{description}</p> : null}
  </div>
);

export const LandingPage = ({ onStart, onLegalPage, onAdmin }: LandingPageProps) => (
  <div className="min-h-screen bg-slate-50 text-slate-950">
    <Header onStart={onStart} />

    <main id="inicio">
      <HeroSection onStart={onStart} />
      <TrustSection />
      <UseCasesSection />
      <ConfiguratorSection onStart={onStart} />
      <GallerySection />
      <ProcessSection />
      <ModelsSection onStart={onStart} />
      <ContactCta onStart={onStart} />
    </main>

    <Footer onLegalPage={onLegalPage} onAdmin={onAdmin} onStart={onStart} />
  </div>
);

const Header = ({ onStart }: { onStart: () => void }) => (
  <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
    <div className="hidden border-b border-slate-200 bg-slate-950 text-white lg:block">
      <div className="container-page flex h-9 items-center justify-between text-xs font-semibold text-slate-300">
        <span className="inline-flex items-center gap-2"><MapPin size={14} className="text-brand-orange" /> San José de la Rinconada · Sevilla</span>
        <div className="flex items-center gap-5">
          <span>CIF {company.cif}</span>
          <a href={`tel:${company.phoneHref}`} className="inline-flex items-center gap-2 hover:text-white"><Phone size={14} /> {company.phone}</a>
          <a href={`mailto:${company.email}`} className="hover:text-white">{company.email}</a>
        </div>
      </div>
    </div>

    <div className="container-page flex items-center justify-between gap-3 py-3">
      <a href="#inicio" aria-label="Volver al inicio" className="flex min-w-0 items-center">
        <img src="/logo-sanjose-horizontal.svg" alt="Módulos Prefabricados San José" className="h-10 w-auto max-w-[210px] object-contain sm:h-11 sm:max-w-[260px] lg:h-12 lg:max-w-[310px]" />
      </a>

      <nav aria-label="Navegación principal" className="hidden items-center gap-6 text-sm font-black text-slate-700 lg:flex">
        {navItems.map(([label, href]) => <a key={href} href={href} className="hover:text-brand-orange">{label}</a>)}
      </nav>

      <div className="flex shrink-0 items-center gap-2">
        <button onClick={onStart} className="hidden rounded-md bg-brand-orange px-4 py-2.5 text-sm font-black text-white transition hover:bg-orange-600 sm:inline-flex">Calcular precio</button>
        <a href={whatsappContactUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md bg-brand-green px-3 py-2.5 text-sm font-black text-white transition hover:bg-emerald-700"><MessageCircle size={17} /><span className="hidden sm:inline">WhatsApp</span></a>
      </div>
    </div>

    <nav aria-label="Navegación móvil" className="border-t border-slate-100 bg-white lg:hidden">
      <div className="container-page flex gap-2 overflow-x-auto py-2 text-xs font-bold text-slate-700">
        <button onClick={onStart} className="whitespace-nowrap rounded-md bg-brand-orange px-3 py-2 text-white">Calcular precio</button>
        {navItems.map(([label, href]) => <a key={href} href={href} className="whitespace-nowrap rounded-md border border-slate-200 bg-white px-3 py-2">{label}</a>)}
      </div>
    </nav>
  </header>
);

const HeroSection = ({ onStart }: { onStart: () => void }) => (
  <section className="border-b border-slate-200 bg-white">
    <div className="container-page grid gap-10 py-10 md:py-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:py-16">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-orange">Fabricación de módulos prefabricados en Sevilla</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-6xl">Casetas y módulos prefabricados a medida en Sevilla</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">Fabricamos casetas y módulos con panel sándwich para fincas, obras, oficinas, vestuarios y almacenes. Configura medidas, distribución y extras para recibir una orientación de precio y solicitar revisión final.</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button onClick={onStart} className="rounded-md px-6 py-4 text-base"><Calculator size={19} /> Calcular precio</Button>
          <a href={whatsappContactUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-6 py-4 text-base font-black text-slate-900 transition hover:bg-slate-50"><MessageCircle size={19} /> Pedir presupuesto por WhatsApp</a>
        </div>

        <div className="mt-8 border-l-4 border-brand-orange bg-slate-50 p-5">
          <p className="text-sm font-bold text-slate-600">Modelo orientativo más solicitado</p>
          <p className="mt-1 text-2xl font-black text-slate-950">6 x 2,40 m · desde 4.750 € sin IVA</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">Precio sujeto a medidas finales, extras, transporte, montaje, accesos y revisión técnica.</p>
        </div>
      </div>

      <div>
        <img src="/images/hero-modulo-prefabricado-jardin.webp" alt="Módulo prefabricado con panel sándwich blanco instalado en jardín" className="h-[310px] w-full object-cover md:h-[470px]" fetchPriority="high" />
        <div className="grid border border-t-0 border-slate-200 bg-slate-50 sm:grid-cols-3">
          {['Panel sándwich', 'Fabricación a medida', 'Atención directa'].map((item) => <div key={item} className="border-b border-slate-200 p-4 text-sm font-black text-slate-800 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"><CheckCircle2 size={17} className="mb-2 text-brand-green" />{item}</div>)}
        </div>
      </div>
    </div>
  </section>
);

const TrustSection = () => (
  <section className="bg-slate-50 py-8">
    <div className="container-page grid gap-px overflow-hidden border border-slate-200 bg-slate-200 md:grid-cols-4">
      {[
        ['Empresa', company.name],
        ['CIF', company.cif],
        ['Ubicación', 'San José de la Rinconada, Sevilla'],
        ['Contacto', company.phone],
      ].map(([label, value]) => (
        <div key={label} className="bg-white p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">{label}</p>
          <p className="mt-2 text-sm font-black leading-6 text-slate-950">{value}</p>
        </div>
      ))}
    </div>
  </section>
);

const UseCasesSection = () => (
  <section id="servicios" className="bg-white py-14 md:py-20">
    <div className="container-page">
      <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
        <SectionIntro eyebrow="Tipos de módulos" title="Soluciones para finca, obra, oficina y almacén" description="Una estructura de catálogo clara para entender qué podemos fabricar y qué uso tiene cada módulo." />
        <div className="border-y border-slate-200">
          {useCases.map((item, index) => (
            <article key={item.title} className="grid gap-5 border-b border-slate-200 py-6 last:border-b-0 md:grid-cols-[190px_1fr] md:items-center">
              <img src={item.image} alt={item.alt} className="h-36 w-full object-cover" loading="lazy" />
              <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">0{index + 1}</p>
                  <h3 className="mt-1 text-2xl font-black text-slate-950">{item.title}</h3>
                  <p className="mt-2 max-w-2xl leading-7 text-slate-600">{item.description}</p>
                </div>
                <a href="#calculadora" className="text-sm font-black text-brand-orange hover:text-orange-700">Configurar →</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const ConfiguratorSection = ({ onStart }: { onStart: () => void }) => (
  <section id="calculadora" className="border-y border-slate-200 bg-slate-100 py-14 md:py-20">
    <div className="container-page grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
      <div>
        <SectionIntro eyebrow="Calculadora de presupuesto" title="Configura lo básico antes de pedir presupuesto" description="La herramienta no sustituye la revisión técnica. Sirve para definir medidas, panel, puertas, ventanas y extras, y enviarnos una solicitud más precisa." />
        <Button onClick={onStart} className="mt-7 rounded-md"><Calculator size={18} /> Abrir configurador</Button>
      </div>
      <div className="border border-slate-300 bg-white">
        <div className="border-b border-slate-200 p-5">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">Qué puedes definir</p>
        </div>
        <div className="grid gap-px bg-slate-200 sm:grid-cols-2">
          {['Medidas del módulo', 'Tipo y grosor de panel', 'Puertas y ventanas', 'Enchufes e iluminación', 'Baño y distribución', 'Ubicación y plazo'].map((item) => (
            <div key={item} className="bg-white p-5 text-sm font-black text-slate-800"><CheckCircle2 size={17} className="mb-2 text-brand-green" />{item}</div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const GallerySection = () => (
  <section id="galeria" className="bg-white py-14 md:py-20">
    <div className="container-page">
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <SectionIntro eyebrow="Ejemplos reales" title="Imágenes de módulos y acabados" description="La galería tiene más peso visual porque el producto físico debe verse con claridad." />
        <p className="max-w-sm text-sm leading-6 text-slate-500">Las imágenes sirven como referencia de formato, proporción, puertas, ventanas e interiores.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <div>
          <img src={galleryImages[0].src} alt={galleryImages[0].alt} className="h-[340px] w-full object-cover md:h-[560px]" loading="lazy" />
          <p className="mt-3 text-sm font-bold text-slate-700">{galleryImages[0].title}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {galleryImages.slice(1).map((image) => (
            <div key={image.src}>
              <img src={image.src} alt={image.alt} className="h-40 w-full object-cover md:h-44" loading="lazy" />
              <p className="mt-2 text-sm font-bold text-slate-700">{image.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const ProcessSection = () => (
  <section id="proceso" className="border-y border-slate-200 bg-slate-950 py-14 text-white md:py-20">
    <div className="container-page">
      <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-orange">Proceso de trabajo</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">De la idea al presupuesto final</h2>
          <p className="mt-4 leading-8 text-slate-300">Un proceso directo para ordenar la información antes de fabricar o presupuestar.</p>
        </div>
        <div className="grid gap-px bg-white/10 md:grid-cols-4">
          {processSteps.map(([number, title, description]) => (
            <div key={number} className="bg-slate-950 p-5">
              <p className="text-sm font-black text-brand-orange">{number}</p>
              <h3 className="mt-3 font-black">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const ModelsSection = ({ onStart }: { onStart: () => void }) => (
  <section id="modelos" className="bg-slate-50 py-14 md:py-20">
    <div className="container-page">
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <SectionIntro eyebrow="Medidas habituales" title="Modelos frecuentes" description="Formatos habituales para orientar el presupuesto inicial. Las medidas especiales se estudian bajo consulta." />
        <Button onClick={onStart} className="rounded-md"><Ruler size={18} /> Comparar medidas</Button>
      </div>
      <div className="overflow-hidden border border-slate-200 bg-white">
        {models.map(([measure, title, usage]) => (
          <div key={measure} className="grid gap-3 border-b border-slate-200 p-5 last:border-b-0 md:grid-cols-[180px_190px_1fr] md:items-center">
            <p className="text-2xl font-black text-slate-950">{measure}</p>
            <p className="font-black text-brand-orange">{title}</p>
            <p className="text-sm leading-6 text-slate-600">{usage}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ContactCta = ({ onStart }: { onStart: () => void }) => (
  <section id="contacto" className="bg-white py-14 md:py-20">
    <div className="container-page grid gap-8 border border-slate-200 bg-slate-50 p-6 md:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-orange">Contacto</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">Solicita presupuesto para tu módulo prefabricado</h2>
        <p className="mt-4 max-w-3xl leading-8 text-slate-600">Llámanos o envíanos tu configuración para revisar medidas, extras, transporte, montaje y disponibilidad.</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
        <Button onClick={onStart} className="rounded-md"><Calculator size={18} /> Calcular precio</Button>
        <a href={whatsappContactUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-green px-5 py-3 font-black text-white transition hover:bg-emerald-700"><MessageCircle size={18} /> WhatsApp</a>
        <a href={`tel:${company.phoneHref}`} className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-3 font-black text-slate-900 transition hover:bg-slate-50"><Phone size={18} /> Llamar</a>
      </div>
    </div>
  </section>
);

const Footer = ({ onLegalPage, onAdmin, onStart }: LandingPageProps) => (
  <footer className="bg-slate-950 text-white">
    <div className="container-page grid gap-8 py-10 md:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_0.9fr_0.7fr]">
      <div>
        <div className="inline-flex bg-white p-2"><img src="/logo-sanjose-horizontal.svg" alt="Módulos Prefabricados San José" className="h-11 w-auto max-w-[250px] object-contain" /></div>
        <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">{company.activity}. Presupuesto personalizado para particulares, obras, fincas, oficinas y empresas.</p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-slate-300"><span className="border border-white/10 px-3 py-1">CIF {company.cif}</span><span className="border border-white/10 px-3 py-1">Sevilla y Andalucía</span></div>
        <div className="mt-5"><SocialLinks variant="dark" /></div>
      </div>

      <div>
        <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">Empresa</h3>
        <div className="mt-4 space-y-3 text-sm text-slate-300">
          <p className="flex gap-3"><Building2 size={18} className="shrink-0 text-brand-orange" /> {company.name}</p>
          <p className="flex gap-3"><MapPin size={18} className="shrink-0 text-brand-orange" /> {company.address}</p>
          <p className="flex gap-3"><ShieldCheck size={18} className="shrink-0 text-brand-green" /> Presupuestos sujetos a revisión técnica.</p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">Contacto</h3>
        <div className="mt-4 space-y-3 text-sm text-slate-300">
          <a href={`tel:${company.phoneHref}`} className="flex items-center gap-3 hover:text-white"><Phone size={18} className="text-brand-orange" /> {company.phone}</a>
          <a href={whatsappContactUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-white"><MessageCircle size={18} className="text-brand-green" /> WhatsApp directo</a>
          <a href={`mailto:${company.email}`} className="flex min-w-0 items-center gap-3 hover:text-white"><Mail size={18} className="shrink-0 text-brand-blue" /> <span className="break-all">{company.email}</span></a>
          <button onClick={onStart} className="flex items-center gap-3 text-brand-orange hover:text-orange-300"><Calculator size={18} /> Calcular precio</button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">Legal</h3>
        <div className="mt-4 space-y-3 text-left text-sm text-slate-300">
          <button onClick={() => onLegalPage('aviso-legal')} className="block hover:text-white">Aviso legal</button>
          <button onClick={() => onLegalPage('privacidad')} className="block hover:text-white">Política de privacidad</button>
          <button onClick={() => onLegalPage('cookies')} className="block hover:text-white">Política de cookies</button>
          <button onClick={onAdmin} className="block pt-2 text-slate-500 hover:text-white">Panel privado</button>
        </div>
      </div>
    </div>

    <div className="border-t border-white/10">
      <div className="container-page flex flex-col gap-2 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {company.name}. Todos los derechos reservados.</p>
        <p>Casetas y módulos prefabricados con panel sándwich.</p>
      </div>
    </div>
  </footer>
);
