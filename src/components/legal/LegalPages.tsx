import type { ReactNode } from 'react';
import { ArrowLeft, Cookie, FileText, ShieldCheck } from 'lucide-react';
import { company } from '../../config/company';
import { Button, Card } from '../ui/Ui';

export type LegalPageType = 'aviso-legal' | 'privacidad' | 'cookies' | 'condiciones';

const lastUpdated = '15 de mayo de 2026';

const pageConfig: Record<LegalPageType, { title: string; icon: typeof FileText; intro: string }> = {
  'aviso-legal': {
    title: 'Aviso legal',
    icon: FileText,
    intro: 'Información general del titular de esta web, condiciones básicas de uso y alcance de la información publicada.',
  },
  privacidad: {
    title: 'Política de privacidad',
    icon: ShieldCheck,
    intro: 'Información sobre cómo tratamos los datos enviados por formularios, WhatsApp, teléfono, email, configurador o asistente web.',
  },
  cookies: {
    title: 'Política de cookies',
    icon: Cookie,
    intro: 'Información sobre cookies técnicas, almacenamiento local y posibles herramientas de analítica o marketing si se activan en el futuro.',
  },
  condiciones: {
    title: 'Condiciones de venta',
    icon: FileText,
    intro: 'Condiciones comerciales orientativas sobre presupuestos, transporte, accesos, instalación, pagos, garantías y responsabilidad del cliente.',
  },
};

const legalPages = ['aviso-legal', 'privacidad', 'cookies', 'condiciones'] as const;

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <h2 className="text-xl font-black text-slate-900">{title}</h2>
    <div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">{children}</div>
  </section>
);

const LegalList = ({ children }: { children: ReactNode }) => <ul className="list-disc space-y-2 pl-5">{children}</ul>;

export const LegalPages = ({ page, onBack, onNavigate }: { page: LegalPageType; onBack: () => void; onNavigate: (page: LegalPageType) => void }) => {
  const config = pageConfig[page];
  const Icon = config.icon;
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="ghost" onClick={onBack}><ArrowLeft size={18} /> Volver</Button>
          <div className="flex flex-wrap gap-2">
            {legalPages.map((p) => <button key={p} onClick={() => onNavigate(p)} className={`rounded-full px-4 py-2 text-sm font-black ${page === p ? 'bg-brand-orange text-white' : 'bg-white text-slate-700 ring-1 ring-slate-200'}`}>{pageConfig[p].title}</button>)}
          </div>
        </div>
        <Card className="mb-6 overflow-hidden bg-slate-950 text-white">
          <div className="flex flex-col gap-5 md:flex-row md:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-orange text-white"><Icon size={28} /></div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-300">Información legal</p>
              <h1 className="mt-2 text-3xl font-black md:text-4xl">{config.title}</h1>
              <p className="mt-3 max-w-3xl text-slate-300">{config.intro}</p>
              <p className="mt-3 text-xs font-bold text-slate-400">Última actualización: {lastUpdated}</p>
            </div>
          </div>
        </Card>
        {page === 'aviso-legal' && <AvisoLegal />}
        {page === 'privacidad' && <Privacidad />}
        {page === 'cookies' && <Cookies />}
        {page === 'condiciones' && <CondicionesVenta />}
        <p className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">Estos textos son una base informativa adaptada al funcionamiento de la web y al tipo de servicio ofrecido. Conviene revisarlos con un profesional especializado antes de utilizarlos como documentación legal definitiva.</p>
      </div>
    </div>
  );
};

