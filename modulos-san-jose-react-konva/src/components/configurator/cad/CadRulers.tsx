import { Group, Line, Text } from 'react-konva';
import { metersToPx, type PlanGeometry } from './utils/coordinates';

const formatMeters = (value: number) => `${value.toLocaleString('es-ES', { maximumFractionDigits: 2 })} m`;

export const CadRulers = ({ geometry, length, width }: { geometry: PlanGeometry; length: number; width: number }) => {
  const xTicks = Array.from({ length: Math.floor(length) + 1 }, (_, i) => i);
  const yTicks = Array.from({ length: Math.floor(width) + 1 }, (_, i) => i);
  return (
    <Group listening={false}>
      <Line points={[geometry.planX, geometry.planY - 34, geometry.planX + geometry.planWidth, geometry.planY - 34]} stroke="#94a3b8" strokeWidth={1} />
      {xTicks.map((tick) => {
        const x = geometry.planX + metersToPx(tick, geometry);
        return (
          <Group key={`x-${tick}`}>
            <Line points={[x, geometry.planY - 42, x, geometry.planY - 26]} stroke="#cbd5e1" strokeWidth={1} />
            <Text x={x - 18} y={geometry.planY - 24} width={36} align="center" text={`${tick}m`} fill="#bfdbfe" fontSize={11} fontStyle="bold" />
          </Group>
        );
      })}
      <Line points={[geometry.planX - 34, geometry.planY, geometry.planX - 34, geometry.planY + geometry.planHeight]} stroke="#94a3b8" strokeWidth={1} />
      {yTicks.map((tick) => {
        const y = geometry.planY + metersToPx(tick, geometry);
        return (
          <Group key={`y-${tick}`}>
            <Line points={[geometry.planX - 42, y, geometry.planX - 26, y]} stroke="#cbd5e1" strokeWidth={1} />
            <Text x={geometry.planX - 74} y={y - 6} width={34} align="right" text={`${tick}m`} fill="#bfdbfe" fontSize={11} fontStyle="bold" />
          </Group>
        );
      })}
      <Text x={geometry.planX + geometry.planWidth - 170} y={geometry.planY - 58} text={`LARGO REAL: ${formatMeters(length)}`} fill="#bfdbfe" fontSize={12} fontStyle="bold" />
      <Text x={geometry.planX + 8} y={geometry.planY + 10} text={`ANCHO REAL: ${formatMeters(width)}`} fill="#bfdbfe" fontSize={12} fontStyle="bold" />
    </Group>
  );
};
