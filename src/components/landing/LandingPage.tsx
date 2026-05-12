import { Building2, Calculator, CheckCircle2, Clock3, FileText, Image as ImageIcon, Mail, MapPin, MessageCircle, Phone, Ruler, ShieldCheck, Sparkles } from 'lucide-react';
import { company, whatsappContactUrl } from '../../config/company';
import { SocialLinks } from '../ui/SocialLinks';
import { Button, Card } from '../ui/Ui';

type LegalPage = 'aviso-legal' | 'privacidad' | 'cookies';

type LandingPageProps = {
  onStart: () => void;
  onLegalPage: (page: LegalPage) => void;
  onAdmin: () => void;
};

type GalleryImage = {
  src: string;
  title: string;
  description: string;
  alt: string;
  featured?: boolean;
};

const navItems = [
  ['Servicios', '#servicios'],
  ['Galería', '#galeria'],
  ['Proceso', '#proceso'],
  ['Modelos', '#modelos'],
  ['Contacto', '#contacto'],
] as const;

const trustItems = [
  ['Empresa registrada', `${company.name} · CIF ${company.cif}`],
  ['Fabricación a medida', 'Medidas, distribución, panel y extras según el proyecto.'],
  ['Atención directa', 'Teléfono y WhatsApp para resolver dudas antes del presupuesto.'],
  ['Revisión técnica', 'Precio final confirmado tras revisar transporte, accesos y montaje.'],
] as const;

const useCases = [
  ['Casetas para fincas', 'Para aperos, herramientas, maquinaria o zona auxiliar de descanso.'],
  ['Módulos oficina', 'Espacios de trabajo para empresas, talleres, obras y negocios.'],
  ['Casetas de obra', 'Soluciones resistentes para almacén temporal y zonas de trabajo.'],
  ['Vestuarios prefabricados', 'Módulos para trabajadores, instalaciones deportivas o empresas.'],
  ['Almacenes prefabricados', 'Espacios seguros para guardar material, mercancía o herramientas.'],
] as const;

const processSteps = [
  ['Definimos el uso', 'Medidas, ubicación, accesos, panel y distribución interior.', Ruler],
  ['Diseñamos el plano', 'Configurador CAD 2D con puertas, ventanas, baño y extras.', Sparkles],
  ['Calculamos orientación', 'Precio estimado para valorar el proyecto antes de fabricarlo.', Clock3],
  ['Cerramos presupuesto', 'Revisión técnica de transporte, montaje y detalles finales.', FileText],
] as const;

const models = [
  ['Compacto', '3 x 2,40 m', 'Herramientas, finca o pequeño almacén'],
  ['Auxiliar', '4 x 2,40 m', 'Fincas, uso auxiliar y almacenamiento'],
  ['Medio', '5 x 2,40 m', 'Almacén, obra o espacio auxiliar'],
  ['Más vendido', '6 x 2,40 m', 'Oficina pequeña, finca o caseta de obra'],
  ['Grande', '7 x 2,40 m', 'Vestuario, oficina o módulo amplio'],
  ['Especial', '8 x 2,40 m', 'Bajo consulta técnica y transporte'],
] as const;

const galleryImages: readonly GalleryImage[] = [
  {
    src: '/images/hero-modulo-prefabricado-jardin.webp',
    title: 'Módulo exterior premium',
    description: 'Acabado limpio con panel sándwich blanco, preparado para uso profesional o particular.',
    alt: 'Módulo prefabricado con panel sándwich blanco instalado en jardín',
    featured: true,
  },
  {
    src: '/images/caseta-prefabricada-frontal-finca.webp',
    title: 'Caseta para finca',
    description: 'Puerta, ventana y formato práctico para fincas, aperos y almacenamiento.',
    alt: 'Caseta prefabricada blanca frontal para finca',
  },
  {
    src: '/images/modulo-prefabricado-obra-dos-ventanas.webp',
    title: 'Módulo para obra',
    description: 'Formato amplio con doble ventana para uso profesional, obra u oficina.',
    alt: 'Módulo prefabricado de obra con dos ventanas',
  },
  {
    src: '/images/modulo-prefabricado-finca-dos-ventanas.webp',
    title: 'Módulo grande',
    description: 'Solución alargada para oficinas, vestuarios, almacenes o fincas.',
    alt: 'Módulo prefabricado largo para finca con dos ventanas',
  },
  {
    src: '/images/interior-modulo-prefabricado-oficina.webp',
    title: 'Interior acondicionado',
    description: 'Panel blanco, instalación eléctrica, iluminación y aire acondicionado.',
    alt: 'Interior acondicionado de módulo prefabricado con instalación eléctrica',
  },
];

