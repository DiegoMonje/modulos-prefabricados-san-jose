import { Circle, Group, Line } from 'react-konva';

export const LightSymbol = ({ x, y, width, height, color }: { x: number; y: number; width: number; height: number; color: string }) => {
  const r = Math.min(width, height) / 2;
  const cx = x + width / 2;
  const cy = y + height / 2;
  return (
    <Group>
      <Circle x={cx} y={cy} radius={r * 0.75} stroke={color} strokeWidth={2} />
      <Line points={[cx - r * 0.48, cy - r * 0.48, cx + r * 0.48, cy + r * 0.48]} stroke={color} strokeWidth={2} />
      <Line points={[cx + r * 0.48, cy - r * 0.48, cx - r * 0.48, cy + r * 0.48]} stroke={color} strokeWidth={2} />
    </Group>
  );
};
