import { Building2, Calculator, CheckCircle2, Clock3, FileText, Image as ImageIcon, Mail, MapPin, MessageCircle, Phone, Ruler, ShieldCheck, Sparkles } from 'lucide-react';
import { company, whatsappContactUrl } from '../../config/company';
import { SocialLinks } from '../ui/SocialLinks';
import { Button, Card } from '../ui/Ui';

const useCases = [
  ['Casetas para fincas', 'Para herramientas, maquinaria, aperos o zonas de descanso en terrenos particulares.'],
  ['Módulos oficina', 'Espacios de trabajo para empresas, talleres, obras o negocios.'],
  ['Casetas de obra', 'Soluciones resistentes para obras, almacenes temporales y zonas de trabajo.'],
  ['Vestuarios prefabricados', 'Módulos para trabajadores, instalaciones deportivas o empresas.'],
  ['Almacenes prefabricados', 'Espacios seguros para guardar material, mercancía o herramientas.'],
] as const;

const models = [
  ['Módulo compacto', '3 x 2,40 m', 'Herramientas, finca o pequeño almacén'],
  ['Módulo auxiliar', '4 x 2,40 m', 'Fincas, uso auxiliar y almacenamiento'],
  ['Módulo medio', '5 x 2,40 m', 'Almacén, obra o espacio auxiliar'],
  ['Más vendido', '6 x 2,40 m', 'Oficina pequeña, finca, almacén o caseta de obra'],
  ['Módulo grande', '7 x 2,40 m', 'Vestuario, oficina o módulo amplio'],
  ['Proyecto especial', '8 x 2,40 m', 'Bajo consulta técnica y transporte'],
] as const;

const galleryImages = [
  {
    src: '/images/caseta-prefabricada-frontal-finca.webp',
    title: 'Caseta para finca',
    description: 'Módulo blanco con puerta y ventana, ideal para fincas, aperos y almacenamiento.',
    alt: 'Caseta prefabricada blanca frontal para finca',
  },
  {
    src: '/images/modulo-prefabricado-obra-dos-ventanas.webp',
    title: 'Módulo para obra',
    description: 'Módulo amplio con dos ventanas, preparado para uso profesional, obra u oficina.',
    alt: 'Módulo prefabricado de obra con dos ventanas',
  },
  {
    src: '/images/modulo-prefabricado-finca-dos-ventanas.webp',
    title: 'Módulo grande',
    description: 'Formato alargado con doble ventana para oficinas, vestuarios o almacenes.',
    alt: 'Módulo prefabricado largo para finca con dos ventanas',
  },
  {
    src: '/images/caseta-prefabricada-compacta-olivar.webp',
    title: 'Caseta compacta',
    description: 'Solución compacta para fincas, terrenos particulares y pequeños almacenes.',
    alt: 'Caseta prefabricada compacta instalada en olivar',
  },
  {
    src: '/images/interior-modulo-prefabricado-oficina.webp',
    title: 'Interior acondicionado',
    description: 'Interior con panel blanco, instalación eléctrica, iluminación y aire acondicionado.',
    alt: 'Interior acondicionado de módulo prefabricado con instalación eléctrica',
  },
  {
    src: '/images/modulo-prefabricado-perspectiva-jardin.webp',
    title: 'Acabado premium',
    description: 'Vista exterior en entorno ajardinado para mostrar el acabado final del módulo.',
    alt: 'Módulo prefabricado visto en perspectiva en entorno ajardinado',
  },
] as const;