const AvisoLegal = () => (
  <div className="space-y-5">
    <Section title="Titular de la web">
      <div className="grid gap-3 sm:grid-cols-2">
        <p><strong>Empresa:</strong> {company.name}</p>
        <p><strong>CIF:</strong> {company.cif}</p>
        <p><strong>Teléfono:</strong> {company.phone}</p>
        <p><strong>Email:</strong> {company.email}</p>
        <p className="sm:col-span-2"><strong>Domicilio social:</strong> {company.address}</p>
        <p className="sm:col-span-2"><strong>Actividad:</strong> {company.activity}</p>
      </div>
    </Section>

    <Section title="Objeto de la web">
      <p>Esta web ofrece información comercial sobre casetas y módulos prefabricados con panel sándwich, permite configurar un módulo de forma orientativa y facilita el contacto para solicitar presupuesto personalizado.</p>
      <p>La información publicada tiene carácter informativo y comercial. No constituye una oferta contractual cerrada hasta que se emita un presupuesto formal y sea aceptado por las partes.</p>
    </Section>

    <Section title="Presupuestos, configurador y asistente web">
      <p>Los precios, planos, medidas, resultados del configurador y respuestas del asistente web son orientativos. El presupuesto final queda sujeto a revisión técnica, disponibilidad de materiales, extras solicitados, transporte, montaje, accesos y condiciones concretas del pedido.</p>
      <p>El asistente web funciona con información predefinida sobre los productos y servicios de la empresa. No sustituye la revisión técnica ni la confirmación final del presupuesto.</p>
    </Section>

    <Section title="Condiciones de uso de la web">
      <p>El usuario se compromete a utilizar la web de forma lícita, correcta y respetuosa. No está permitido usar formularios, configurador, enlaces de contacto o cualquier funcionalidad de la web para enviar información falsa, abusiva, automatizada o que pueda perjudicar el funcionamiento del servicio.</p>
      <p>El usuario es responsable de la veracidad de los datos, medidas, fotografías, vídeos, condiciones de acceso y demás información que facilite para preparar un presupuesto.</p>
    </Section>

    <Section title="Transporte, accesos y viabilidad de entrega">
      <p>La viabilidad de entrega e instalación depende de las condiciones reales del lugar. Antes de confirmar un pedido, el cliente debe revisar si el módulo puede acceder a la calle, parcela o zona de instalación.</p>
      <LegalList>
        <li>Comprobar anchura de calle, entrada, portones y caminos.</li>
        <li>Verificar permisos, espacio de maniobra, pendientes, árboles, cables, farolas, fachadas u otros obstáculos.</li>
        <li>Informar de cualquier dificultad que pueda afectar al transporte, descarga, grúa o colocación.</li>
        <li>Aportar imágenes o vídeos del acceso y zona de instalación cuando sea posible.</li>
      </LegalList>
    </Section>

    <Section title="Propiedad intelectual e industrial">
      <p>Los textos, imágenes, diseños, código, logotipos, planos, simulaciones, configuraciones y elementos visuales de esta web pertenecen a {company.name} o se utilizan con autorización/licencia correspondiente.</p>
      <p>No está permitida su reproducción, distribución, transformación o uso comercial sin autorización expresa, salvo en los casos legalmente permitidos.</p>
    </Section>

    <Section title="Responsabilidad">
      <p>{company.name} no se responsabiliza de errores derivados de información incompleta o incorrecta facilitada por el usuario, ni de incidencias ajenas a la empresa relacionadas con transporte externo, permisos, accesos, condiciones del terreno o maniobras no comunicadas previamente.</p>
      <p>La empresa podrá actualizar, modificar o retirar contenidos de la web cuando sea necesario para mejorar la información, corregir errores o adaptar los servicios.</p>
    </Section>
  </div>
);