const SectionHeader = ({ eyebrow, title, description, align = 'center', tone = 'light' }: { eyebrow: string; title: string; description?: string; align?: 'left' | 'center'; tone?: 'light' | 'dark' }) => {
  const isDark = tone === 'dark';

  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-orange">{eyebrow}</p>
      <h2 className={`mt-3 text-3xl font-black tracking-tight md:text-5xl ${isDark ? 'text-white' : 'text-slate-950'}`}>{title}</h2>
      {description ? <p className={`mt-4 text-base leading-8 md:text-lg ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{description}</p> : null}
    </div>
  );
};

export const LandingPage = ({ onStart, onLegalPage, onAdmin }: LandingPageProps) => (
  <div className="min-h-screen bg-stone-50 text-slate-950">
    <Header onStart={onStart} />

    <main id="inicio">
      <HeroSection onStart={onStart} />
      <TrustStrip />
      <ConfiguratorSection onStart={onStart} />
      <ProcessSection />
      <ServicesSection />
      <GallerySection onStart={onStart} />
      <ModelsSection onStart={onStart} />
      <FinalCta onStart={onStart} />
    </main>

    <Footer onLegalPage={onLegalPage} onAdmin={onAdmin} onStart={onStart} />
  </div>
);

const Header = ({ onStart }: { onStart: () => void }) => (
  <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-[0_12px_34px_rgba(15,23,42,0.08)] backdrop-blur-xl">
    <div className="hidden border-b border-white/10 bg-slate-950 text-white lg:block">
      <div className="container-page flex h-9 items-center justify-between text-xs font-bold text-slate-300">
        <span className="inline-flex items-center gap-2"><MapPin size={14} className="text-brand-orange" /> San José de la Rinconada · Sevilla</span>
        <div className="flex items-center gap-5">
          <span className="inline-flex items-center gap-2"><ShieldCheck size={14} className="text-brand-green" /> Empresa registrada · CIF {company.cif}</span>
          <a href={`tel:${company.phoneHref}`} className="inline-flex items-center gap-2 hover:text-white"><Phone size={14} className="text-brand-orange" /> {company.phone}</a>
          <SocialLinks variant="dark" />
        </div>
      </div>
    </div>

    <div className="container-page flex items-center justify-between gap-3 py-3">
      <a href="#inicio" aria-label="Volver al inicio" className="flex min-w-0 items-center">
        <img src="/logo-sanjose-horizontal.svg" alt="Módulos Prefabricados San José" className="h-10 w-auto max-w-[205px] object-contain sm:h-12 sm:max-w-[270px] lg:h-14 lg:max-w-[330px]" />
      </a>

      <nav aria-label="Navegación principal" className="hidden items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1 text-sm font-black text-slate-600 lg:flex">
        <button onClick={onStart} className="rounded-full px-4 py-2 text-slate-950 transition hover:bg-white hover:text-brand-orange hover:shadow-sm">Calculadora</button>
        {navItems.map(([label, href]) => <a key={href} href={href} className="rounded-full px-4 py-2 transition hover:bg-white hover:text-brand-orange hover:shadow-sm">{label}</a>)}
      </nav>

      <div className="flex shrink-0 items-center gap-2">
        <a href={`tel:${company.phoneHref}`} className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 sm:inline-flex"><Phone size={17} /> Llamar</a>
        <a href={whatsappContactUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl bg-brand-green px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-emerald-700"><MessageCircle size={17} /><span className="hidden sm:inline">WhatsApp</span></a>
      </div>
    </div>

    <nav aria-label="Navegación móvil" className="border-t border-slate-100 bg-white lg:hidden">
      <div className="container-page flex gap-2 overflow-x-auto py-2 text-xs font-black text-slate-600">
        <button onClick={onStart} className="whitespace-nowrap rounded-full bg-slate-950 px-3 py-2 text-white">Calculadora</button>
        {navItems.map(([label, href]) => <a key={href} href={href} className="whitespace-nowrap rounded-full bg-slate-100 px-3 py-2">{label}</a>)}
      </div>
    </nav>
  </header>
);

const HeroSection = ({ onStart }: { onStart: () => void }) => (
  <section className="relative isolate overflow-hidden bg-slate-950 text-white">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(249,115,22,0.22),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(29,78,216,0.25),transparent_32%)]" />
    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-stone-50 to-transparent" />

    <div className="container-page relative grid gap-10 py-14 md:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-24">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-orange-100"><Sparkles size={15} /> Fabricación a medida en Sevilla</span>
        <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight md:text-6xl lg:text-7xl">Casetas y módulos prefabricados con acabado profesional</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Diseñamos y fabricamos módulos con panel sándwich para fincas, obras, oficinas, vestuarios y almacenes. Configura tu módulo, visualiza el plano y solicita presupuesto revisado.</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button onClick={onStart} className="px-6 py-4 text-base"><Calculator size={19} /> Calcular precio orientativo</Button>
          <a href={whatsappContactUrl} target="_blank" rel="noreferrer"><Button variant="outline" className="w-full border-white/20 bg-white/10 px-6 py-4 text-base text-white hover:bg-white/15 sm:w-auto"><MessageCircle size={19} /> Hablar por WhatsApp</Button></a>
        </div>

        <div className="mt-8 grid gap-3 text-sm font-bold text-slate-200 sm:grid-cols-3">
          {['Panel sándwich', 'Plano CAD 2D', 'Presupuesto revisado'].map((item) => <span key={item} className="flex items-center gap-2"><CheckCircle2 size={18} className="text-brand-green" /> {item}</span>)}
        </div>
      </div>

      <div className="relative">
        <div className="rounded-[2rem] border border-white/10 bg-white/10 p-3 shadow-2xl shadow-black/40 backdrop-blur">
          <div className="overflow-hidden rounded-[1.5rem] bg-white text-slate-950">
            <img src="/images/hero-modulo-prefabricado-jardin.webp" alt="Módulo prefabricado con panel sándwich blanco instalado en jardín" className="h-[270px] w-full object-cover sm:h-[360px] lg:h-[430px]" fetchPriority="high" />
            <div className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-orange">Modelo más solicitado</p>
                <p className="mt-1 text-3xl font-black">6 x 2,40 m</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">Precio orientativo sujeto a medidas finales, extras, transporte, montaje y revisión técnica.</p>
              </div>
              <div className="rounded-2xl border border-orange-100 bg-orange-50 px-5 py-4 text-right">
                <p className="text-xs font-black uppercase text-orange-700">desde</p>
                <p className="text-2xl font-black text-brand-orange">4.750 €</p>
                <p className="text-xs font-bold text-slate-500">sin IVA</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-6 left-6 right-6 hidden rounded-3xl border border-white/10 bg-slate-900/90 p-4 text-sm font-bold text-slate-200 shadow-2xl backdrop-blur md:block">
          <span className="text-brand-orange">Proceso claro:</span> configuración, plano, precio orientativo y revisión personalizada.
        </div>
      </div>
    </div>
  </section>
);

const TrustStrip = () => (
  <section className="relative -mt-8 z-10 pb-10">
    <div className="container-page">
      <div className="grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft sm:grid-cols-2 lg:grid-cols-4">
        {trustItems.map(([title, description]) => (
          <div key={title} className="border-b border-slate-100 p-5 last:border-b-0 sm:border-r sm:last:border-r-0 lg:border-b-0">
            <ShieldCheck className="mb-3 text-brand-green" />
            <h2 className="font-black text-slate-950">{title}</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ConfiguratorSection = ({ onStart }: { onStart: () => void }) => (
  <section id="calculadora" className="bg-stone-50 py-16 md:py-20">
    <div className="container-page grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <div>
        <SectionHeader align="left" eyebrow="Configurador de presupuesto" title="Convierte una idea en un plano claro antes de pedir precio" description="El configurador ayuda a definir medidas, panel, ubicación y extras. Así recibimos una solicitud más precisa y podemos confirmar el presupuesto final con menos dudas." />
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {['Medidas habituales de 3 a 8 metros', 'Puertas, ventanas, enchufes y baño', 'Plano CAD 2D orientativo', 'PDF y WhatsApp preparados'].map((item) => <span key={item} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm">✓ {item}</span>)}
        </div>
        <Button onClick={onStart} className="mt-7"><Calculator size={18} /> Abrir configurador CAD</Button>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-950/20">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-orange">Diseño 2D profesional</p>
        <h3 className="mt-3 text-3xl font-black">Plano técnico para visualizar distribución y extras</h3>
        <p className="mt-4 leading-7 text-slate-300">Grid, cotas, muros, símbolos arquitectónicos, selección, arrastre, zoom y exportación a PDF. Pensado para que el cliente entienda el módulo antes de cerrar el presupuesto.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {['CAD 2D', 'Extras', 'PDF'].map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center font-black">{item}</div>)}
        </div>
      </div>
    </div>
  </section>
);

const ProcessSection = () => (
  <section id="proceso" className="bg-white py-16 md:py-20">
    <div className="container-page">
      <SectionHeader eyebrow="Método de trabajo" title="Un proceso sencillo para fabricar con menos incertidumbre" description="La web no sustituye la revisión técnica: la ordena. Primero definimos el módulo y después confirmamos transporte, montaje y detalles finales." />
      <div className="mt-12 grid gap-5 md:grid-cols-4">
        {processSteps.map(([title, description, Icon], index) => (
          <Card key={title} className="relative overflow-hidden">
            <div className="absolute right-5 top-5 text-5xl font-black text-slate-100">0{index + 1}</div>
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-brand-orange"><Icon /></div>
            <h3 className="relative mt-5 font-black text-slate-950">{title}</h3>
            <p className="relative mt-2 text-sm leading-6 text-slate-600">{description}</p>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

const ServicesSection = () => (
  <section id="servicios" className="bg-slate-950 py-16 text-white md:py-20">
    <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
      <div>
        <SectionHeader align="left" tone="dark" eyebrow="Aplicaciones" title="Módulos para uso real, no soluciones genéricas" description="Fabricamos para particulares, obras, negocios y empresas que necesitan una solución práctica, resistente y adaptada al uso previsto." />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {useCases.map(([title, description], index) => (
          <div key={title} className={index === 0 ? 'rounded-3xl border border-white/10 bg-white p-6 text-slate-950 shadow-2xl sm:col-span-2' : 'rounded-3xl border border-white/10 bg-white/5 p-6'}>
            <CheckCircle2 className={index === 0 ? 'mb-4 text-brand-green' : 'mb-4 text-brand-orange'} />
            <h3 className="text-xl font-black">{title}</h3>
            <p className={index === 0 ? 'mt-2 text-sm leading-6 text-slate-600' : 'mt-2 text-sm leading-6 text-slate-300'}>{description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const GallerySection = ({ onStart }: { onStart: () => void }) => (
  <section id="galeria" className="bg-stone-50 py-16 md:py-20">
    <div className="container-page">
      <SectionHeader eyebrow="Galería" title="Acabados exteriores e interiores con presencia profesional" description="Imágenes de referencia para visualizar formatos, proporciones, ventanas, puertas e interiores acondicionados." />
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {galleryImages.map((image) => (
          <article key={image.src} className={`${image.featured ? 'lg:col-span-2 lg:row-span-2' : ''} group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-2xl`}>
            <div className="overflow-hidden">
              <img src={image.src} alt={image.alt} className={`${image.featured ? 'h-[360px] lg:h-[520px]' : 'h-64'} w-full object-cover transition duration-500 group-hover:scale-105`} loading={image.featured ? 'eager' : 'lazy'} />
            </div>
            <div className="p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-orange">Módulos San José</p>
              <h3 className="mt-2 text-xl font-black text-slate-950">{image.title}</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{image.description}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft md:flex md:items-center md:justify-between">
        <div>
          <h3 className="text-2xl font-black text-slate-950">¿Quieres un módulo parecido?</h3>
          <p className="mt-2 text-slate-600">Configura medidas, distribución y extras para preparar un presupuesto personalizado.</p>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row md:mt-0">
          <Button onClick={onStart}>Calcular mi módulo</Button>
          <a href={whatsappContactUrl} target="_blank" rel="noreferrer"><Button variant="outline" className="w-full sm:w-auto">WhatsApp</Button></a>
        </div>
      </div>
    </div>
  </section>
);

const ModelsSection = ({ onStart }: { onStart: () => void }) => (
  <section id="modelos" className="bg-white py-16 md:py-20">
    <div className="container-page">
      <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div>
          <SectionHeader align="left" eyebrow="Modelos habituales" title="Medidas frecuentes para orientar tu decisión" description="Estos formatos ayudan a comparar opciones. También podemos estudiar configuraciones especiales bajo consulta técnica." />
          <Button onClick={onStart} className="mt-7"><Calculator size={18} /> Comparar medidas</Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {models.map(([title, measure, usage]) => (
            <div key={title} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-soft">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-brand-orange">{title}</p>
              <p className="mt-2 text-3xl font-black text-slate-950">{measure}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{usage}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const FinalCta = ({ onStart }: { onStart: () => void }) => (
  <section id="contacto" className="bg-brand-navy py-14 text-white">
    <div className="container-page grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
      <div>
        <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-slate-300"><MapPin size={16} /> San José de la Rinconada · Sevilla</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">Solicita presupuesto para tu caseta prefabricada</h2>
        <p className="mt-4 max-w-3xl leading-8 text-slate-300">Llámanos o envíanos tu configuración por WhatsApp para confirmar medidas, extras, transporte, montaje y disponibilidad.</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
        <a href={`tel:${company.phoneHref}`}><Button variant="outline" className="w-full border-white/20 bg-white/10 text-white hover:bg-white/15 sm:w-auto"><Phone size={18} /> Llamar</Button></a>
        <Button onClick={onStart} className="w-full sm:w-auto"><Calculator size={18} /> Calcular mi módulo</Button>
      </div>
    </div>
  </section>
);

const Footer = ({ onLegalPage, onAdmin, onStart }: LandingPageProps) => (
  <footer className="relative overflow-hidden bg-slate-950 text-white">
    <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 12% 18%, rgba(249,115,22,.22), transparent 28%), radial-gradient(circle at 88% 10%, rgba(29,78,216,.28), transparent 30%)' }} />
    <div className="container-page relative py-12">
      <div className="grid gap-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur md:p-8 lg:grid-cols-[1.35fr_1fr_1fr_0.8fr]">
        <div>
          <div className="inline-flex rounded-3xl bg-white p-3"><img src="/logo-sanjose-horizontal.svg" alt="Módulos Prefabricados San José" className="h-12 w-auto max-w-[260px] object-contain" /></div>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">{company.activity}. Presupuesto personalizado para particulares, obras, fincas, oficinas y empresas.</p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-black text-slate-300"><span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">CIF {company.cif}</span><span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Sevilla y Andalucía</span></div>
          <div className="mt-5"><SocialLinks variant="dark" /></div>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">Servicios</h3>
          <div className="mt-4 space-y-3 text-sm font-semibold text-slate-300">
            {useCases.slice(0, 4).map(([title]) => <a key={title} href="#servicios" className="block transition hover:text-white">{title}</a>)}
            <button onClick={onStart} className="block text-left text-brand-orange transition hover:text-orange-300">Configurador CAD 2D</button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">Contacto</h3>
          <div className="mt-4 space-y-4 text-sm text-slate-300">
            <a href={`tel:${company.phoneHref}`} className="flex items-center gap-3 transition hover:text-white"><Phone size={18} className="shrink-0 text-brand-orange" /> {company.phone}</a>
            <a href={whatsappContactUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 transition hover:text-white"><MessageCircle size={18} className="shrink-0 text-brand-green" /> WhatsApp directo</a>
            <a href={`mailto:${company.email}`} className="flex min-w-0 items-center gap-3 transition hover:text-white"><Mail size={18} className="shrink-0 text-brand-blue" /> <span className="break-all">{company.email}</span></a>
            <p className="flex items-start gap-3"><MapPin size={18} className="mt-0.5 shrink-0 text-brand-orange" /> <span>{company.address}</span></p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">Legal</h3>
          <div className="mt-4 space-y-3 text-left text-sm font-semibold text-slate-300">
            <p className="flex items-start gap-3"><Building2 size={17} className="mt-0.5 shrink-0 text-brand-orange" /> <span>{company.name}</span></p>
            <button onClick={() => onLegalPage('aviso-legal')} className="block transition hover:text-white">Aviso legal</button>
            <button onClick={() => onLegalPage('privacidad')} className="block transition hover:text-white">Política de privacidad</button>
            <button onClick={() => onLegalPage('cookies')} className="block transition hover:text-white">Política de cookies</button>
            <button onClick={onAdmin} className="block pt-2 text-slate-500 transition hover:text-white">Panel privado</button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-white/10 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {company.name}. Todos los derechos reservados.</p>
        <p>Presupuestos orientativos sujetos a revisión técnica.</p>
      </div>
    </div>
  </footer>
);
