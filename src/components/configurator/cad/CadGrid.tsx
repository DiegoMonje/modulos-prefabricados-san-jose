import { Group, Line, Rect } from 'react-konva';
import { GRID_MAJOR_METERS, GRID_MINOR_METERS, metersToPx, type PlanGeometry } from './utils/coordinates';

export const CadGrid = ({ geometry, length, width }: { geometry: PlanGeometry; length: number; width: number }) => {
  const verticalLines = Array.from({ length: Math.floor(length / GRID_MINOR_METERS) + 1 }, (_, i) => Number((i * GRID_MINOR_METERS).toFixed(2)));
  const horizontalLines = Array.from({ length: Math.floor(width / GRID_MINOR_METERS) + 1 }, (_, i) => Number((i * GRID_MINOR_METERS).toFixed(2)));
  return (
    <Group listening={false}>
      <Rect x={geometry.planX} y={geometry.planY} width={geometry.planWidth} height={geometry.planHeight} fill="#020617" />
      {verticalLines.map((meter) => {
        const x = geometry.planX + metersToPx(meter, geometry);
        const major = Math.abs(meter % GRID_MAJOR_METERS) < 0.001;
        return <Line key={`v-${meter}`} points={[x, geometry.planY, x, geometry.planY + geometry.planHeight]} stroke={major ? '#1d4ed8' : '#10233a'} strokeWidth={major ? 0.9 : 0.45} opacity={major ? 0.55 : 0.7} />;
      })}
      {horizontalLines.map((meter) => {
        const y = geometry.planY + metersToPx(meter, geometry);
        const major = Math.abs(meter % GRID_MAJOR_METERS) < 0.001;
        return <Line key={`h-${meter}`} points={[geometry.planX, y, geometry.planX + geometry.planWidth, y]} stroke={major ? '#1d4ed8' : '#10233a'} strokeWidth={major ? 0.9 : 0.45} opacity={major ? 0.55 : 0.7} />;
      })}
    </Group>
  );
};
