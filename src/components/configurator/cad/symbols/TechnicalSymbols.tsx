import { Circle, Ellipse, Group, Line, Path, Rect, Text } from 'react-konva';

type Rotation = 0 | 90 | 180 | 270;

const RotatableGroup = ({ x, y, width, height, rotation = 0, children }: { x: number; y: number; width: number; height: number; rotation?: Rotation; children: React.ReactNode }) => {
  const cx = x + width / 2;
  const cy = y + height / 2;
  return (
    <Group x={cx} y={cy} rotation={rotation} offsetX={width / 2} offsetY={height / 2}>
      <Group>{children}</Group>
    </Group>
  );
};

export const ElectricalPanelSymbol = ({ x, y, width, height, color }: { x: number; y: number; width: number; height: number; color: string }) => (
  <Group>
    <Rect x={x} y={y} width={width} height={height} stroke={color} strokeWidth={2.5} cornerRadius={3} />
    <Line points={[x + width * 0.15, y + height * 0.35, x + width * 0.85, y + height * 0.35]} stroke={color} strokeWidth={1.5} />
    <Text x={x} y={y + height * 0.55} width={width} align="center" text="CE" fontSize={Math.max(9, height * 0.25)} fontStyle="bold" fill={color} />
  </Group>
);

export const AirConditioningSymbol = ({ x, y, width, height, color }: { x: number; y: number; width: number; height: number; color: string }) => (
  <Group>
    <Rect x={x} y={y} width={width} height={height} stroke={color} strokeWidth={2.5} cornerRadius={4} />
    <Line points={[x + width * 0.15, y + height * 0.52, x + width * 0.85, y + height * 0.52]} stroke={color} strokeWidth={1.5} />
    <Text x={x} y={y + height * 0.58} width={width} align="center" text="A/A" fontSize={Math.max(9, height * 0.25)} fontStyle="bold" fill={color} />
  </Group>
);

export const ToiletSymbol = ({ x, y, width, height, color, rotation = 0 }: { x: number; y: number; width: number; height: number; color: string; rotation?: Rotation }) => (
  <RotatableGroup x={x} y={y} width={width} height={height} rotation={rotation}>
    <Rect x={x + width * 0.18} y={y + height * 0.05} width={width * 0.64} height={height * 0.22} stroke={color} strokeWidth={2} cornerRadius={4} />
    <Ellipse x={x + width * 0.5} y={y + height * 0.58} radiusX={width * 0.32} radiusY={height * 0.28} stroke={color} strokeWidth={2.2} />
    <Text x={x} y={y + height * 0.38} width={width} align="center" text="WC" fontSize={Math.max(9, Math.min(width, height) * 0.22)} fontStyle="bold" fill={color} />
  </RotatableGroup>
);

export const SinkSymbol = ({ x, y, width, height, color, rotation = 0 }: { x: number; y: number; width: number; height: number; color: string; rotation?: Rotation }) => (
  <RotatableGroup x={x} y={y} width={width} height={height} rotation={rotation}>
    <Ellipse x={x + width * 0.5} y={y + height * 0.46} radiusX={width * 0.38} radiusY={height * 0.3} stroke={color} strokeWidth={2.2} />
    <Circle x={x + width * 0.5} y={y + height * 0.46} radius={Math.max(2, Math.min(width, height) * 0.06)} fill={color} />
    <Line points={[x + width * 0.5, y + height * 0.12, x + width * 0.5, y + height * 0.3]} stroke={color} strokeWidth={2} />
    <Text x={x} y={y + height * 0.72} width={width} align="center" text="LV" fontSize={Math.max(8, Math.min(width, height) * 0.2)} fontStyle="bold" fill={color} />
  </RotatableGroup>
);

export const ShowerTraySymbol = ({ x, y, width, height, color, rotation = 0 }: { x: number; y: number; width: number; height: number; color: string; rotation?: Rotation }) => (
  <RotatableGroup x={x} y={y} width={width} height={height} rotation={rotation}>
    <Rect x={x} y={y} width={width} height={height} stroke={color} strokeWidth={2.4} cornerRadius={6} />
    <Line points={[x + width * 0.12, y + height * 0.2, x + width * 0.88, y + height * 0.8]} stroke={color} strokeWidth={1.3} dash={[4, 4]} />
    <Line points={[x + width * 0.88, y + height * 0.2, x + width * 0.12, y + height * 0.8]} stroke={color} strokeWidth={1.3} dash={[4, 4]} />
    <Circle x={x + width * 0.5} y={y + height * 0.5} radius={Math.max(3, Math.min(width, height) * 0.06)} stroke={color} strokeWidth={2} />
    <Text x={x} y={y + height * 0.08} width={width} align="center" text="DUCHA" fontSize={Math.max(8, Math.min(width, height) * 0.13)} fontStyle="bold" fill={color} />
  </RotatableGroup>
);

export const BathroomFixtures = ({ x, y, width, height, color }: { x: number; y: number; width: number; height: number; color: string }) => (
  <Group>
    <Ellipse x={x + width * 0.25} y={y + height * 0.35} radiusX={width * 0.08} radiusY={height * 0.12} stroke={color} strokeWidth={2} />
    <Rect x={x + width * 0.62} y={y + height * 0.58} width={width * 0.23} height={height * 0.22} stroke={color} strokeWidth={2} cornerRadius={4} />
    <Circle x={x + width * 0.47} y={y + height * 0.5} radius={Math.min(width, height) * 0.045} stroke={color} strokeWidth={2} />
    <Path data={`M ${x + width * 0.12} ${y + height * 0.88} C ${x + width * 0.2} ${y + height * 0.7}, ${x + width * 0.34} ${y + height * 0.7}, ${x + width * 0.42} ${y + height * 0.88}`} stroke={color} strokeWidth={2} />
    <Text x={x + 8} y={y + 8} text="BAÑO" fontSize={12} fontStyle="bold" fill="#ccfbf1" />
    <Text x={x + width - 54} y={y + 8} text="V 40" fontSize={9} fontStyle="bold" fill="#7dd3fc" />
  </Group>
);

export const RoomDetails = ({ x, y, width, height, color }: { x: number; y: number; width: number; height: number; color: string }) => (
  <Group>
    <Text x={x + 8} y={y + 8} text="HABITACIÓN" fontSize={12} fontStyle="bold" fill="#f8fafc" />
    <Line points={[x + width * 0.1, y + height, x + width * 0.25, y + height - Math.min(45, height * 0.35)]} stroke={color} strokeWidth={2} />
    <Rect x={x + width * 0.58} y={y} width={Math.max(28, width * 0.16)} height={5} fill="#7dd3fc" />
    <Circle x={x + width * 0.45} y={y + height * 0.54} radius={7} stroke="#fbbf24" strokeWidth={2} />
    <Text x={x + width * 0.72} y={y + height * 0.65} text="T" fontSize={10} fontStyle="bold" fill={color} />
  </Group>
);
