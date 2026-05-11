import { Arc, Group, Line } from 'react-konva';
import type { DoorSwing, EdgeSide } from '../../../../types';

const rotationForSide = (side?: EdgeSide) => {
  if (side === 'right') return 90;
  if (side === 'bottom') return 180;
  if (side === 'left') return 270;
  return 0;
};

const effectiveRotation = (side?: EdgeSide, rotation?: 0 | 90 | 180 | 270) => side ? rotationForSide(side) : rotation ?? 0;

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
  const finalRotation = effectiveRotation(side, rotation);
  const openingLength = Math.max(width, height, 32);
  const thickness = Math.max(Math.min(width, height), 6);
  const swingSign = swing === 'out' ? -1 : 1;

  const horizontal = finalRotation === 0 || finalRotation === 180;
  const hingeAtEnd = finalRotation === 180 || finalRotation === 270;

  if (horizontal) {
    const wallY = y + height / 2;
    const hingeX = hingeAtEnd ? x + width : x;
    const leafEndX = hingeAtEnd ? hingeX - openingLength : hingeX + openingLength;
    const leafEndY = wallY + openingLength * swingSign;
    const arcRotation = hingeAtEnd ? 180 : 0;
    const arcAngle = 90 * swingSign;

    return (
      <Group>
        <Line points={[x, wallY, x + width, wallY]} stroke={color} strokeWidth={Math.max(3, thickness)} lineCap="round" />
        <Line points={[hingeX, wallY, leafEndX, leafEndY]} stroke={color} strokeWidth={3} lineCap="round" />
        <Arc x={hingeX} y={wallY} innerRadius={openingLength - 2} outerRadius={openingLength - 1} angle={arcAngle} rotation={arcRotation} stroke={color} strokeWidth={2} dash={[6, 5]} />
      </Group>
    );
  }

  const wallX = x + width / 2;
  const hingeY = hingeAtEnd ? y + height : y;
  const leafEndX = wallX - openingLength * swingSign;
  const leafEndY = hingeAtEnd ? hingeY - openingLength : hingeY + openingLength;
  const arcRotation = hingeAtEnd ? 270 : 90;
  const arcAngle = 90 * swingSign;

  return (
    <Group>
      <Line points={[wallX, y, wallX, y + height]} stroke={color} strokeWidth={Math.max(3, thickness)} lineCap="round" />
      <Line points={[wallX, hingeY, leafEndX, leafEndY]} stroke={color} strokeWidth={3} lineCap="round" />
      <Arc x={wallX} y={hingeY} innerRadius={openingLength - 2} outerRadius={openingLength - 1} angle={arcAngle} rotation={arcRotation} stroke={color} strokeWidth={2} dash={[6, 5]} />
    </Group>
  );
};
