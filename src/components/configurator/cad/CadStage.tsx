import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import type Konva from 'konva';
import { Layer, Rect, Stage, Text } from 'react-konva';
import { RotateCcw, Smartphone } from 'lucide-react';
import type { LayoutItem } from '../../../types';
import { validateCadLayout } from './utils/collisions';
import { calculatePlanGeometry } from './utils/coordinates';
import { CadGrid } from './CadGrid';
import { CadObjectsLayer } from './CadObjectsLayer';
import { CadRulers } from './CadRulers';
import { CadWalls } from './CadWalls';

export const CadStage = forwardRef<Konva.Stage, {
  length: number;
  width: number;
  items: LayoutItem[];
  selectedItemId: string | null;
  zoom: number;
  onSelect: (id: string | null) => void;
  onMove: (id: string, x: number, y: number) => void;
}>(({ length, width, items, selectedItemId, zoom, onSelect, onMove }, ref) => {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const [availableWidth, setAvailableWidth] = useState(920);

  useEffect(() => {
    const node = shellRef.current;
    if (!node) return;
    const update = () => setAvailableWidth(Math.max(300, node.clientWidth - 24));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const isCompact = availableWidth < 640;
  const geometry = useMemo(() => calculatePlanGeometry(availableWidth, length, width, zoom), [availableWidth, length, width, zoom]);
  const validationIssues = useMemo(() => validateCadLayout(items, length, width), [items, length, width]);
  const errorCount = validationIssues.filter((issue) => issue.severity === 'error').length;
  const warningCount = validationIssues.filter((issue) => issue.severity === 'warning').length;
  const errorItemIds = useMemo(() => validationIssues.flatMap((issue) => issue.severity === 'error' ? [issue.itemId, issue.relatedItemId].filter(Boolean) as string[] : []), [validationIssues]);
  const warningItemIds = useMemo(() => validationIssues.flatMap((issue) => issue.severity === 'warning' ? [issue.itemId, issue.relatedItemId].filter(Boolean) as string[] : []), [validationIssues]);
  const moduleLabel = `${length.toLocaleString('es-ES')} x ${width.toLocaleString('es-ES')} m`;
  const legendText = isCompact
    ? 'Leyenda: P puerta · V ventana · T enchufe · PL luz'
    : 'Leyenda: P=Puerta · V=Ventana · VG=Ventana grande · T=Enchufe · PL=Punto de luz · CE=Cuadro eléctrico · A/A=Aire acondicionado';
  const legendY = geometry.planY + geometry.planHeight + 20;
  const legendHeight = isCompact ? 28 : 34;
  const status = errorCount > 0
    ? {
        label: 'Hay errores técnicos',
        description: `${errorCount} error(es) y ${warningCount} aviso(s). Revisa los elementos marcados en rojo antes de continuar.`,
        className: 'border-red-200 bg-red-50 text-red-900',
        dotClassName: 'bg-red-500',
      }
    : warningCount > 0
      ? {
          label: 'Plano con avisos',
          description: `${warningCount} aviso(s) detectados. Puedes continuar, pero conviene revisar los elementos marcados en ámbar.`,
          className: 'border-amber-200 bg-amber-50 text-amber-950',
          dotClassName: 'bg-amber-500',
        }
      : {
          label: 'Plano correcto',
          description: 'No hay incidencias detectadas en esta revisión inicial del plano.',
          className: 'border-emerald-200 bg-emerald-50 text-emerald-950',
          dotClassName: 'bg-emerald-500',
        };

  return (
    <div>
      <div className="mb-4 rounded-[22px] border border-amber-200 bg-amber-50 p-4 text-center text-amber-950 shadow-sm md:hidden portrait:block landscape:hidden">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-orange shadow-sm">
          <div className="relative">
            <Smartphone size={30} />
            <RotateCcw size={16} className="absolute -right-4 -top-3" />
          </div>
        </div>
        <p className="text-base font-black">Plano móvil optimizado</p>
        <p className="mt-1 text-sm font-semibold">Puedes verlo en vertical. Para mover elementos con más precisión, gira el móvil en horizontal.</p>
      </div>
      <div className={`mb-4 rounded-2xl border p-4 text-sm shadow-sm ${status.className}`}>
        <div className="flex items-start gap-3">
          <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${status.dotClassName}`} />
          <div>
            <p className="font-black">{status.label}</p>
            <p className="mt-1 font-semibold">{status.description}</p>
          </div>
        </div>
      </div>
      <div className="mb-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-orange">Módulos Prefabricados San José</p>
            <h3 className="mt-1 text-lg font-black text-slate-900">Plano CAD 2D · Módulo {moduleLabel}</h3>
            <p className="mt-1 text-sm font-semibold text-slate-500">Escala visual orientativa · unidades en metros</p>
          </div>
          <div className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-black text-brand-orange">
            {moduleLabel}
          </div>
        </div>
      </div>
      <div ref={shellRef} className="overflow-auto rounded-[22px] border border-slate-700/70 bg-slate-950 p-2 shadow-2xl shadow-slate-950/30 sm:rounded-[28px] sm:p-3">
        <Stage ref={ref} width={geometry.stageWidth} height={geometry.stageHeight} onMouseDown={(event) => { if (event.target === event.target.getStage()) onSelect(null); }} onTouchStart={(event) => { if (event.target === event.target.getStage()) onSelect(null); }}>
          <Layer listening={false}>
            <Rect x={0} y={0} width={geometry.stageWidth} height={geometry.stageHeight} fill="#020617" cornerRadius={22} />
            <Rect x={12} y={12} width={geometry.stageWidth - 24} height={geometry.stageHeight - 24} stroke="#334155" strokeWidth={1} cornerRadius={18} />
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
            <Rect x={geometry.planX} y={legendY} width={geometry.planWidth} height={legendHeight} fill="rgba(15,23,42,0.86)" stroke="#334155" strokeWidth={1} cornerRadius={10} />
            <Text
              x={geometry.planX + 10}
              y={legendY + (isCompact ? 9 : 11)}
              text={legendText}
              fill="#cbd5e1"
              fontSize={isCompact ? 10 : 11}
              fontStyle="bold"
              width={geometry.planWidth - 20}
            />
          </Layer>
        </Stage>
      </div>
      {validationIssues.length ? (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-950">
          <p className="font-black">Avisos técnicos del plano</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {validationIssues.slice(0, 8).map((issue) => <li key={issue.id} className={issue.severity === 'error' ? 'text-red-700' : 'text-amber-950'}>{issue.message}</li>)}
          </ul>
        </div>
      ) : null}
    </div>
  );
});

CadStage.displayName = 'CadStage';
