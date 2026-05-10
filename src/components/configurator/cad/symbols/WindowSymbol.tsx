import { Group, Line, Rect } from 'react-konva';

export const WindowSymbol = ({ x, y, width, height, color }: { x: number; y: number; width: number; height: number; color: string }) => {
  const vertical = height > width;
  return (
    <Group>
      <Rect x={x} y={y} width={width} height={height} fill="rgba(14,165,233,0.12)" stroke="rgba(186,230,253,0.45)" strokeWidth={1} />
      {vertical ? (
        <>
          <Line points={[x + width * 0.35, y, x + width * 0.35, y + height]} stroke={color} strokeWidth={3} />
          <Line points={[x + width * 0.65, y, x + width * 0.65, y + height]} stroke={color} strokeWidth={3} />
        </>
      ) : (
        <>
          <Line points={[x, y + height * 0.35, x + width, y + height * 0.35]} stroke={color} strokeWidth={3} />
          <Line points={[x, y + height * 0.65, x + width, y + height * 0.65]} stroke={color} strokeWidth={3} />
        </>
      )}
    </Group>
  );
};
