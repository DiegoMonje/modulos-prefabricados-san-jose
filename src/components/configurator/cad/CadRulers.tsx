import { Group, Line, Rect, Text } from 'react-konva';
import { metersToPx, type PlanGeometry } from './utils/coordinates';

const formatMeters = (value: number) => `${value.toLocaleString('es-ES', { maximumFractionDigits: 2 })} m`;

export const CadRulers = ({ geometry, length, width }: { geometry: PlanGeometry; length: number; width: number }) => {
  const xTicks = Array.from({ length: Math.floor(length) + 1 }, (_, i) => i);
  const yTicks = Array.from({ length: Math.floor(width) + 1 }, (_, i) => i);
  const isCompact = geometry.stageWidth < 640;
  const rulerOffset = isCompact ? 24 : 34;
  const tickOffset = isCompact ? 30 : 42;
  const labelY = geometry.planY - (isCompact ? 18 : 24);
  const lengthLabelWidth = isCompact ? 118 : 170;
  const lengthLabelX = geometry.planX + geometry.planWidth - lengthLabelWidth;
  return (
    <Group listening={false}>
      <Line points={[geometry.planX, geometry.planY - rulerOffset, geometry.planX + geometry.planWidth, geometry.planY - rulerOffset]} stroke="#93c5fd" strokeWidth={1.2} />
      {xTicks.map((tick) => {
        const x = geometry.planX + metersToPx(tick, geometry);
        return (
          <Group key={`x-${tick}`}>
            <Line points={[x, geometry.planY - tickOffset, x, geometry.planY - (isCompact ? 18 : 26)]} stroke="#dbeafe" strokeWidth={1} />
            <Text x={x - 18} y={labelY} width={36} align="center" text={`${tick}m`} fill="#dbeafe" fontSize={isCompact ? 9 : 11} fontStyle="bold" />
          </Group>
        );
      })}
      <Line points={[geometry.planX - rulerOffset, geometry.planY, geometry.planX - rulerOffset, geometry.planY + geometry.planHeight]} stroke="#93c5fd" strokeWidth={1.2} />
      {yTicks.map((tick) => {
        const y = geometry.planY + metersToPx(tick, geometry);
        return (
          <Group key={`y-${tick}`}>
            <Line points={[geometry.planX - tickOffset, y, geometry.planX - (isCompact ? 18 : 26), y]} stroke="#dbeafe" strokeWidth={1} />
            <Text x={geometry.planX - (isCompact ? 52 : 74)} y={y - 6} width={isCompact ? 26 : 34} align="right" text={`${tick}m`} fill="#dbeafe" fontSize={isCompact ? 9 : 11} fontStyle="bold" />
          </Group>
        );
      })}
      <Rect x={lengthLabelX} y={geometry.planY - (isCompact ? 54 : 60)} width={lengthLabelWidth} height={isCompact ? 20 : 24} fill="rgba(30,64,175,0.32)" stroke="#60a5fa" strokeWidth={1} cornerRadius={999} />
      <Text x={lengthLabelX + 8} y={geometry.planY - (isCompact ? 49 : 54)} width={lengthLabelWidth - 16} align="center" text={isCompact ? `Largo ${formatMeters(length)}` : `LARGO REAL: ${formatMeters(length)}`} fill="#dbeafe" fontSize={isCompact ? 9 : 11} fontStyle="bold" />
      <Rect x={geometry.planX + 8} y={geometry.planY + 8} width={isCompact ? 92 : 132} height={isCompact ? 20 : 24} fill="rgba(30,64,175,0.32)" stroke="#60a5fa" strokeWidth={1} cornerRadius={999} />
      <Text x={geometry.planX + 14} y={geometry.planY + (isCompact ? 13 : 14)} width={isCompact ? 80 : 120} text={isCompact ? `Ancho ${formatMeters(width)}` : `ANCHO REAL: ${formatMeters(width)}`} fill="#dbeafe" fontSize={isCompact ? 9 : 11} fontStyle="bold" />
    </Group>
  );
};
