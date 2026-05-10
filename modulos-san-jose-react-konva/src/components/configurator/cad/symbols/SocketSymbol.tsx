import { Circle, Group, Line } from 'react-konva';

export const SocketSymbol = ({ x, y, width, height, color }: { x: number; y: number; width: number; height: number; color: string }) => {
  const r = Math.min(width, height) / 2;
  const cx = x + width / 2;
  const cy = y + height / 2;
  return (
    <Group>
      <Circle x={cx} y={cy} radius={r * 0.75} stroke={color} strokeWidth={2} />
      <Line points={[cx - r * 0.5, cy, cx + r * 0.5, cy]} stroke={color} strokeWidth={2} />
      <Circle x={cx - r * 0.25} y={cy - r * 0.25} radius={2} fill={color} />
      <Circle x={cx + r * 0.25} y={cy - r * 0.25} radius={2} fill={color} />
    </Group>
  );
};