export const LandingPage = ({ onStart, onLegalPage, onAdmin }: { onStart: () => void; onLegalPage: (page: 'aviso-legal' | 'privacidad' | 'cookies') => void; onAdmin: () => void }) => (
  <div className="min-h-screen bg-brand-light">
    <Header onStart={onStart} />

    <main id="inicio">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, #f97316 0, transparent 25%), radial-gradient(circle at 80% 10%, #1d4ed8 0, transparent 20%)' }} />
        <div className="container-page relative grid gap-10 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <span className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-black ring-1 ring-white/20">Fabricación a medida · Presupuesto personalizado · Sevilla y Andalucía</span>
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">Casetas y módulos prefabricados a medida en Sevilla</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-200">Fabricamos módulos con panel sándwich para fincas, oficinas, obras, almacenes, vestuarios y negocios. Configura medidas, distribución y extras para recibir un precio orientativo y solicitar presupuesto final.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button onClick={onStart}><Calculator size={18} /> Calcular precio orientativo</Button>
              <a href={whatsappContactUrl} target="_blank" rel="noreferrer"><Button variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20"><MessageCircle size={18} /> Pedir presupuesto por WhatsApp</Button></a>
            </div>
            <div className="mt-6 grid gap-3 text-sm font-bold text-slate-200 sm:grid-cols-3">
              <span className="flex items-center gap-2"><CheckCircle2 size={18} className="text-brand-green" /> Panel sándwich</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={18} className="text-brand-green" /> Plano CAD 2D</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={18} className="text-brand-green" /> Atención directa</span>
            </div>
          </div>
          <div className="rounded-[34px] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur">
            <div className="overflow-hidden rounded-[28px] bg-white text-slate-900 shadow-xl">
              <img
                src="/images/hero-modulo-prefabricado-jardin.webp"
                alt="Módulo prefabricado con panel sándwich blanco instalado en jardín"
                className="h-[330px] w-full object-cover"
                fetchPriority="high"
              />
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-amber-700">Modelo más solicitado</p>
                    <p className="text-3xl font-black">6 x 2,40 m</p>
                  </div>
                  <span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-black text-brand-orange">desde 4.750 € sin IVA</span>
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-600">Precio orientativo sujeto a medidas finales, extras, transporte, montaje y revisión técnica.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-8">
        <div className="container-page grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Empresa registrada', `${company.name} · CIF ${company.cif}`],
            ['Atención directa', 'Presupuesto personalizado por teléfono o WhatsApp'],
            ['Fabricación a medida', 'Medidas, distribución y extras según necesidad del cliente'],
            ['Precio orientativo', 'La calculadora ayuda a preparar una solicitud más clara'],
          ].map(([title, description]) => (
            <div key={title} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <ShieldCheck className="mb-3 text-brand-green" />
              <h2 className="font-black text-slate-900">{title}</h2>
              <p className="mt-1 text-sm font-semibold text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="calculadora" className="bg-orange-50 py-14">
        <div className="container-page grid gap-6 lg:grid-cols-[1fr_430px] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-brand-orange">Calculadora de presupuesto</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">Configura tu módulo y envía el plano por WhatsApp</h2>
            <p className="mt-3 text-slate-700">El configurador genera un plano CAD 2D orientativo y ayuda a definir medidas, panel, ubicación y extras. El presupuesto final se confirma tras revisar transporte, montaje y detalles técnicos.</p>
            <div className="mt-5 grid gap-2 text-sm font-bold text-slate-700 sm:grid-cols-2">
              <span>✓ Medidas habituales de 3 a 8 metros</span>
              <span>✓ React-Konva como base del CAD</span>
              <span>✓ Puertas, ventanas, enchufes y baño</span>
              <span>✓ PDF y mensaje preparado para WhatsApp</span>
            </div>
            <Button onClick={onStart} className="mt-6"><Calculator size={18} /> Abrir configurador CAD</Button>
          </div>
          <Card className="border-4 border-slate-900">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-blue">Plano CAD profesional</p>
            <h3 className="mt-2 text-2xl font-black">Diseño 2D con simbología técnica</h3>
            <p className="mt-3 text-sm font-semibold text-slate-600">Grid, cotas, muros, símbolos arquitectónicos, selección, drag & drop, snapping, zoom, detección de solapes y exportación a PDF.</p>
          </Card>
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="text-center text-3xl font-black text-slate-900">Cómo trabajamos</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-4">
          {[
            ['Eliges medidas y uso', Ruler],
            ['Preparamos plano orientativo', Sparkles],
            ['Calculas precio estimado', Clock3],
            ['Confirmamos presupuesto final', FileText],
          ].map(([title, Icon], index) => {
            const I = Icon as typeof Ruler;
            return <Card key={String(title)} className="text-center"><div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-brand-orange"><I /></div><p className="mb-2 text-sm font-black text-brand-orange">Paso {index + 1}</p><h3 className="font-black text-slate-900">{String(title)}</h3></Card>;
          })}
        </div>
      </section>

      <section id="servicios" className="bg-white py-16">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-black text-slate-900 md:text-4xl">Tipos de casetas y módulos que fabricamos</h2>
            <p className="mt-3 text-slate-600">Soluciones a medida para particulares, empresas, obras, fincas y negocios.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {useCases.map(([title, description]) => <Card key={title}><CheckCircle2 className="mb-4 text-brand-green" /><h3 className="font-black text-slate-900">{title}</h3><p className="mt-2 text-sm text-slate-600">{description}</p></Card>)}
          </div>
        </div>
      </section>

      <section id="galeria" className="bg-slate-50 py-16">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-black text-brand-blue"><ImageIcon size={16} /> Galería de módulos prefabricados</span>
            <h2 className="mt-4 text-3xl font-black text-slate-900 md:text-4xl">Ejemplos de acabados exteriores e interiores</h2>
            <p className="mt-3 text-slate-600">Diferentes formatos de casetas y módulos con panel sándwich para fincas, obras, oficinas y espacios auxiliares.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((image) => (
              <Card key={image.src} className="overflow-hidden p-0">
                <img src={image.src} alt={image.alt} className="h-64 w-full object-cover" loading="lazy" />
                <div className="p-5">
                  <h3 className="font-black text-slate-900">{image.title}</h3>
                  <p className="mt-2 text-sm font-semibold text-slate-600">{image.description}</p>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-10 rounded-3xl bg-slate-950 p-6 text-white md:flex md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-black">¿Quieres un módulo parecido?</h3>
              <p className="mt-2 text-slate-300">Configura medidas, distribución y extras. Te preparamos presupuesto personalizado.</p>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row md:mt-0">
              <Button onClick={onStart}>Calcular mi módulo</Button>
              <a href={whatsappContactUrl} target="_blank" rel="noreferrer"><Button variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">WhatsApp</Button></a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-page">
          <h2 className="text-center text-3xl font-black text-slate-900">Ventajas de nuestros módulos prefabricados</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-5">
            {['Fabricación a medida', 'Panel sándwich blanco 30 mm', 'Otros grosores y colores bajo consulta', 'Presupuesto personalizado', 'Atención directa por WhatsApp'].map((item) => <div key={item} className="rounded-3xl border border-slate-200 p-5 text-center shadow-sm"><CheckCircle2 className="mx-auto mb-3 text-brand-green" /><p className="font-black text-slate-800">{item}</p></div>)}
          </div>
        </div>
      </section>

      <section id="modelos" className="container-page py-16">
        <h2 className="text-center text-3xl font-black text-slate-900">Modelos habituales</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">Medidas frecuentes para orientar el presupuesto. También podemos estudiar configuraciones especiales bajo consulta.</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {models.map(([title, measure, usage]) => <Card key={title} className="flex h-full flex-col gap-3"><p className="text-lg font-black text-slate-900">{title}</p><p className="font-black text-brand-blue">{measure}</p><p className="text-sm text-slate-600">{usage}</p></Card>)}
        </div>
      </section>

      <section id="contacto" className="bg-brand-navy py-12 text-white">
        <div className="container-page flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-300"><MapPin size={16} /> San José de la Rinconada · Sevilla</p>
            <h2 className="mt-2 text-2xl font-black">Solicita presupuesto para tu caseta prefabricada</h2>
            <p className="mt-2 text-slate-300">Llámanos o envíanos tu configuración por WhatsApp para confirmar medidas, extras, transporte y montaje.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a href={`tel:${company.phoneHref}`}><Button variant="outline" className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20 sm:w-auto"><Phone size={18} /> Llamar</Button></a>
            <Button onClick={onStart} className="w-full sm:w-auto">Calcular mi módulo</Button>
          </div>
        </div>
      </section>
    </main>

    <Footer onLegalPage={onLegalPage} onAdmin={onAdmin} />
  </div>
);

const Header = ({ onStart }: { onStart: () => void }) => (
  <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/90">
    <div className="hidden bg-slate-950 text-white lg:block">
      <div className="container-page flex h-10 items-center justify-between text-xs font-bold text-slate-300">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-2"><ShieldCheck size={15} className="text-brand-green" /> Empresa registrada · CIF {company.cif}</span>
          <span className="inline-flex items-center gap-2"><MapPin size={15} className="text-brand-orange" /> San José de la Rinconada, Sevilla</span>
        </div>
        <div className="flex items-center gap-4">
          <a href={`tel:${company.phoneHref}`} className="inline-flex items-center gap-2 transition hover:text-white"><Phone size={15} className="text-brand-orange" /> {company.phone}</a>
          <a href={`mailto:${company.email}`} className="inline-flex items-center gap-2 transition hover:text-white"><Mail size={15} className="text-brand-blue" /> {company.email}</a>
          <SocialLinks variant="dark" />
        </div>
      </div>
    </div>

    <div className="bg-white/95">
      <div className="container-page flex items-center justify-between gap-4 py-3">
        <a href="#inicio" aria-label="Volver al inicio" className="flex min-w-0 items-center rounded-2xl transition hover:opacity-90">
          <img src="/logo-sanjose-horizontal.svg" alt="Módulos Prefabricados San José" className="h-11 w-auto max-w-[210px] object-contain sm:h-12 sm:max-w-[260px] lg:h-14 lg:max-w-[320px]" />
        </a>

        <nav aria-label="Navegación principal" className="hidden items-center gap-1 rounded-full border border-slate-200 bg-slate-50/80 p-1 text-sm font-black text-slate-600 shadow-inner lg:flex">
          <button onClick={onStart} className="rounded-full px-4 py-2 transition hover:bg-white hover:text-brand-orange hover:shadow-sm">Calculadora</button>
          <a href="#servicios" className="rounded-full px-4 py-2 transition hover:bg-white hover:text-brand-orange hover:shadow-sm">Servicios</a>
          <a href="#galeria" className="rounded-full px-4 py-2 transition hover:bg-white hover:text-brand-orange hover:shadow-sm">Galería</a>
          <a href="#modelos" className="rounded-full px-4 py-2 transition hover:bg-white hover:text-brand-orange hover:shadow-sm">Modelos</a>
          <a href="#contacto" className="rounded-full px-4 py-2 transition hover:bg-white hover:text-brand-orange hover:shadow-sm">Contacto</a>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <button onClick={onStart} className="hidden items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800 xl:inline-flex"><Calculator size={17} /> Calcular</button>
          <a href={`tel:${company.phoneHref}`} className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 sm:inline-flex"><Phone size={17} /> Llamar</a>
          <a href={whatsappContactUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl bg-brand-green px-4 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-emerald-700"><MessageCircle size={17} /> <span className="hidden sm:inline">WhatsApp</span></a>
        </div>
      </div>

      <nav aria-label="Navegación móvil" className="border-t border-slate-100 lg:hidden">
        <div className="container-page flex gap-2 overflow-x-auto py-2 text-xs font-black text-slate-600">
          <button onClick={onStart} className="whitespace-nowrap rounded-full bg-slate-950 px-3 py-2 text-white">Calculadora</button>
          <a href="#servicios" className="whitespace-nowrap rounded-full bg-slate-100 px-3 py-2">Servicios</a>
          <a href="#galeria" className="whitespace-nowrap rounded-full bg-slate-100 px-3 py-2">Galería</a>
          <a href="#modelos" className="whitespace-nowrap rounded-full bg-slate-100 px-3 py-2">Modelos</a>
          <a href="#contacto" className="whitespace-nowrap rounded-full bg-slate-100 px-3 py-2">Contacto</a>
        </div>
      </nav>
    </div>
  </header>
);

const Footer = ({ onLegalPage, onAdmin }: { onLegalPage: (page: 'aviso-legal' | 'privacidad' | 'cookies') => void; onAdmin: () => void }) => (
  <footer className="relative overflow-hidden bg-slate-950 text-white">
    <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 12% 18%, rgba(249,115,22,.22), transparent 28%), radial-gradient(circle at 88% 10%, rgba(29,78,216,.28), transparent 30%)' }} />

    <div className="container-page relative pt-12">
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-brand-navy to-slate-950 p-6 shadow-2xl shadow-slate-950/40 md:p-8 lg:grid lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-orange-200"><Sparkles size={15} /> Proyecto a medida</span>
          <h2 className="mt-4 max-w-3xl text-3xl font-black tracking-tight sm:text-4xl">¿Listo para diseñar tu módulo prefabricado?</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">Te ayudamos a definir medidas, distribución, extras, transporte y montaje para preparar un presupuesto claro y profesional.</p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-black text-slate-200">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Panel sándwich</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Plano CAD 2D</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Sevilla y Andalucía</span>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:mt-0">
          <button onClick={onStart} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 font-black text-slate-950 shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-slate-100"><Calculator size={18} /> Calcular precio</button>
          <a href={whatsappContactUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-green px-5 py-4 font-black text-white shadow-xl shadow-emerald-950/20 transition hover:-translate-y-0.5 hover:bg-emerald-700"><MessageCircle size={18} /> WhatsApp</a>
          <a href={`tel:${company.phoneHref}`} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 font-black text-white transition hover:bg-white/15 sm:col-span-2"><Phone size={18} /> Llamar a {company.phone}</a>
        </div>
      </div>
    </div>

    <div className="container-page relative grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.85fr_1fr_0.85fr]">
      <div className="min-w-0">
        <div className="inline-flex rounded-3xl border border-white/10 bg-white p-3 shadow-2xl shadow-black/20">
          <img src="/logo-sanjose-horizontal.svg" alt="Módulos Prefabricados San José" className="h-12 w-auto max-w-[260px] object-contain" />
        </div>
        <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">{company.activity}. Fabricamos casetas y módulos con panel sándwich para uso profesional y particular, con orientación técnica y presupuesto revisado según cada proyecto.</p>
        <div className="mt-5 grid gap-2 text-xs font-black text-slate-300 sm:max-w-md sm:grid-cols-2">
          <span className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">CIF {company.cif}</span>
          <span className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">Empresa en Sevilla</span>
        </div>
        <div className="mt-5">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500">Síguenos</p>
          <SocialLinks variant="dark" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">Servicios</h3>
        <div className="mt-4 space-y-3 text-sm font-semibold text-slate-300">
          <a href="#servicios" className="block transition hover:text-white">Casetas para fincas</a>
          <a href="#servicios" className="block transition hover:text-white">Módulos oficina</a>
          <a href="#servicios" className="block transition hover:text-white">Casetas de obra</a>
          <a href="#servicios" className="block transition hover:text-white">Vestuarios y almacenes</a>
          <button onClick={onStart} className="block text-left text-brand-orange transition hover:text-orange-300">Configurador CAD 2D</button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">Contacto directo</h3>
        <div className="mt-4 space-y-4 text-sm text-slate-300">
          <a href={`tel:${company.phoneHref}`} className="flex items-center gap-3 transition hover:text-white"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-brand-orange"><Phone size={17} /></span>{company.phone}</a>
          <a href={whatsappContactUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 transition hover:text-white"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-brand-green"><MessageCircle size={17} /></span>WhatsApp directo</a>
          <a href={`mailto:${company.email}`} className="flex min-w-0 items-center gap-3 transition hover:text-white"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-brand-blue"><Mail size={17} /></span><span className="break-all">{company.email}</span></a>
          <p className="flex items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-brand-orange"><MapPin size={17} /></span><span>{company.address}</span></p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">Legal y empresa</h3>
        <div className="mt-4 space-y-3 text-left text-sm font-semibold text-slate-300">
          <p className="flex items-start gap-3"><Building2 size={17} className="mt-0.5 shrink-0 text-brand-orange" /> <span>{company.name}</span></p>
          <p className="flex items-start gap-3"><ShieldCheck size={17} className="mt-0.5 shrink-0 text-brand-green" /> <span>Presupuestos sujetos a revisión técnica, transporte y montaje.</span></p>
          <button onClick={() => onLegalPage('aviso-legal')} className="block transition hover:text-white">Aviso legal</button>
          <button onClick={() => onLegalPage('privacidad')} className="block transition hover:text-white">Política de privacidad</button>
          <button onClick={() => onLegalPage('cookies')} className="block transition hover:text-white">Política de cookies</button>
          <button onClick={onAdmin} className="block pt-2 text-slate-500 transition hover:text-white">Panel privado</button>
        </div>
      </div>
    </div>

    <div className="relative border-t border-white/10">
      <div className="container-page flex flex-col gap-2 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {company.name}. Todos los derechos reservados.</p>
        <p>Diseño, fabricación y presupuesto orientativo de módulos prefabricados.</p>
      </div>
    </div>
  </footer>
);