const Privacidad = () => (
  <div className="space-y-5">
    <Section title="Responsable del tratamiento">
      <p><strong>{company.name}</strong>, con CIF {company.cif}, es responsable del tratamiento de los datos personales enviados a través de esta web, teléfono, email, WhatsApp, configurador o asistente web.</p>
      <p><strong>Contacto:</strong> {company.email} · {company.phone}</p>
      <p><strong>Domicilio:</strong> {company.address}</p>
    </Section>

    <Section title="Datos que podemos tratar">
      <LegalList>
        <li>Datos identificativos y de contacto: nombre, teléfono, email y datos similares.</li>
        <li>Datos del proyecto: uso previsto del módulo, medidas, distribución, extras, materiales, comentarios y preferencias.</li>
        <li>Datos de ubicación o instalación: localidad, provincia, dirección o zona de instalación si el cliente la facilita.</li>
        <li>Información sobre accesos: anchura de calle, entrada a parcela, permisos, obstáculos, cables, maniobras, grúa o transporte.</li>
        <li>Imágenes o vídeos del lugar de instalación cuando el cliente los envía voluntariamente para valorar la viabilidad.</li>
        <li>Comunicaciones mantenidas por email, teléfono, WhatsApp, formularios, configurador o asistente web.</li>
        <li>Datos técnicos mínimos de navegación, especialmente cuando sean necesarios para seguridad, funcionamiento o consentimiento de cookies.</li>
      </LegalList>
    </Section>

    <Section title="Finalidades del tratamiento">
      <LegalList>
        <li>Atender solicitudes de información y contacto.</li>
        <li>Preparar presupuestos personalizados sobre casetas o módulos prefabricados.</li>
        <li>Valorar medidas, distribución, extras, transporte, accesos, maniobras e instalación.</li>
        <li>Enviar información comercial solicitada por el usuario.</li>
        <li>Gestionar comunicaciones por WhatsApp, teléfono, email o medios similares.</li>
        <li>Gestionar pedidos, facturación, garantías, incidencias y obligaciones administrativas si finalmente existe contratación.</li>
        <li>Mejorar la seguridad y funcionamiento de la web.</li>
      </LegalList>
    </Section>

    <Section title="Base jurídica">
      <p>El tratamiento puede basarse en el consentimiento del usuario al enviar una consulta, en la aplicación de medidas precontractuales solicitadas por el interesado, en la ejecución de un contrato si se confirma un pedido, en el cumplimiento de obligaciones legales y, cuando proceda, en el interés legítimo de responder consultas y conservar comunicaciones necesarias para la relación comercial.</p>
      <p>El envío de comunicaciones comerciales no solicitadas solo se realizará cuando exista base legal suficiente o consentimiento del usuario.</p>
    </Section>

    <Section title="Destinatarios y encargados de tratamiento">
      <p>Con carácter general, no vendemos ni cedemos datos personales a terceros. No obstante, pueden acceder a determinados datos proveedores necesarios para prestar el servicio o gestionar la actividad:</p>
      <LegalList>
        <li>Proveedores de hosting, mantenimiento web, correo electrónico o herramientas técnicas.</li>
        <li>Servicios de mensajería o comunicación utilizados por el usuario, como WhatsApp, cuando el cliente decide contactar por ese medio.</li>
        <li>Asesoría, gestoría o administración cuando sea necesario para facturación, contabilidad u obligaciones legales.</li>
        <li>Transportistas o colaboradores de confianza cuando el cliente solicite ayuda para coordinar transporte o entrega.</li>
        <li>Administraciones públicas, juzgados u organismos competentes cuando exista obligación legal.</li>
      </LegalList>
    </Section>

    <Section title="Conservación de los datos">
      <p>Los datos de consultas y presupuestos se conservarán durante el tiempo necesario para atender la solicitud, realizar seguimiento comercial razonable y gestionar posibles comunicaciones posteriores.</p>
      <p>Los datos asociados a pedidos, facturas, garantías o incidencias podrán conservarse durante los plazos legales aplicables. Las imágenes o vídeos del lugar de instalación se conservarán solo mientras sean necesarios para valorar la viabilidad o documentar el proyecto.</p>
    </Section>

    <Section title="Derechos del usuario">
      <p>El usuario puede solicitar el acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad de sus datos escribiendo a {company.email}. También puede retirar su consentimiento cuando el tratamiento se base en él.</p>
      <p>Si considera que sus derechos no han sido atendidos correctamente, puede presentar una reclamación ante la autoridad de control competente en materia de protección de datos.</p>
    </Section>

    <Section title="Uso de WhatsApp, fotografías y vídeos">
      <p>Cuando el usuario contacta por WhatsApp o envía fotografías/vídeos, lo hace de forma voluntaria para facilitar la preparación del presupuesto o la revisión del acceso. Se recomienda evitar enviar datos personales innecesarios de terceros, matrículas, documentos o información sensible.</p>
      <p>Las comunicaciones realizadas a través de plataformas de terceros se rigen también por las condiciones y políticas de privacidad de dichas plataformas.</p>
    </Section>
  </div>
);

