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
  ['Proyectos', '#proyectos'],
  ['Proceso', '#proceso'],
  ['Contacto', '#contacto'],
] as const;

const services = [
  {
    title: 'Oficinas modulares',
    description: 'Espacios de trabajo rápidos de instalar para obras, empresas y negocios.',
    image: '/images/interior-modulo-prefabricado-oficina.webp',
    alt: 'Interior acondicionado de módulo prefabricado con instalación eléctrica',
    className: 'md:col-span-2 md:row-span-2',
  },
  {
    title: 'Casetas para fincas',
    description: 'Almacenaje, aperos, herramientas y uso auxiliar en terrenos particulares.',
    image: '/images/caseta-prefabricada-frontal-finca.webp',
    alt: 'Caseta prefabricada blanca frontal para finca',
    className: '',
  },
  {
    title: 'Bodegas y almacenes',
    description: 'Soluciones resistentes para guardar material, mercancía o maquinaria.',
    image: '/images/modulo-prefabricado-finca-dos-ventanas.webp',
    alt: 'Módulo prefabricado largo para finca con dos ventanas',
    className: '',
  },
  {
    title: 'Proyectos especiales',
    description: 'Medidas, paneles, distribuciones y acabados bajo consulta técnica.',
    image: '/images/modulo-prefabricado-perspectiva-jardin.webp',
    alt: 'Módulo prefabricado visto en perspectiva en entorno ajardinado',
    className: 'md:col-span-2',
  },
] as const;

const stats = [
  ['+500', 'proyectos orientados', Building2],
  ['10+', 'años de experiencia sectorial', ShieldCheck],
  ['3-8 m', 'medidas habituales', Ruler],
  ['24/48 h', 'respuesta comercial habitual', FileText],
] as const;

const projects = [
  {
    src: '/images/hero-modulo-prefabricado-jardin.webp',
    title: 'Módulo exterior con acabado blanco',
    alt: 'Módulo prefabricado con panel sándwich blanco instalado en jardín',
  },
  {
    src: '/images/modulo-prefabricado-obra-dos-ventanas.webp',
    title: 'Módulo de obra con dos ventanas',
    alt: 'Módulo prefabricado de obra con dos ventanas',
  },
  {
    src: '/images/caseta-prefabricada-compacta-olivar.webp',
    title: 'Caseta compacta para finca',
    alt: 'Caseta prefabricada compacta instalada en olivar',
  },
  {
    src: '/images/interior-modulo-prefabricado-oficina.webp',
    title: 'Interior acondicionado',
    alt: 'Interior acondicionado de módulo prefabricado con instalación eléctrica',
  },
] as const;

const processSteps = [
  ['01', 'Brief del proyecto', 'Definimos uso, medidas, ubicación, accesos y necesidades reales.'],
  ['02', 'Configuración', 'Seleccionas panel, puertas, ventanas, distribución y extras principales.'],
  ['03', 'Revisión técnica', 'Comprobamos transporte, montaje, instalación y detalles finales.'],
  ['04', 'Presupuesto final', 'Recibes una propuesta clara con precio, condiciones y alcance.'],
] as const;

const models = [
  ['3 x 2,40 m', 'Compacto', 'Herramientas, finca o pequeño almacén'],
  ['4 x 2,40 m', 'Auxiliar', 'Fincas, uso auxiliar y almacenamiento'],
  ['5 x 2,40 m', 'Medio', 'Almacén, obra o espacio auxiliar'],
  ['6 x 2,40 m', 'Más vendido', 'Oficina pequeña, finca o caseta de obra'],
  ['7 x 2,40 m', 'Grande', 'Vestuario, oficina o módulo amplio'],
  ['8 x 2,40 m', 'Especial', 'Bajo consulta técnica y transporte'],
] as const;

