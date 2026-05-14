import type { ElementType } from 'react';
import {
  Copy,
  DoorOpen,
  Droplets,
  FlipHorizontal2,
  Grid3X3,
  Lightbulb,
  PanelsTopLeft,
  Plug,
  Redo2,
  RotateCw,
  ShowerHead,
  Snowflake,
  SquareDashedMousePointer,
  Toilet,
  Trash2,
  Undo2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import type { LayoutItemType } from '../../../types';
import { formatCurrency, getItemPrice, ITEM_LABELS, ITEM_PRICES } from '../../../utils/pricing';
import { useConfiguratorStore } from '../store/useConfiguratorStore';

const toolSections: {
  title: string;
  description: string;
  tools: { type: LayoutItemType; icon: ElementType; hint: string }[];
}[] = [
  {
    title: 'Puertas y ventanas',
    description: 'Aberturas exteriores e interiores',
    tools: [
      { type: 'additional_door', icon: DoorOpen, hint: `${ITEM_LABELS.additional_door} · ${formatCurrency(ITEM_PRICES.additional_door)}` },
      { type: 'interior_door', icon: DoorOpen, hint: `${ITEM_LABELS.interior_door} · ${formatCurrency(ITEM_PRICES.interior_door)}` },
      { type: 'window_80x80', icon: PanelsTopLeft, hint: `${ITEM_LABELS.window_80x80} · ${formatCurrency(ITEM_PRICES.window_80x80)}` },
      { type: 'large_window', icon: PanelsTopLeft, hint: `${ITEM_LABELS.large_window} · ${formatCurrency(ITEM_PRICES.large_window)}` },
      { type: 'bathroom_window_40x40', icon: PanelsTopLeft, hint: `${ITEM_LABELS.bathroom_window_40x40} · ${formatCurrency(ITEM_PRICES.bathroom_window_40x40)}` },
    ],
  },
  {
    title: 'Electricidad y clima',
    description: 'Puntos eléctricos y confort',
    tools: [
      { type: 'additional_socket', icon: Plug, hint: `${ITEM_LABELS.additional_socket} · ${formatCurrency(ITEM_PRICES.additional_socket)}` },
      { type: 'additional_light_point', icon: Lightbulb, hint: `${ITEM_LABELS.additional_light_point} · ${formatCurrency(ITEM_PRICES.additional_light_point)}` },
      { type: 'air_conditioning', icon: Snowflake, hint: `${ITEM_LABELS.air_conditioning} · ${formatCurrency(ITEM_PRICES.air_conditioning)}` },
    ],
  },
  {
    title: 'Distribución interior',
    description: 'Separaciones y tabiques',
    tools: [
      { type: 'wall_partition', icon: SquareDashedMousePointer, hint: `${ITEM_LABELS.wall_partition} · ${formatCurrency(ITEM_PRICES.wall_partition)}` },
    ],
  },
  {
    title: 'Baño y fontanería',
    description: 'Piezas individuales para montar el baño',
    tools: [
      { type: 'toilet', icon: Toilet, hint: `${ITEM_LABELS.toilet} · ${formatCurrency(ITEM_PRICES.toilet)}` },
      { type: 'sink', icon: Droplets, hint: `${ITEM_LABELS.sink} · ${formatCurrency(ITEM_PRICES.sink)}` },
      { type: 'shower_tray', icon: ShowerHead, hint: `${ITEM_LABELS.shower_tray} · ${formatCurrency(ITEM_PRICES.shower_tray)}` },
    ],
  },
];

const duplicableTypes: LayoutItemType[] = [
  'base_door',
  'base_window_80x80',
  'base_socket',
  'base_light_point',
  'additional_socket',
  'additional_light_point',
  'additional_door',
  'interior_door',
  'window_80x80',
  'bathroom_window_40x40',
  'large_window',
  'wall_partition',
  'interior_room',
  'full_bathroom',
  'toilet',
  'sink',
  'shower_tray',
  'air_conditioning',
];

const doorTypes: LayoutItemType[] = ['base_door', 'additional_door', 'interior_door', 'bathroom_door'];

const formatMeters = (value: number) => `${value.toLocaleString('es-ES', { maximumFractionDigits: 2 })} m`;

export const CadToolbar = ({
  onAdd,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onCenter,
}: {
  onAdd: (type: LayoutItemType) => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCenter: () => void;
}) => (
  <aside className="cad-toolbar-panel space-y-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-soft">
    <div className="cad-toolbar-heading">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-orange">Herramientas CAD</p>
      <h3 className="mt-1 text-lg font-black text-slate-900">Añadir elementos</h3>
      <p className="mt-1 text-xs font-semibold text-slate-500">Herramientas agrupadas para diseñar el módulo sin saturar la pantalla.</p>
    </div>

    <div className="cad-add-tools space-y-3">
      {toolSections.map((section, index) => (
        <details key={section.title} open={index < 2} className="group rounded-2xl border border-slate-200 bg-slate-50 p-3 open:bg-white">
          <summary className="cursor-pointer list-none">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black text-slate-900">{section.title}</p>
                <p className="mt-0.5 text-xs font-semibold text-slate-500">{section.description}</p>
              </div>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-black text-slate-500 shadow-sm group-open:text-brand-orange">{section.tools.length}</span>
            </div>
          </summary>
          <div className="mt-3 grid gap-2">
            {section.tools.map(({ type, icon: Icon, hint }) => (
              <button key={type} onClick={() => onAdd(type)} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-left text-sm font-bold text-slate-700 transition hover:border-brand-orange hover:bg-orange-50 hover:text-brand-orange">
                <span className="flex items-center gap-2"><Icon size={17} /> {hint}</span>
                <Copy size={14} />
              </button>
            ))}
          </div>
        </details>
      ))}
    </div>

    <div className="cad-view-tools rounded-2xl border border-slate-200 bg-white p-3">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Acciones del plano</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button className="btn-outline px-3 py-2 text-sm" onClick={onUndo}><Undo2 size={16} /> Deshacer</button>
        <button className="btn-outline px-3 py-2 text-sm" onClick={onRedo}><Redo2 size={16} /> Rehacer</button>
        <button className="btn-outline px-3 py-2 text-sm" onClick={onZoomOut}><ZoomOut size={16} /> Zoom -</button>
        <button className="btn-outline px-3 py-2 text-sm" onClick={onZoomIn}><ZoomIn size={16} /> Zoom +</button>
        <button className="btn-outline col-span-2 px-3 py-2 text-sm" onClick={onCenter}><Grid3X3 size={16} /> Centrar plano</button>
      </div>
    </div>
  </aside>
);

export const CadElementActionBar = ({ onDelete }: { onDelete: () => void }) => {
  const selectedItemId = useConfiguratorStore((state) => state.selectedItemId);
  const selectedItem = useConfiguratorStore((state) => state.config.layoutItems.find((item) => item.id === selectedItemId));
  const rotateSelected = useConfiguratorStore((state) => state.rotateSelected);
  const duplicateSelected = useConfiguratorStore((state) => state.duplicateSelected);
  const toggleSelectedDoorSwing = useConfiguratorStore((state) => state.toggleSelectedDoorSwing);
  const canDuplicate = Boolean(selectedItem && duplicableTypes.includes(selectedItem.type));
  const canChangeDoorSwing = Boolean(selectedItem && doorTypes.includes(selectedItem.type));
  const selectedPrice = selectedItem ? getItemPrice(selectedItem) : 0;

  return (
    <div className="cad-element-action-bar grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
      <div className="min-w-0">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-blue">Acciones del elemento seleccionado</p>
        {selectedItem ? (
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-bold text-slate-700">
            <span className="max-w-full truncate text-base font-black text-slate-900">{selectedItem.label}</span>
            <span>{selectedItem.side ? `Pared ${selectedItem.side}` : selectedItem.zone === 'inside' ? 'Interior' : 'Plano'}</span>
            <span>{selectedItem.included ? 'Incluido' : formatCurrency(selectedPrice)}</span>
            <span>{formatMeters(selectedItem.width)} x {formatMeters(selectedItem.height)}</span>
          </div>
        ) : (
          <p className="mt-1 text-sm font-semibold text-slate-600">Selecciona una puerta, ventana, baño o elemento del plano para editarlo sin hacer scroll.</p>
        )}
      </div>

      <div className="cad-element-buttons grid grid-cols-2 gap-2 sm:grid-cols-4 xl:min-w-[520px] xl:shrink-0">
        <button className="btn-outline w-full px-3 py-2 text-sm" onClick={rotateSelected} disabled={!selectedItem}><RotateCw size={16} /> Girar</button>
        <button className="btn-outline w-full px-3 py-2 text-sm" onClick={duplicateSelected} disabled={!canDuplicate}><Copy size={16} /> Duplicar</button>
        <button className="btn-outline w-full px-3 py-2 text-sm" onClick={onDelete} disabled={!selectedItem}><Trash2 size={16} /> Borrar</button>
        <button className="btn-outline w-full px-3 py-2 text-sm" onClick={toggleSelectedDoorSwing} disabled={!canChangeDoorSwing}><FlipHorizontal2 size={16} /> Apertura</button>
      </div>
    </div>
  );
};