const Cookies = () => (
  <div className="space-y-5">
    <Section title="Qué son las cookies y tecnologías similares">
      <p>Las cookies son pequeños archivos que se guardan en el navegador para recordar información técnica, preferencias o ajustes de navegación. También pueden utilizarse tecnologías similares, como almacenamiento local del navegador.</p>
    </Section>

    <Section title="Cookies y almacenamiento utilizados en esta web">
      <LegalList>
        <li><strong>Cookies técnicas o necesarias:</strong> permiten el funcionamiento básico de la web y no requieren consentimiento cuando son imprescindibles.</li>
        <li><strong>Almacenamiento de preferencias:</strong> se utiliza para recordar la decisión del usuario sobre el banner de cookies.</li>
        <li><strong>Analítica:</strong> solo debería activarse si se instala una herramienta para medir visitas y el usuario la acepta o configura.</li>
        <li><strong>Marketing:</strong> solo debería activarse si en el futuro se instalan píxeles publicitarios, remarketing o herramientas similares y el usuario lo consiente.</li>
      </LegalList>
    </Section>

    <Section title="Tabla orientativa de uso">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-900">
              <th className="py-2 pr-4 font-black">Tipo</th>
              <th className="py-2 pr-4 font-black">Finalidad</th>
              <th className="py-2 pr-4 font-black">Titular</th>
              <th className="py-2 pr-4 font-black">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr><td className="py-2 pr-4">Técnicas</td><td className="py-2 pr-4">Funcionamiento básico de la web</td><td className="py-2 pr-4">Propia</td><td className="py-2 pr-4">Necesarias</td></tr>
            <tr><td className="py-2 pr-4">Preferencias</td><td className="py-2 pr-4">Recordar consentimiento del banner</td><td className="py-2 pr-4">Propia</td><td className="py-2 pr-4">Según elección</td></tr>
            <tr><td className="py-2 pr-4">Analítica</td><td className="py-2 pr-4">Medición de visitas, si se instala</td><td className="py-2 pr-4">Propia o terceros</td><td className="py-2 pr-4">Solo con consentimiento</td></tr>
            <tr><td className="py-2 pr-4">Marketing</td><td className="py-2 pr-4">Campañas o píxeles, si se instalan</td><td className="py-2 pr-4">Terceros</td><td className="py-2 pr-4">Solo con consentimiento</td></tr>
          </tbody>
        </table>
      </div>
    </Section>

    <Section title="Gestión del consentimiento">
      <p>Al entrar en la web se muestra un banner desde el que el usuario puede aceptar, rechazar o configurar las cookies no necesarias. Actualmente el banner guarda la preferencia del usuario en el navegador mediante almacenamiento local.</p>
      <p>El usuario puede modificar su elección eliminando los datos del sitio desde la configuración de su navegador o utilizando las opciones del banner cuando vuelva a mostrarse.</p>
    </Section>

    <Section title="Cookies de terceros">
      <p>Si en el futuro se instalan herramientas externas como analítica web, píxeles publicitarios, mapas, vídeos embebidos, chat externo u otros servicios, podrán generarse cookies de terceros. En ese caso, esta política deberá actualizarse con la información concreta de cada proveedor.</p>
    </Section>
  </div>
);

