import { Arc, Group, Line } from 'react-konva';
import type { DoorSwing, EdgeSide } from '../../../../types';

const rotationForSide = (side?: EdgeSide) => {
  if (side === 'right') return 90;
  if (side === 'bottom') return 180;
  if (side === 'left') return 270;
  return 0;
};

export const DoorSymbol = ({
  x,
  y,
  width,
  height,
  color,
  side,
  swing = 'in',
  rotation,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  side?: EdgeSide;
  swing?: DoorSwing;
  rotation?: 0 | 90 | 180 | 270;
}) => {
  const size = Math.max(width, height, 32);
  const finalRotation = side ? rotationForSide(side) : rotation ?? 0;
  const swingDirection = swing === 'out' ? -1 : 1;

  return (
    <Group x={x} y={y} rotation={finalRotation} offsetX={finalRotation === 90 || finalRotation === 180 ? size : 0} offsetY={finalRotation === 180 || finalRotation === 270 ? size : 0}>
      <Line points={[0, 0, size, 0]} stroke={color} strokeWidth={4} lineCap="round" />
      <Line points={[0, 0, 0, size * swingDirection]} stroke={color} strokeWidth={4} lineCap="round" />
      <Arc x={0} y={0} innerRadius={size - 2} outerRadius={size - 1} angle={90 * swingDirection} rotation={0} stroke={color} strokeWidth={2} dash={[6, 5]} />
    </Group>
  );
};
