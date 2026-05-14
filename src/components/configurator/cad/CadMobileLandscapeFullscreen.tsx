import { useEffect, useMemo, useRef, useState, type ElementType } from 'react';
import type Konva from 'konva';
import { Layer, Rect, Stage, Text } from 'react-konva';
import {
  Bath,
  Copy,
  DoorOpen,
  Droplets,
  Eye,
  FlipHorizontal2,
  Grid3X3,
  House,
  Lightbulb,
  Maximize2,
  Minimize2,
  MousePointer2,
  PanelsTopLeft,
  Plus,
  Plug,
  Redo2,
  RotateCw,
  ShowerHead,
  Snowflake,
  SquareDashedMousePointer,
  Toilet,
  Trash2,
  Undo2,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import type { LayoutItem, LayoutItemType } from '../../../types';
import { formatCurrency, getItemPrice } from '../../../utils/pricing';
import { useConfiguratorStore } from '../store/useConfiguratorStore';
import { CadGrid } from './CadGrid';
import { CadObjectsLayer } from './CadObjectsLayer';
import { CadRulers } from './CadRulers';
import { CadWalls } from './CadWalls';
import { validateCadLayout } from './utils/collisions';
import type { PlanGeometry } from './utils/coordinates';

type Panel = 'edit' | 'add' | 'view' | 'none';
type Tool = { type: LayoutItemType; icon: ElementType; label: string };

const sections: { title: string; tools: Tool[] }[] = [
  {
    title: 'Puertas y ventanas',
    tools: [
      { type: 'additional_door', icon: DoorOpen, label: 'Puerta ext.' },
      { type: 'interior_door', icon: DoorOpen, label: 'Puerta int.' },
      { type: 'window_80x80', icon: PanelsTopLeft, label: 'Ventana' },
      { type: 'large_window', icon: PanelsTopLeft, label: 'Ventana grande' },
      { type: 'bathroom_window_40x40', icon: PanelsTopLeft, label: 'Ventana baño' },
    ],
  },
  {
    title: 'Electricidad y clima',
    tools: [
      { type: 'additional_socket', icon: Plug, label: 'Enchufe' },
      { type: 'additional_light_point', icon: Lightbulb, label: 'Punto luz' },
      { type: 'air_conditioning', icon: Snowflake, label: 'A/A' },
    ],
  },
  {
    title: 'Distribución',
    tools: [
      { type: 'wall_partition', icon: SquareDashedMousePointer, label: 'División' },
      { type: 'interior_room', icon: House, label: 'Estancia' },
    ],
  },
  {
    title: 'Baño',
    tools: [
      { type: 'full_bathroom', icon: Bath, label: 'Baño completo' },
      { type: 'toilet', icon: Toilet, label: 'WC' },
      { type: 'sink', icon: Droplets, label: 'Lavabo' },
      { type: 'shower_tray', icon: ShowerHead, label: 'Ducha' },
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

const fitGeometryToBox = (containerWidth: number, containerHeight: number, length: number, width: number, zoom: number): PlanGeometry => {
  const safeLength = Math.max(length, 0.1);
  const safeWidth = Math.max(width, 0.1);
  const compact = containerWidth < 700;
  const paddingLeft = compact ? 34 : 52;
  const paddingRight = compact ? 12 : 20;
  const paddingTop = compact ? 30 : 36;
  const paddingBottom = compact ? 26 : 32;
  const availableWidth = Math.max(220, containerWidth - paddingLeft - paddingRight);
  const availableHeight = Math.max(120, containerHeight - paddingTop - paddingBottom);
  const planWidth = Math.max(220, Math.min(availableWidth, availableHeight * (safeLength / safeWidth)) * zoom);
  const scale = planWidth / safeLength;
  const planHeight = safeWidth * scale;

  return {
    stageWidth: Math.max(containerWidth, planWidth + paddingLeft + paddingRight),
    stageHeight: Math.max(containerHeight, planHeight + paddingTop + paddingBottom),
    planX: paddingLeft + Math.max(0, (availableWidth - planWidth) / 2),
    planY: paddingTop + Math.max(0, (availableHeight - planHeight) / 2),
    planWidth,
    planHeight,
    scale,
  };
};

const useLandscapeCad = () => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const update = () => setActive(window.innerWidth <= 920 && window.innerWidth > window.innerHeight);
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  return active;
};

export const CadMobileLandscapeFullscreen = ({
  length,
  width,
  items,
  selectedItemId,
  onSelect,
  onMove,
}: {
  length: number;
  width: number;
  items: LayoutItem[];
  selectedItemId: string | null;
  onSelect: (id: string | null) => void;
  onMove: (id: string, x: number, y: number) => void;
}) => {
  const isLandscape = useLandscapeCad();
  const [dismissed, setDismissed] = useState(false);
  const [panel, setPanel] = useState<Panel>('none');
  const [zoom, setZoom] = useState(1);
  const [fullscreenActive, setFullscreenActive] = useState(false);
  const [fullscreenError, setFullscreenError] = useState('');
  const rootRef = useRef<HTMLDivElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [size, setSize] = useState({ width: 760, height: 280 });
  const selectedItem = useConfiguratorStore((state) => state.config.layoutItems.find((item) => item.id === state.selectedItemId));
  const addItem = useConfiguratorStore((state) => state.addItem);
  const undo = useConfiguratorStore((state) => state.undo);
  const redo = useConfiguratorStore((state) => state.redo);
  const rotateSelected = useConfiguratorStore((state) => state.rotateSelected);
  const duplicateSelected = useConfiguratorStore((state) => state.duplicateSelected);
  const removeSelected = useConfiguratorStore((state) => state.removeSelected);
  const toggleSelectedDoorSwing = useConfiguratorStore((state) => state.toggleSelectedDoorSwing);

  useEffect(() => {
    setPanel('none');
    if (!isLandscape) setDismissed(false);
  }, [isLandscape]);

  useEffect(() => {
    const update = () => setFullscreenActive(Boolean(document.fullscreenElement));
    update();
    document.addEventListener('fullscreenchange', update);
    return () => document.removeEventListener('fullscreenchange', update);
  }, []);

  useEffect(() => {
    const node = shellRef.current;
    if (!node || !isLandscape || dismissed) return;
    const update = () => setSize({ width: Math.max(320, node.clientWidth), height: Math.max(180, node.clientHeight) });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [isLandscape, dismissed, fullscreenActive]);

  const requestNativeFullscreen = async (silent = false) => {
    const node = rootRef.current;
    if (!node?.requestFullscreen || document.fullscreenElement) return;

    try {
      setFullscreenError('');
      await node.requestFullscreen();
    } catch {
      if (!silent) setFullscreenError('Toca de nuevo “Pantalla”. Chrome puede bloquearlo al primer intento.');
    }
  };

  const exitNativeFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
    } catch {
      // El navegador puede bloquear esta acción; no afecta al uso del CAD.
    }
  };

  const handleDismiss = async () => {
    await exitNativeFullscreen();
    setDismissed(true);
  };

  const issues = useMemo(() => validateCadLayout(items, length, width), [items, length, width]);
  const errorItemIds = useMemo(() => issues.flatMap((issue) => issue.severity === 'error' ? [issue.itemId, issue.relatedItemId].filter(Boolean) as string[] : []), [issues]);
  const warningItemIds = useMemo(() => issues.flatMap((issue) => issue.severity === 'warning' ? [issue.itemId, issue.relatedItemId].filter(Boolean) as string[] : []), [issues]);
  const geometry = useMemo(() => fitGeometryToBox(size.width, size.height, length, width, zoom), [size.width, size.height, length, width, zoom]);
  const moduleLabel = `${length.toLocaleString('es-ES')} x ${width.toLocaleString('es-ES')} m`;
  const selectedPrice = selectedItem ? getItemPrice(selectedItem) : 0;
  const canDuplicate = Boolean(selectedItem && duplicableTypes.includes(selectedItem.type));
  const canChangeDoorSwing = Boolean(selectedItem && doorTypes.includes(selectedItem.type));

  if (!isLandscape || dismissed) return null;

  const togglePanel = (nextPanel: Panel) => {
    void requestNativeFullscreen(true);
    setPanel((current) => current === nextPanel ? 'none' : nextPanel);
  };

  return (
    <div ref={rootRef} className="fixed inset-0 z-[9999] flex h-[100dvh] w-screen flex-col overflow-hidden bg-slate-950 text-white">
      <header className="flex h-[34px] shrink-0 items-center justify-between gap-2 border-b border-white/10 bg-slate-950/95 px-2">
        <button onClick={handleDismiss} className="inline-flex h-7 items-center gap-1 rounded-full bg-white/10 px-2.5 text-[11px] font-black text-white active:scale-95"><X size={14} /> Salir</button>
        <p className="min-w-0 flex-1 truncate text-center text-[11px] font-black uppercase tracking-[0.14em] text-orange-300">CAD 2D · {moduleLabel}</p>
        <button onClick={() => fullscreenActive ? void exitNativeFullscreen() : void requestNativeFullscreen()} className="inline-flex h-7 w-[92px] items-center justify-center gap-1 rounded-full bg-brand-orange px-2 text-[10px] font-black text-white active:scale-95">
          {fullscreenActive ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          {fullscreenActive ? 'Salir' : 'Pantalla'}
        </button>
      </header>

      <main className="relative min-h-0 flex-1 overflow-hidden p-1.5 pb-[54px]">
        <div ref={shellRef} className="h-full w-full overflow-auto rounded-xl border border-slate-700 bg-slate-950 shadow-inner">
          <Stage
            ref={stageRef}
            width={geometry.stageWidth}
            height={geometry.stageHeight}
            onMouseDown={(event) => { if (event.target === event.target.getStage()) onSelect(null); }}
            onTouchStart={(event) => { if (event.target === event.target.getStage()) onSelect(null); }}
          >
            <Layer listening={false}>
              <Rect x={0} y={0} width={geometry.stageWidth} height={geometry.stageHeight} fill="#020617" />
              <Rect x={8} y={8} width={geometry.stageWidth - 16} height={geometry.stageHeight - 16} stroke="#334155" strokeWidth={1} cornerRadius={14} />
            </Layer>
            <Layer listening={false}>
              <CadGrid geometry={geometry} length={length} width={width} />
              <CadRulers geometry={geometry} length={length} width={width} />
              <CadWalls geometry={geometry} />
            </Layer>
            <Layer>
              <CadObjectsLayer items={items} selectedItemId={selectedItemId} geometry={geometry} errorItemIds={errorItemIds} warningItemIds={warningItemIds} onSelect={onSelect} onMove={onMove} />
            </Layer>
            <Layer listening={false}>
              <Rect x={geometry.planX} y={Math.max(10, geometry.planY - 24)} width={Math.min(geometry.planWidth, 260)} height={18} fill="rgba(15,23,42,0.82)" cornerRadius={7} />
              <Text x={geometry.planX + 7} y={Math.max(15, geometry.planY - 20)} text={`Módulo ${moduleLabel}`} fill="#cbd5e1" fontSize={9} fontStyle="bold" width={250} />
            </Layer>
          </Stage>
        </div>

        {fullscreenError ? <p className="absolute right-2 top-2 rounded-full bg-amber-100 px-3 py-1 text-[10px] font-black text-amber-950 shadow-lg">{fullscreenError}</p> : null}

        {panel !== 'none' ? (
          <section className="absolute inset-x-2 bottom-[56px] max-h-[32dvh] overflow-auto rounded-xl border border-white/15 bg-white/95 p-2 text-slate-900 shadow-2xl backdrop-blur">
            {panel === 'edit' ? (
              <div className="space-y-2">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.14em] text-brand-blue">Editar elemento</p>
                  <p className="truncate text-sm font-black text-slate-900">{selectedItem ? selectedItem.label : 'Selecciona un elemento del plano'}</p>
                  {selectedItem ? <p className="text-[11px] font-bold text-slate-500">{selectedItem.included ? 'Incluido' : formatCurrency(selectedPrice)} · {selectedItem.side ? `Pared ${selectedItem.side}` : selectedItem.zone === 'inside' ? 'Interior' : 'Plano'}</p> : null}
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  <button className="btn-outline px-2 py-1.5 text-[11px]" onClick={rotateSelected} disabled={!selectedItem}><RotateCw size={14} /> Girar</button>
                  <button className="btn-outline px-2 py-1.5 text-[11px]" onClick={duplicateSelected} disabled={!canDuplicate}><Copy size={14} /> Copiar</button>
                  <button className="btn-outline px-2 py-1.5 text-[11px]" onClick={removeSelected} disabled={!selectedItem}><Trash2 size={14} /> Borrar</button>
                  <button className="btn-outline px-2 py-1.5 text-[11px]" onClick={toggleSelectedDoorSwing} disabled={!canChangeDoorSwing}><FlipHorizontal2 size={14} /> Apertura</button>
                </div>
              </div>
            ) : null}

            {panel === 'add' ? (
              <div className="grid gap-1.5 sm:grid-cols-2">
                {sections.map((section) => (
                  <div key={section.title} className="rounded-lg border border-slate-200 bg-slate-50 p-1.5">
                    <p className="mb-1.5 text-[11px] font-black text-slate-800">{section.title}</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {section.tools.map(({ type, icon: Icon, label }) => (
                        <button key={type} onClick={() => { addItem(type); setPanel('none'); }} className="inline-flex min-h-8 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-[10px] font-black text-slate-700 active:scale-95">
                          <Icon size={13} /> {label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {panel === 'view' ? (
              <div className="grid grid-cols-5 gap-1.5">
                <button className="btn-outline px-2 py-1.5 text-[11px]" onClick={undo}><Undo2 size={14} /> Deshacer</button>
                <button className="btn-outline px-2 py-1.5 text-[11px]" onClick={redo}><Redo2 size={14} /> Rehacer</button>
                <button className="btn-outline px-2 py-1.5 text-[11px]" onClick={() => setZoom((current) => Math.max(0.75, Number((current - 0.1).toFixed(2))))}><ZoomOut size={14} /> Zoom -</button>
                <button className="btn-outline px-2 py-1.5 text-[11px]" onClick={() => setZoom((current) => Math.min(1.35, Number((current + 0.1).toFixed(2))))}><ZoomIn size={14} /> Zoom +</button>
                <button className="btn-outline px-2 py-1.5 text-[11px]" onClick={() => setZoom(1)}><Grid3X3 size={14} /> Centrar</button>
              </div>
            ) : null}
          </section>
        ) : null}
      </main>

      <nav className="fixed inset-x-0 bottom-0 grid h-[50px] grid-cols-3 gap-1.5 border-t border-white/10 bg-slate-950/95 p-1.5 pb-[max(6px,env(safe-area-inset-bottom))]">
        <button onClick={() => togglePanel('edit')} className={`rounded-xl text-[11px] font-black ${panel === 'edit' ? 'bg-brand-orange text-white' : 'bg-white/10 text-slate-200'}`}><MousePointer2 className="mx-auto" size={15} />Editar</button>
        <button onClick={() => togglePanel('add')} className={`rounded-xl text-[11px] font-black ${panel === 'add' ? 'bg-brand-orange text-white' : 'bg-white/10 text-slate-200'}`}><Plus className="mx-auto" size={15} />Añadir</button>
        <button onClick={() => togglePanel('view')} className={`rounded-xl text-[11px] font-black ${panel === 'view' ? 'bg-brand-orange text-white' : 'bg-white/10 text-slate-200'}`}><Eye className="mx-auto" size={15} />Vista</button>
      </nav>
    </div>
  );
};
