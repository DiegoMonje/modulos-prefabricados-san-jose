import { Rect } from 'react-konva';
import type { PlanGeometry } from './utils/coordinates';

export const CadWalls = ({ geometry }: { geometry: PlanGeometry }) => (
  <Rect
    x={geometry.planX}
    y={geometry.planY}
    width={geometry.planWidth}
    height={geometry.planHeight}
    stroke="#e2e8f0"
    strokeWidth={10}
    shadowColor="#000"
    shadowBlur={12}
    shadowOpacity={0.25}
    listening={false}
  />
);
