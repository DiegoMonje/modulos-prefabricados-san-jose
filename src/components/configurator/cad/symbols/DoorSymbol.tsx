import { Arc, Group, Line } from 'react-konva';
import type { EdgeSide } from '../../../../types';

const rotationForSide = (side?: EdgeSide) => {
  if (side === 'right') return 90;
  if (side === 'bottom') return 180;
  if (side === 'left') return 270;
  return 0;
};

export const DoorSymbol = ({ x, y, width, height, color, side }: { x: number; y: number; width: number; height: number; color: string; side?: EdgeSide }) => {
  const size = Math.max(width, height, 32);
  const rotation = rotationForSide(side);
  return (
    <Group x={x} y={y} rotation={rotation} offsetX={rotation === 90 || rotation === 180 ? size : 0} offsetY={rotation === 180 || rotation === 270 ? size : 0}>
      <Line points={[0, 0, size, 0]} stroke={color} strokeWidth={4} lineCap="round" />
      <Line points={[0, 0, 0, size]} stroke={color} strokeWidth={4} lineCap="round" />
      <Arc x={0} y={0} innerRadius={size - 2} outerRadius={size - 1} angle={90} rotation={0} stroke={color} strokeWidth={2} dash={[6, 5]} />
    </Group>
  );
};