const CondicionesVenta = () => (
  <div className="space-y-5">
    <Section title="Carácter de estas condiciones">
      <p>Estas condiciones resumen aspectos comerciales habituales de {company.name} para la fabricación y venta de casetas y módulos prefabricados con panel sándwich. No sustituyen el presupuesto, contrato, factura proforma o documento específico que pueda emitirse para cada pedido.</p>
      <p>En caso de contradicción, prevalecerán las condiciones particulares aceptadas por escrito para cada presupuesto o pedido concreto.</p>
    </Section>

    <Section title="Presupuestos y precios orientativos">
      <p>Los precios mostrados en la web, configurador, asistente o comunicaciones iniciales son orientativos. El presupuesto final puede variar según medidas, materiales, grosor del panel, distribución, extras, transporte, montaje, acceso, disponibilidad y revisión técnica.</p>
      <p>El modelo 6 x 2,40 m puede mostrarse como referencia desde 4.750 € sin IVA, pero la cifra no debe entenderse como precio final para todos los casos.</p>
    </Section>

    <Section title="Baño completo y extras">
      <p>El baño completo suele suponer aproximadamente 1.500 € adicionales, aunque el importe puede variar según la configuración, distribución, materiales, instalación y si incluye placa de ducha o no.</p>
      <LegalList>
        <li>Los extras como puertas, ventanas, electricidad, aire acondicionado, baño, ducha u otros elementos se presupuestan según necesidad.</li>
        <li>Cualquier modificación posterior al presupuesto puede cambiar el precio y plazo estimado.</li>
        <li>Algunos acabados, colores o grosores de panel pueden requerir consulta previa de disponibilidad.</li>
      </LegalList>
    </Section>

    <Section title="Transporte">
      <p>El transporte no está incluido salvo que se indique expresamente en el presupuesto. El transporte no depende directamente de {company.name} cuando se realiza mediante terceros.</p>
      <LegalList>
        <li>El cliente puede buscar su propio transportista.</li>
        <li>El cliente puede solicitar opciones de transportistas de confianza.</li>
        <li>El coste dependerá de distancia, dimensiones del módulo, necesidad de grúa, accesos, maniobras y condiciones reales del lugar.</li>
        <li>La coordinación de transporte deberá confirmarse antes de la entrega.</li>
      </LegalList>
    </Section>

    <Section title="Acceso, permisos y maniobras">
      <p>Antes de confirmar el pedido, el cliente debe verificar que el módulo puede acceder hasta la parcela, calle o lugar de instalación. Esta comprobación es esencial para evitar incidencias el día de la entrega.</p>
      <LegalList>
        <li>Comprobar anchura de la calle, carriles, caminos, curvas, portones y entrada a parcela.</li>
        <li>Revisar si existen cables, árboles, balcones, farolas, pendientes, bordillos, muros, vehículos u otros obstáculos.</li>
        <li>Confirmar permisos municipales, autorizaciones de corte de calle, ocupación de vía pública o entrada de grúa si fueran necesarios.</li>
        <li>Verificar espacio suficiente para maniobras de camión, grúa o descarga.</li>
        <li>Informar previamente de cualquier limitación del terreno o del acceso.</li>
      </LegalList>
    </Section>

    <Section title="Fotos y vídeos del lugar">
      <p>Para valorar mejor la viabilidad de transporte, descarga e instalación, se recomienda enviar imágenes o vídeos actualizados del acceso, calle, entrada a parcela y zona donde se colocará el módulo.</p>
      <p>El envío de este material ayuda a detectar posibles obstáculos, pero no sustituye una revisión técnica o visita presencial cuando sea necesaria.</p>
    </Section>

    <Section title="Confirmación de pedido, anticipos y fabricación">
      <p>La fabricación o reserva de materiales podrá requerir la aceptación del presupuesto y, en su caso, el pago de un anticipo. Las condiciones concretas de pago, plazos y entrega deberán figurar en el presupuesto o acuerdo correspondiente.</p>
      <p>Los plazos son estimados y pueden verse afectados por disponibilidad de materiales, carga de trabajo, transporte, condiciones meteorológicas, incidencias técnicas o modificaciones solicitadas por el cliente.</p>
    </Section>

    <Section title="Cambios, cancelaciones e incidencias">
      <p>Los cambios solicitados después de aceptar un presupuesto deberán ser revisados y pueden implicar variación de precio, plazo o viabilidad técnica. Si el pedido ya está en fabricación o los materiales han sido preparados, la cancelación podrá estar limitada por los costes generados.</p>
      <p>Las incidencias derivadas de accesos no comunicados, permisos no gestionados, obstáculos o información incorrecta del cliente podrán generar costes adicionales.</p>
    </Section>

    <Section title="Garantía y uso adecuado">
      <p>La garantía se aplicará conforme a la normativa vigente y a las condiciones concretas entregadas con cada presupuesto o factura. Quedan fuera, con carácter general, daños por mal uso, modificaciones no autorizadas, falta de mantenimiento, golpes, manipulación por terceros, transporte externo no coordinado o instalación en condiciones inadecuadas no comunicadas.</p>
      <p>El cliente debe revisar el módulo en la entrega y comunicar cualquier incidencia lo antes posible, aportando fotografías y descripción del problema.</p>
    </Section>
  </div>
);
