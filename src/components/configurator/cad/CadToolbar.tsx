import type { ElementType } from 'react';
import {
  Bath,
  Copy,
  DoorOpen,
  Droplets,
  Grid3X3,
  House,
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
import { formatCurrency, ITEM_LABELS, ITEM_PRICES } from '../../../utils/pricing';
import { useConfiguratorStore } from '../store/useConfiguratorStore';

const tools: { type: LayoutItemType; icon: ElementType; hint: string }[] = [
  { type: 'additional_socket', icon: Plug, hint: `${ITEM_LABELS.additional_socket} · ${formatCurrency(ITEM_PRICES.additional_socket)}` },
  { type: 'additional_door', icon: DoorOpen, hint: `${ITEM_LABELS.additional_door} · ${formatCurrency(ITEM_PRICES.additional_door)}` },
  { type: 'window_80x80', icon: PanelsTopLeft, hint: `${ITEM_LABELS.window_80x80} · ${formatCurrency(ITEM_PRICES.window_80x80)}` },
  { type: 'large_window', icon: PanelsTopLeft, hint: `${ITEM_LABELS.large_window} · ${formatCurrency(ITEM_PRICES.large_window)}` },
  { type: 'wall_partition', icon: SquareDashedMousePointer, hint: `${ITEM_LABELS.wall_partition} · ${formatCurrency(ITEM_PRICES.wall_partition)}` },
  { type: 'interior_room', icon: House, hint: `${ITEM_LABELS.interior_room} · ${formatCurrency(ITEM_PRICES.interior_room)}` },
  { type: 'toilet', icon: Toilet, hint: `${ITEM_LABELS.toilet} · ${formatCurrency(ITEM_PRICES.toilet)}` },
  { type: 'sink', icon: Droplets, hint: `${ITEM_LABELS.sink} · ${formatCurrency(ITEM_PRICES.sink)}` },
  { type: 'shower_tray', icon: ShowerHead, hint: `${ITEM_LABELS.shower_tray} · ${formatCurrency(ITEM_PRICES.shower_tray)}` },
  { type: 'full_bathroom', icon: Bath, hint: `${ITEM_LABELS.full_bathroom} · ${formatCurrency(ITEM_PRICES.full_bathroom)}` },
  { type: 'air_conditioning', icon: Snowflake, hint: `${ITEM_LABELS.air_conditioning} · ${formatCurrency(ITEM_PRICES.air_conditioning)}` },
];

const duplicableTypes: LayoutItemType[] = [
  'base_door',
  'base_window_80x80',
  'base_socket',
  'additional_socket',
  'additional_door',
  'window_80x80',
  'large_window',
  'wall_partition',
  'interior_room',
  'full_bathroom',
  'toilet',
  'sink',
  'shower_tray',
  'air_conditioning',
];

export const CadToolbar = ({
  onAdd,
  onUndo,
  onRedo,
  onDelete,
  onZoomIn,
  onZoomOut,
  onCenter,
}: {
  onAdd: (type: LayoutItemType) => void;
  onUndo: () => void;
  onRedo: () => void;
  onDelete: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCenter: () => void;
}) => {
  const selectedItemId = useConfiguratorStore((state) => state.selectedItemId);
  const selectedItem = useConfiguratorStore((state) => state.config.layoutItems.find((item) => item.id === selectedItemId));
  const rotateSelected = useConfiguratorStore((state) => state.rotateSelected);
  const duplicateSelected = useConfiguratorStore((state) => state.duplicateSelected);
  const canDuplicate = Boolean(selectedItem && duplicableTypes.includes(selectedItem.type));

  return (
    <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-orange">Herramientas CAD</p>
        <h3 className="mt-1 text-lg font-black text-slate-900">Añadir elementos</h3>
      </div>
      <div className="grid gap-2">
        {tools.map(({ type, icon: Icon, hint }) => (
          <button key={type} onClick={() => onAdd(type)} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 px-3 py-2.5 text-left text-sm font-bold text-slate-700 transition hover:border-brand-orange hover:bg-orange-50 hover:text-brand-orange">
            <span className="flex items-center gap-2"><Icon size={17} /> {hint}</span>
            <Copy size={14} />
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Elemento seleccionado</p>
        <p className="mt-1 text-sm font-black text-slate-900">{selectedItem ? selectedItem.label : 'Ninguno'}</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button className="btn-outline px-3 py-2 text-sm" onClick={rotateSelected} disabled={!selectedItem}><RotateCw size={16} /> Girar 90°</button>
          <button className="btn-outline px-3 py-2 text-sm" onClick={duplicateSelected} disabled={!canDuplicate}><Copy size={16} /> Duplicar</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-slate-200 pt-4">
        <button className="btn-outline px-3 py-2 text-sm" onClick={onUndo}><Undo2 size={16} /> Deshacer</button>
        <button className="btn-outline px-3 py-2 text-sm" onClick={onRedo}><Redo2 size={16} /> Rehacer</button>
        <button className="btn-outline px-3 py-2 text-sm" onClick={onDelete}><Trash2 size={16} /> Borrar</button>
        <button className="btn-outline px-3 py-2 text-sm" onClick={onZoomOut}><ZoomOut size={16} /> Zoom -</button>
        <button className="btn-outline px-3 py-2 text-sm" onClick={onZoomIn}><ZoomIn size={16} /> Zoom +</button>
        <button className="btn-outline col-span-2 px-3 py-2 text-sm" onClick={onCenter}><Grid3X3 size={16} /> Centrar plano</button>
      </div>
    </aside>
  );
};