const SectionIntro = ({ eyebrow, title, description, center = false }: { eyebrow: string; title: string; description?: string; center?: boolean }) => (
  <div className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
    <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-orange">{eyebrow}</p>
    <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">{title}</h2>
    {description ? <p className="mt-5 text-base leading-8 text-slate-600 md:text-lg">{description}</p> : null}
  </div>
);

export const LandingPage = ({ onStart, onLegalPage, onAdmin }: LandingPageProps) => (
  <div className="min-h-screen bg-[#F9FAFB] text-slate-950">
    <Header onStart={onStart} />

    <main id="inicio">
      <HeroSection onStart={onStart} />
      <StatsSection />
      <ServicesBento onStart={onStart} />
      <ProjectShowcase />
      <ProcessSection />
      <ModelsSection onStart={onStart} />
      <ContactSection onStart={onStart} />
    </main>

    <Footer onLegalPage={onLegalPage} onAdmin={onAdmin} onStart={onStart} />
  </div>
);

const Header = ({ onStart }: { onStart: () => void }) => (
  <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
    <div className="container-page flex items-center justify-between gap-4 py-3">
      <a href="#inicio" aria-label="Volver al inicio" className="flex min-w-0 items-center">
        <img src="/logo-sanjose-horizontal.svg" alt="Módulos Prefabricados San José" className="h-10 w-auto max-w-[220px] object-contain sm:h-12 sm:max-w-[290px]" />
      </a>

      <nav aria-label="Navegación principal" className="hidden items-center gap-7 text-sm font-black text-slate-700 lg:flex">
        {navItems.map(([label, href]) => <a key={href} href={href} className="transition hover:text-brand-orange">{label}</a>)}
      </nav>

      <div className="flex shrink-0 items-center gap-2">
        <button onClick={onStart} className="hidden rounded-full bg-slate-950 px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800 sm:inline-flex">Calcular precio</button>
        <a href={whatsappContactUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-brand-green px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-emerald-700"><MessageCircle size={17} /><span className="hidden sm:inline">WhatsApp</span></a>
      </div>
    </div>

    <nav aria-label="Navegación móvil" className="border-t border-slate-100 bg-white lg:hidden">
      <div className="container-page flex gap-2 overflow-x-auto py-2 text-xs font-bold text-slate-700">
        <button onClick={onStart} className="whitespace-nowrap rounded-full bg-slate-950 px-3 py-2 text-white">Calcular precio</button>
        {navItems.map(([label, href]) => <a key={href} href={href} className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-2">{label}</a>)}
      </div>
    </nav>
  </header>
);

const HeroSection = ({ onStart }: { onStart: () => void }) => (
  <section className="relative isolate min-h-[720px] overflow-hidden bg-slate-950 text-white">
    <img src="/images/hero-modulo-prefabricado-jardin.webp" alt="Módulo prefabricado con panel sándwich blanco instalado en jardín" className="absolute inset-0 h-full w-full object-cover opacity-55" fetchPriority="high" />
    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/78 to-slate-950/25" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.22),transparent_28%)]" />

    <div className="container-page relative flex min-h-[720px] items-center py-16">
      <div className="max-w-4xl">
        <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-orange-100 backdrop-blur">Construcción modular en Sevilla</p>
        <h1 className="mt-7 text-5xl font-black tracking-tight md:text-7xl lg:text-8xl">Construcción Modular: Rápida, Sólida, Sostenible</h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-200 md:text-xl">Fabricamos casetas y módulos prefabricados con panel sándwich para oficinas, fincas, obras, almacenes y proyectos especiales.</p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <button onClick={onStart} className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-brand-orange to-orange-500 px-7 py-4 text-base font-black text-white shadow-2xl shadow-orange-950/30 transition hover:-translate-y-0.5">
            <span className="absolute inset-y-0 -left-10 w-10 rotate-12 bg-white/30 transition duration-700 group-hover:left-[120%]" />
            <Calculator size={19} /> Calcular precio
          </button>
          <a href={whatsappContactUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-4 text-base font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"><MessageCircle size={19} /> Pedir presupuesto por WhatsApp</a>
        </div>

        <div className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
          {['Panel sándwich', 'Fabricación a medida', 'Presupuesto revisado'].map((item) => <span key={item} className="border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-slate-100 backdrop-blur"><CheckCircle2 size={17} className="mb-2 text-brand-green" />{item}</span>)}
        </div>
      </div>
    </div>
  </section>
);

const StatsSection = () => (
  <section className="border-b border-slate-200 bg-white py-10">
    <div className="container-page grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 md:grid-cols-4">
      {stats.map(([number, label, Icon]) => (
        <div key={number} className="bg-white p-6">
          <Icon size={24} className="text-brand-orange" />
          <p className="mt-5 text-4xl font-black tracking-tight text-slate-950">{number}</p>
          <p className="mt-2 text-sm font-bold uppercase tracking-[0.12em] text-slate-500">{label}</p>
        </div>
      ))}
    </div>
  </section>
);

const ServicesBento = ({ onStart }: { onStart: () => void }) => (
  <section id="servicios" className="bg-[#F9FAFB] py-20 md:py-28">
    <div className="container-page">
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionIntro eyebrow="Servicios" title="Soluciones modulares para empresa, obra y finca" description="Un catálogo claro de módulos prefabricados pensado para proyectos funcionales, rápidos de instalar y adaptados al uso real." />
        <Button onClick={onStart} className="rounded-full"><Calculator size={18} /> Configurar módulo</Button>
      </div>

      <div className="grid auto-rows-[310px] gap-5 md:grid-cols-4">
        {services.map((service) => (
          <article key={service.title} className={`${service.className} group relative overflow-hidden rounded-2xl bg-slate-950 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl`}>
            <img src={service.image} alt={service.alt} className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-500 group-hover:scale-105 group-hover:opacity-85" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <h3 className="text-2xl font-black tracking-tight">{service.title}</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-200">{service.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

const ProjectShowcase = () => (
  <section id="proyectos" className="bg-white py-20 md:py-28">
    <div className="container-page">
      <SectionIntro center eyebrow="Showcase" title="Proyectos y acabados con presencia profesional" description="Imágenes grandes, limpias y orientadas a mostrar el producto físico: exterior, volumen, ventanas, puertas e interior acondicionado." />
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {projects.map((project, index) => (
          <figure key={project.src} className={`${index === 0 ? 'md:col-span-2' : ''} group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl`}>
            <img src={project.src} alt={project.alt} className={`${index === 0 ? 'h-[360px] md:h-[560px]' : 'h-[320px]'} w-full object-cover transition duration-500 group-hover:scale-[1.03]`} loading="lazy" />
            <figcaption className="px-5 py-4 text-sm font-black text-slate-800">{project.title}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);

const ProcessSection = () => (
  <section id="proceso" className="bg-slate-950 py-20 text-white md:py-28">
    <div className="container-page grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-orange">Proceso</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">De la idea al módulo fabricado</h2>
        <p className="mt-5 leading-8 text-slate-300">Un proceso comercial claro para ordenar medidas, uso, extras, transporte y montaje antes del presupuesto final.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {processSteps.map(([number, title, description]) => (
          <div key={number} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:bg-white/[0.07]">
            <p className="text-sm font-black text-brand-orange">{number}</p>
            <h3 className="mt-4 text-xl font-black">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ModelsSection = ({ onStart }: { onStart: () => void }) => (
  <section id="modelos" className="bg-[#F9FAFB] py-20 md:py-28">
    <div className="container-page">
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionIntro eyebrow="Medidas" title="Modelos habituales" description="Formatos frecuentes para orientar el presupuesto. Las configuraciones especiales se estudian bajo revisión técnica." />
        <Button onClick={onStart} className="rounded-full"><Ruler size={18} /> Comparar medidas</Button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {models.map(([measure, title, usage]) => (
          <div key={measure} className="grid gap-3 border-b border-slate-200 p-5 last:border-b-0 md:grid-cols-[180px_190px_1fr] md:items-center">
            <p className="text-3xl font-black text-slate-950">{measure}</p>
            <p className="font-black text-brand-orange">{title}</p>
            <p className="text-sm leading-6 text-slate-600">{usage}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ContactSection = ({ onStart }: { onStart: () => void }) => (
  <section id="contacto" className="bg-white py-20 md:py-28">
    <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
      <div>
        <SectionIntro eyebrow="Contacto" title="Cuéntanos qué módulo necesitas" description="Puedes usar el configurador o enviarnos tus datos. Revisaremos medidas, extras, transporte y montaje para preparar una respuesta comercial." />
        <div className="mt-8 space-y-4 text-sm font-bold text-slate-700">
          <a href={`tel:${company.phoneHref}`} className="flex items-center gap-3 hover:text-brand-orange"><Phone size={18} /> {company.phone}</a>
          <a href={`mailto:${company.email}`} className="flex items-center gap-3 hover:text-brand-orange"><Mail size={18} /> {company.email}</a>
          <p className="flex items-start gap-3"><MapPin size={18} /> {company.address}</p>
        </div>
        <Button onClick={onStart} className="mt-8 rounded-full"><Calculator size={18} /> Abrir configurador</Button>
      </div>

      <form action={`mailto:${company.email}`} method="post" encType="text/plain" className="rounded-2xl border border-slate-200 bg-[#F9FAFB] p-6 shadow-xl shadow-slate-950/5 md:p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block text-sm font-black text-slate-700">Nombre
            <input name="nombre" required className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold outline-none transition focus:border-brand-orange focus:ring-4 focus:ring-orange-100" placeholder="Tu nombre" />
          </label>
          <label className="block text-sm font-black text-slate-700">Teléfono
            <input name="telefono" required className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold outline-none transition focus:border-brand-orange focus:ring-4 focus:ring-orange-100" placeholder="600 000 000" />
          </label>
          <label className="block text-sm font-black text-slate-700 md:col-span-2">Email
            <input name="email" type="email" className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold outline-none transition focus:border-brand-orange focus:ring-4 focus:ring-orange-100" placeholder="tu@email.com" />
          </label>
          <label className="block text-sm font-black text-slate-700 md:col-span-2">Proyecto
            <textarea name="proyecto" required rows={5} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold outline-none transition focus:border-brand-orange focus:ring-4 focus:ring-orange-100" placeholder="Medidas, uso, ubicación, puertas, ventanas o extras..." />
          </label>
        </div>
        <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-orange to-orange-500 px-6 py-4 font-black text-white shadow-lg shadow-orange-950/20 transition hover:-translate-y-0.5 hover:from-orange-600 hover:to-orange-500"><FileText size={18} /> Enviar solicitud</button>
        <p className="mt-4 text-xs leading-5 text-slate-500">El formulario abre tu cliente de correo para enviar la solicitud. También puedes contactarnos por WhatsApp.</p>
      </form>
    </div>
  </section>
);

const Footer = ({ onLegalPage, onAdmin, onStart }: LandingPageProps) => (
  <footer className="bg-slate-950 text-white">
    <div className="container-page grid gap-8 py-10 md:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_0.9fr_0.7fr]">
      <div>
        <div className="inline-flex rounded-xl bg-white p-2"><img src="/logo-sanjose-horizontal.svg" alt="Módulos Prefabricados San José" className="h-11 w-auto max-w-[250px] object-contain" /></div>
        <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">{company.activity}. Presupuesto personalizado para particulares, obras, fincas, oficinas y empresas.</p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-slate-300"><span className="rounded-full border border-white/10 px-3 py-1">CIF {company.cif}</span><span className="rounded-full border border-white/10 px-3 py-1">Sevilla y Andalucía</span></div>
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
        <p>Construcción modular rápida, sólida y sostenible.</p>
      </div>
    </div>
  </footer>
);
