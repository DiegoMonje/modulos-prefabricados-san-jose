import { useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type Konva from 'konva';
import { ArrowLeft, ArrowRight, CheckCircle2, Download, MessageCircle } from 'lucide-react';
import type { ContactFormState, DeliveryTimeline, LayoutItem, PanelChoice, UseType } from '../../types';
import { calculatePrice, formatCurrency } from '../../utils/pricing';
import { buildWhatsAppUrl } from '../../utils/whatsapp';
import { downloadConfiguratorPdf } from '../../utils/pdf';
import { createLead } from '../../services/leads';
import { Button, Card, Field, Input, Select, Textarea } from '../ui/Ui';
import { CadStage } from './cad/CadStage';
import { CadToolbar } from './cad/CadToolbar';
import { exportStageAsPng } from './cad/utils/exportStage';
import { useConfiguratorStore } from './store/useConfiguratorStore';

const panelChoices: PanelChoice[] = ['Panel sándwich blanco 30 mm', 'Otro grosor de panel', 'Otro color de panel', 'Otro grosor y otro color'];
const uses: UseType[] = ['Caseta de obra', 'Oficina', 'Almacén', 'Vestuario', 'Caseta para finca', 'Local comercial', 'Otro'];
const timelines: DeliveryTimeline[] = ['Lo antes posible', 'En menos de 1 mes', 'En 1-3 meses', 'Más adelante', 'Solo estoy mirando precios'];
const MIN_CUSTOM_WIDTH = 2;
const MAX_CUSTOM_WIDTH = 3.5;

const parseNumberInput = (value: string) => Number(value.replace(',', '.'));
const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const StepShell = ({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) => (
  <div>
    <h2 className="text-2xl font-black text-slate-900">{title}</h2>
    {subtitle ? <p className="mt-2 text-slate-600">{subtitle}</p> : null}
    <div className="mt-6">{children}</div>
  </div>
);

export const ConfiguratorPage = ({ onBack }: { onBack: () => void }) => {
  const stageRef = useRef<Konva.Stage>(null);
  const [step, setStep] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [stepError, setStepError] = useState('');
  const [cadImage, setCadImage] = useState<string | null>(null);
  const store = useConfiguratorStore();
  const { config, selectedItemId } = store;
  const price = useMemo(() => calculatePrice(config), [config]);
  const totalSteps = 7;

  const next = () => setStep((prev) => Math.min(totalSteps, prev + 1));
  const prev = () => {
    setStepError('');
    setStep((previous) => Math.max(1, previous - 1));
  };

  const captureCadImage = () => {
    const image = exportStageAsPng(stageRef.current);
    if (image) setCadImage(image);
    return image;
  };

  const validateCurrentStep = () => {
    if (step === 1 && config.widthOption === 'Otro ancho') {
      const customWidth = parseNumberInput(config.customWidth);
      if (!config.customWidth.trim() || Number.isNaN(customWidth)) {
        return 'Introduce un ancho válido en metros. Ejemplo: 2.60';
      }
      if (customWidth < MIN_CUSTOM_WIDTH || customWidth > MAX_CUSTOM_WIDTH) {
        return `Introduce un ancho entre ${MIN_CUSTOM_WIDTH.toLocaleString('es-ES')} m y ${MAX_CUSTOM_WIDTH.toLocaleString('es-ES')} m. Para medidas superiores, consúltanos.`;
      }
    }
    if (step === 2) {
      if ((config.panelChoice === 'Otro grosor de panel' || config.panelChoice === 'Otro grosor y otro color') && !config.specialThickness.trim()) return 'Indica el grosor deseado del panel.';
      if ((config.panelChoice === 'Otro color de panel' || config.panelChoice === 'Otro grosor y otro color') && !config.specialColor.trim()) return 'Indica el color deseado del panel.';
    }
    if (step === 5) {
      if (!config.province.trim()) return 'Indica la provincia de instalación.';
      if (!config.city.trim()) return 'Indica la localidad de instalación.';
    }
    return '';
  };

  const continueStep = () => {
    const validationError = validateCurrentStep();
    if (validationError) {
      setStepError(validationError);
      return;
    }

    setStepError('');
    if (step === 4) captureCadImage();
    next();
  };

  if (submitted) {
    const contact = sessionStorage.getItem('last_contact') ? JSON.parse(sessionStorage.getItem('last_contact')!) as ContactFormState : { fullName: '', phone: '', email: '', intendedUse: '', comments: '', accepted: true, newsletterSubscribed: false };
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <Card className="text-center">
            <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-brand-green" />
            <h1 className="text-3xl font-black text-slate-900">Tu plano y presupuesto se han generado correctamente</h1>
            <p className="mt-3 text-slate-600">Puedes enviarnos la configuración por WhatsApp para recibir atención personalizada.</p>
            <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl bg-slate-50 p-5 text-left">
                <h2 className="mb-3 font-black text-slate-900">Resumen</h2>
                <p><strong>Medidas:</strong> {config.length} x {config.width} m ({price.squareMeters} m²)</p>
                <p><strong>Panel:</strong> {config.panelType}, {config.panelThickness}, color {config.panelColor}</p>
                <p><strong>Incluido:</strong> {price.summary.includedList.join(', ')}</p>
                <p><strong>Extras:</strong> {price.summary.extrasList.length ? price.summary.extrasList.join(', ') : 'Sin extras añadidos'}</p>
                <p><strong>Precio sin IVA:</strong> {formatCurrency(price.estimatedPriceWithoutVat)}</p>
                <p><strong>Total con IVA:</strong> {formatCurrency(price.estimatedPriceWithVat)}</p>
              </div>
              <div className="rounded-2xl bg-orange-50 p-5 text-left">
                <p className="text-sm font-black uppercase tracking-wide text-brand-orange">Siguiente paso</p>
                <p className="mt-2 text-2xl font-black text-slate-900">Solicitar revisión técnica</p>
                <p className="mt-2 text-sm text-slate-700">El precio mostrado es orientativo. Confirmaremos transporte, montaje, accesos y detalles finales.</p>
              </div>
            </div>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <a href={buildWhatsAppUrl(contact, config, price)} target="_blank" rel="noreferrer"><Button><MessageCircle size={18} /> Abrir WhatsApp</Button></a>
              <Button variant="outline" onClick={onBack}>Volver al inicio</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}><ArrowLeft size={18} /> Inicio</Button>
          <div className="rounded-full bg-white px-4 py-2 text-sm font-black text-slate-600 shadow-sm">Paso {step} de {totalSteps}</div>
        </div>

        <div className="mb-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-orange">Configurador CAD 2D</p>
          <h1 className="mt-2 text-3xl font-black text-slate-900 md:text-4xl">Diseña tu módulo prefabricado</h1>
          <p className="mt-3 max-w-3xl text-slate-600">Configura medidas, panel, uso, plano CAD, ubicación y datos de contacto. Recibe un precio orientativo y genera PDF.</p>
          <div className="mt-5 h-3 rounded-full bg-slate-200"><div className="h-3 rounded-full bg-brand-orange transition-all" style={{ width: `${(step / totalSteps) * 100}%` }} /></div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <Card>
            {step === 1 && <MeasuresStep />}
            {step === 2 && <PanelStep />}
            {step === 3 && <UseStep />}
            {step === 4 && (
              <StepShell title="Plano CAD 2D profesional" subtitle="Añade, selecciona y arrastra elementos sobre el módulo. Puertas y ventanas se ajustan a muros exteriores.">
                <div className="grid gap-5 xl:grid-cols-[1fr_330px]">
                  <CadStage
                    ref={stageRef}
                    length={config.length}
                    width={config.width}
                    items={config.layoutItems}
                    selectedItemId={selectedItemId}
                    zoom={zoom}
                    onSelect={store.selectItem}
                    onMove={store.moveItem}
                  />
                  <CadToolbar
                    onAdd={store.addItem}
                    onUndo={store.undo}
                    onRedo={store.redo}
                    onDelete={store.removeSelected}
                    onZoomIn={() => setZoom((z) => Math.min(1.6, Number((z + 0.1).toFixed(2))))}
                    onZoomOut={() => setZoom((z) => Math.max(0.75, Number((z - 0.1).toFixed(2))))}
                    onCenter={() => setZoom(1)}
                  />
                </div>
                <SelectedItemPanel item={config.layoutItems.find((i) => i.id === selectedItemId) || null} />
              </StepShell>
            )}
            {step === 5 && <LocationStep />}
            {step === 6 && <SummaryStep price={price} />}
            {step === 7 && (
              <ContactStep
                onSubmit={async (contact) => {
                  setSubmitError('');
                  const currentCadImage = cadImage ?? captureCadImage();

                  try {
                    downloadConfiguratorPdf({ contact, config, price, cadImage: currentCadImage });
                    sessionStorage.setItem('last_contact', JSON.stringify(contact));
                    setSubmitted(true);
                  } catch (error) {
                    setSubmitError(error instanceof Error ? error.message : 'No se pudo generar el PDF en este navegador.');
                    return;
                  }

                  try {
                    await createLead({ contact, config, price });
                  } catch (error) {
                    console.warn('La solicitud no se pudo guardar, pero el PDF se generó correctamente.', error);
                  }
                }}
                error={submitError}
              />
            )}

            {stepError ? <p className="mt-6 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{stepError}</p> : null}

            <div className="mt-8 flex flex-col justify-between gap-3 border-t border-slate-200 pt-5 sm:flex-row">
              <Button variant="outline" onClick={prev} disabled={step === 1}><ArrowLeft size={18} /> Anterior</Button>
              {step < totalSteps ? <Button onClick={continueStep}>Continuar <ArrowRight size={18} /></Button> : null}
            </div>
          </Card>

          <aside className="space-y-5">
            <Card>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-orange">Precio estimado</p>
              <p className="mt-2 text-4xl font-black text-slate-900">{formatCurrency(price.estimatedPriceWithoutVat)}</p>
              <p className="text-sm font-bold text-slate-500">sin IVA</p>
              <div className="mt-4 space-y-2 text-sm text-slate-700">
                <p><strong>Base:</strong> {formatCurrency(price.basePrice)}</p>
                <p><strong>Extras:</strong> {formatCurrency(price.extrasPrice)}</p>
                <p><strong>IVA 21%:</strong> {formatCurrency(price.vatAmount)}</p>
                <p className="text-lg font-black text-brand-orange"><strong>Total:</strong> {formatCurrency(price.estimatedPriceWithVat)}</p>
              </div>
              <p className="mt-4 rounded-2xl bg-amber-50 p-3 text-xs font-semibold leading-5 text-amber-900">Precio orientativo sujeto a revisión técnica, transporte, montaje, accesos y disponibilidad de materiales.</p>
            </Card>
            <Card>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-blue">Configuración</p>
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                <p><strong>Medidas:</strong> {config.length} x {config.width} m</p>
                <p><strong>m²:</strong> {price.squareMeters}</p>
                <p><strong>Panel:</strong> {config.panelThickness} · {config.panelColor}</p>
                <p><strong>Uso:</strong> {config.useType}</p>
                <p><strong>Extras:</strong> {price.summary.extrasList.length || 'Sin extras'}</p>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
};

const MeasuresStep = () => {
  const { config, setMeasure } = useConfiguratorStore();
  const setCustomWidth = (value: string) => {
    const parsed = parseNumberInput(value);
    const nextWidth = Number.isNaN(parsed) || parsed <= 0 ? config.width : parsed;
    setMeasure(config.length, nextWidth, 'Otro ancho', value);
  };

  return (
    <StepShell title="Elige las medidas de tu módulo" subtitle="El modelo recomendado es 6 x 2,40 m, desde 4.750 € sin IVA.">
      <div className="grid gap-4 sm:grid-cols-3">
        {[3,4,5,6,7,8].map((length) => <button key={length} onClick={() => setMeasure(length, config.width, config.widthOption, config.customWidth)} className={`rounded-2xl border p-4 text-left transition ${config.length === length ? 'border-brand-orange bg-orange-50 text-brand-orange' : 'border-slate-200 hover:border-slate-300'}`}><p className="text-lg font-black">{length} m</p><p className="text-xs font-bold text-slate-500">{length === 6 ? 'Más vendido' : length === 8 ? 'Bajo consulta' : 'Medida habitual'}</p></button>)}
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[{label:'2,40 metros',value:2.4,option:'2.40 m' as const,helper:'Ancho estándar'}, {label:'2,50 metros',value:2.5,option:'2.50 m' as const,helper:'Opción habitual'}, {label:'Otro ancho',value:null,option:'Otro ancho' as const,helper:'Bajo consulta'}].map((option) => {
          const selected = config.widthOption === option.option;
          const customWidth = parseNumberInput(config.customWidth);
          const widthValue = option.value ?? (Number.isNaN(customWidth) ? config.width : customWidth);
          return <button key={option.label} onClick={() => setMeasure(config.length, widthValue, option.option, config.customWidth)} className={`rounded-2xl border p-4 text-left transition ${selected ? 'border-brand-blue bg-blue-50 text-brand-blue' : 'border-slate-200 hover:border-slate-300'}`}><p className="font-black">{option.label}</p><p className="mt-1 text-xs text-slate-500">{option.helper}</p></button>;
        })}
      </div>
      {config.widthOption === 'Otro ancho' ? <div className="mt-5 max-w-xs"><Field label="Ancho deseado en metros"><Input value={config.customWidth} onChange={(e) => setCustomWidth(e.target.value)} placeholder="Ej. 2.60" /></Field><p className="mt-2 text-xs font-semibold text-slate-500">Rango permitido: {MIN_CUSTOM_WIDTH.toLocaleString('es-ES')} m a {MAX_CUSTOM_WIDTH.toLocaleString('es-ES')} m.</p></div> : null}
      {config.isSpecialMeasure ? <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-900">Esta medida se marcará como especial y puede requerir revisión técnica.</p> : null}
    </StepShell>
  );
};

const PanelStep = () => {
  const { config, setPanelChoice } = useConfiguratorStore();
  return (
    <StepShell title="Elige el panel" subtitle="El panel estándar es sándwich blanco de 30 mm. Otros grosores o colores se marcan bajo consulta.">
      <div className="grid gap-3 sm:grid-cols-2">
        {panelChoices.map((choice) => <button key={choice} onClick={() => setPanelChoice(choice, config.specialThickness, config.specialColor)} className={`rounded-2xl border p-4 text-left font-black transition ${config.panelChoice === choice ? 'border-brand-orange bg-orange-50 text-brand-orange' : 'border-slate-200 hover:border-slate-300'}`}>{choice}</button>)}
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {(config.panelChoice === 'Otro grosor de panel' || config.panelChoice === 'Otro grosor y otro color') ? <Field label="Grosor deseado"><Input value={config.specialThickness} onChange={(e) => setPanelChoice(config.panelChoice, e.target.value, config.specialColor)} placeholder="Ej. 40 mm" /></Field> : null}
        {(config.panelChoice === 'Otro color de panel' || config.panelChoice === 'Otro grosor y otro color') ? <Field label="Color deseado"><Input value={config.specialColor} onChange={(e) => setPanelChoice(config.panelChoice, config.specialThickness, e.target.value)} placeholder="Ej. gris antracita" /></Field> : null}
      </div>
    </StepShell>
  );
};

const UseStep = () => {
  const { config, setUseType } = useConfiguratorStore();
  return <StepShell title="Uso previsto" subtitle="Selecciona el uso principal para preparar mejor el presupuesto."><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{uses.map((use) => <button key={use} onClick={() => setUseType(use)} className={`rounded-2xl border p-4 text-left font-black transition ${config.useType === use ? 'border-brand-orange bg-orange-50 text-brand-orange' : 'border-slate-200 hover:border-slate-300'}`}>{use}</button>)}</div></StepShell>;
};

const LocationStep = () => {
  const { config, setLocation } = useConfiguratorStore();
  return <StepShell title="Ubicación y plazo" subtitle="Necesitamos estos datos para estimar transporte, montaje y prioridad."><div className="grid gap-4 sm:grid-cols-2"><Field label="Provincia"><Input value={config.province} onChange={(e) => setLocation({ province: e.target.value })} placeholder="Sevilla" /></Field><Field label="Localidad"><Input value={config.city} onChange={(e) => setLocation({ city: e.target.value })} placeholder="San José de la Rinconada" /></Field><Field label="Código postal"><Input value={config.postalCode} onChange={(e) => setLocation({ postalCode: e.target.value })} placeholder="41300" /></Field><Field label="Plazo"><Select value={config.deliveryTimeline} onChange={(e) => setLocation({ deliveryTimeline: e.target.value as DeliveryTimeline })}>{timelines.map((t) => <option key={t}>{t}</option>)}</Select></Field></div></StepShell>;
};

const SummaryStep = ({ price }: { price: ReturnType<typeof calculatePrice> }) => {
  const { config } = useConfiguratorStore();
  return <StepShell title="Resumen de presupuesto" subtitle="Revisa la configuración antes de introducir tus datos."><div className="grid gap-5 lg:grid-cols-2"><div className="rounded-2xl bg-slate-50 p-5"><h3 className="font-black text-slate-900">Datos técnicos</h3><div className="mt-3 space-y-2 text-sm text-slate-700"><p><strong>Medidas:</strong> {config.length} x {config.width} m</p><p><strong>Metros cuadrados:</strong> {price.squareMeters} m²</p><p><strong>Panel:</strong> {config.panelType}, {config.panelThickness}, color {config.panelColor}</p><p><strong>Uso:</strong> {config.useType}</p><p><strong>Ubicación:</strong> {config.city}, {config.province}</p></div></div><div className="rounded-2xl bg-orange-50 p-5"><h3 className="font-black text-slate-900">Precio</h3><div className="mt-3 space-y-2 text-sm text-slate-800"><p><strong>Precio base:</strong> {formatCurrency(price.basePrice)}</p><p><strong>Extras:</strong> {formatCurrency(price.extrasPrice)}</p><p><strong>Precio sin IVA:</strong> {formatCurrency(price.estimatedPriceWithoutVat)}</p><p><strong>IVA 21%:</strong> {formatCurrency(price.vatAmount)}</p><p className="text-xl font-black text-brand-orange">Total con IVA: {formatCurrency(price.estimatedPriceWithVat)}</p></div></div></div><div className="mt-5 rounded-2xl bg-slate-950 p-5 text-white"><h3 className="font-black">Elementos incluidos</h3><p className="mt-2 text-sm text-slate-300">{price.summary.includedList.join(', ')}</p><h3 className="mt-4 font-black">Extras añadidos</h3><p className="mt-2 text-sm text-slate-300">{price.summary.extrasList.length ? price.summary.extrasList.join(', ') : 'Sin extras añadidos'}</p></div><p className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-900">Precio orientativo sujeto a revisión técnica, transporte, montaje, accesos y disponibilidad de materiales.</p></StepShell>;
};

const SelectedItemPanel = ({ item }: { item: LayoutItem | null }) => {
  const { setDivisionOrientation, updateItem, resizeBathroom } = useConfiguratorStore();
  if (!item) return <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-600">Selecciona un elemento del plano para ver sus opciones.</p>;
  const isDivision = item.type === 'interior_room' || item.type === 'full_bathroom' || item.type === 'wall_partition';
  const updateBathroomWidth = (value: string) => {
    const parsed = parseNumberInput(value);
    if (!Number.isNaN(parsed)) resizeBathroom(item.id, parsed, item.height);
  };
  const updateBathroomHeight = (value: string) => {
    const parsed = parseNumberInput(value);
    if (!Number.isNaN(parsed)) resizeBathroom(item.id, item.width, parsed);
  };

  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="font-black text-slate-900">Seleccionado: {item.label}</p>
      <p className="mt-1 text-sm text-slate-600">X {item.x.toFixed(2)} m · Y {item.y.toFixed(2)} m · {item.width.toFixed(2)} x {item.height.toFixed(2)} m</p>
      {item.parentId ? <p className="mt-2 rounded-xl bg-blue-50 p-3 text-sm font-semibold text-blue-900">Elemento interno del baño. Puedes arrastrarlo para colocarlo dentro del bloque.</p> : null}
      {isDivision ? <div className="mt-3 flex flex-wrap gap-2"><Button variant="outline" onClick={() => setDivisionOrientation(item.id, 'transversal')}>Transversal</Button><Button variant="outline" onClick={() => setDivisionOrientation(item.id, 'longitudinal')}>Longitudinal</Button>{item.type === 'full_bathroom' ? <Button variant="outline" onClick={() => updateItem(item.id, { hasShowerTray: !item.hasShowerTray })}>{item.hasShowerTray === false ? 'Añadir ducha' : 'Sin plato de ducha (-100 €)'}</Button> : null}</div> : null}
      {item.type === 'full_bathroom' ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Ancho del baño (m)"><Input value={item.width.toFixed(2)} onChange={(event) => updateBathroomWidth(event.target.value)} /></Field>
          <Field label="Fondo del baño (m)"><Input value={item.height.toFixed(2)} onChange={(event) => updateBathroomHeight(event.target.value)} /></Field>
          <p className="rounded-xl bg-amber-50 p-3 text-xs font-semibold text-amber-900 sm:col-span-2">El bloque de baño se puede ampliar o reducir. Sus elementos internos se mantienen dentro del bloque y se pueden recolocar arrastrándolos.</p>
        </div>
      ) : null}
    </div>
  );
};

const validateContact = (contact: ContactFormState) => {
  const errors: Partial<Record<keyof ContactFormState, string>> = {};
  if (contact.fullName.trim().length < 2) errors.fullName = 'Introduce tu nombre completo.';
  if (contact.phone.trim().length < 7) errors.phone = 'Introduce un teléfono válido.';
  if (!isValidEmail(contact.email)) errors.email = 'Introduce un email válido.';
  if (!contact.accepted) errors.accepted = 'Debes aceptar la política de privacidad.';
  return errors;
};

const ContactStep = ({ onSubmit, error }: { onSubmit: (contact: ContactFormState) => Promise<void>; error?: string }) => {
  const { config } = useConfiguratorStore();
  const [contact, setContact] = useState<ContactFormState>({
    fullName: '',
    phone: '',
    email: '',
    intendedUse: config.useType,
    comments: '',
    accepted: false,
    newsletterSubscribed: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateContact = <K extends keyof ContactFormState>(key: K, value: ContactFormState[K]) => {
    setContact((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateContact(contact);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    setIsSubmitting(true);
    try {
      await onSubmit(contact);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StepShell title="Datos del cliente" subtitle="Generaremos el PDF y guardaremos la solicitud para preparar el presupuesto.">
      <form noValidate onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre completo" error={errors.fullName}>
            <Input autoComplete="name" value={contact.fullName} onChange={(event) => updateContact('fullName', event.target.value)} />
          </Field>
          <Field label="Teléfono" error={errors.phone}>
            <Input autoComplete="tel" value={contact.phone} onChange={(event) => updateContact('phone', event.target.value)} />
          </Field>
          <Field label="Email" error={errors.email}>
            <Input type="email" autoComplete="email" value={contact.email} onChange={(event) => updateContact('email', event.target.value)} />
          </Field>
          <Field label="Uso previsto">
            <Input value={contact.intendedUse} onChange={(event) => updateContact('intendedUse', event.target.value)} />
          </Field>
        </div>
        <Field label="Comentarios">
          <Textarea rows={4} value={contact.comments} onChange={(event) => updateContact('comments', event.target.value)} placeholder="Cuéntanos detalles de transporte, montaje, accesos, acabados, etc." />
        </Field>
        <label className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-700">
          <input type="checkbox" className="mt-1" checked={contact.accepted} onChange={(event) => updateContact('accepted', event.target.checked)} />
          <span>Acepto la política de privacidad y el tratamiento de mis datos para gestionar la solicitud.</span>
        </label>
        {errors.accepted ? <p className="text-sm font-semibold text-red-600">{errors.accepted}</p> : null}
        <label className="flex items-start gap-3 rounded-2xl bg-blue-50 p-4 text-sm font-semibold text-blue-900">
          <input type="checkbox" className="mt-1" checked={contact.newsletterSubscribed} onChange={(event) => updateContact('newsletterSubscribed', event.target.checked)} />
          <span>Quiero recibir novedades u ofertas.</span>
        </label>
        {error ? <p className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p> : null}
        <Button type="submit" disabled={isSubmitting}>
          <Download size={18} /> {isSubmitting ? 'Generando...' : 'Guardar solicitud y descargar PDF'}
        </Button>
      </form>
    </StepShell>
  );
};
