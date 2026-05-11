import { Group, Rect } from 'react-konva';
import type { LayoutItem } from '../../../types';
import type { PlanGeometry } from './utils/coordinates';
import { itemToBox, pxToMeters } from './utils/coordinates';
import { DoorSymbol } from './symbols/DoorSymbol';
import { WindowSymbol } from './symbols/WindowSymbol';
import { SocketSymbol } from './symbols/SocketSymbol';
import { LightSymbol } from './symbols/LightSymbol';
import { AirConditioningSymbol, BathroomFixtures, ElectricalPanelSymbol, RoomDetails, ShowerTraySymbol, SinkSymbol, ToiletSymbol } from './symbols/TechnicalSymbols';
import type { KonvaEventObject } from 'konva/lib/Node';

const colorFor = (item: LayoutItem, selected: boolean, hasError: boolean, hasWarning: boolean) => {
  if (hasError) return '#ef4444';
  if (hasWarning) return '#f59e0b';
  if (selected) return '#fb923c';
  if (item.type.includes('window')) return '#7dd3fc';
  if (item.type.includes('light')) return '#fbbf24';
  if (item.type.includes('socket')) return '#e2e8f0';
  if (['toilet', 'sink', 'shower_tray'].includes(item.type)) return '#67e8f9';
  if (item.type === 'air_conditioning') return '#c4b5fd';
  if (item.type === 'full_bathroom') return '#5eead4';
  return '#f8fafc';
};

const isDoor = (item: LayoutItem) => item.type === 'base_door' || item.type === 'additional_door' || item.type === 'bathroom_door';
const isWindow = (item: LayoutItem) => item.type === 'base_window_80x80' || item.type === 'window_80x80' || item.type === 'large_window' || item.type === 'bathroom_window_40x40';
const isLight = (item: LayoutItem) => item.type === 'base_light_point' || item.type === 'bathroom_light_point';
const isSocket = (item: LayoutItem) => item.type === 'base_socket' || item.type === 'additional_socket' || item.type === 'bathroom_socket';
const isDivision = (item: LayoutItem) => ['interior_room', 'full_bathroom', 'wall_partition'].includes(item.type);

const CadObjectSymbol = ({ item, selected, geometry, hasError, hasWarning }: { item: LayoutItem; selected: boolean; geometry: PlanGeometry; hasError: boolean; hasWarning: boolean }) => {
  const box = itemToBox(item, geometry);
  const color = colorFor(item, selected, hasError, hasWarning);

  if (isDoor(item)) return <DoorSymbol x={box.x} y={box.y} width={box.width} height={box.height} color={color} side={item.side} swing={item.doorSwing ?? 'in'} rotation={item.rotation} />;
  if (isWindow(item)) return <WindowSymbol x={box.x} y={box.y} width={box.width} height={box.height} color={color} />;
  if (isSocket(item)) return <SocketSymbol x={box.x} y={box.y} width={box.width} height={box.height} color={color} />;
  if (isLight(item)) return <LightSymbol x={box.x} y={box.y} width={box.width} height={box.height} color={color} />;
  if (item.type === 'base_electrical_panel') return <ElectricalPanelSymbol x={box.x} y={box.y} width={box.width} height={box.height} color={color} />;
  if (item.type === 'air_conditioning') return <AirConditioningSymbol x={box.x} y={box.y} width={box.width} height={box.height} color={color} />;
  if (item.type === 'toilet') return <ToiletSymbol x={box.x} y={box.y} width={box.width} height={box.height} color={color} rotation={item.rotation} />;
  if (item.type === 'sink') return <SinkSymbol x={box.x} y={box.y} width={box.width} height={box.height} color={color} rotation={item.rotation} />;
  if (item.type === 'shower_tray') return <ShowerTraySymbol x={box.x} y={box.y} width={box.width} height={box.height} color={color} rotation={item.rotation} />;
  if (item.type === 'wall_partition') return <Rect x={box.x} y={box.y} width={box.width} height={box.height} fill={color} opacity={0.95} shadowBlur={4} />;
  if (item.type === 'interior_room') {
    return (
      <Group>
        <Rect x={box.x} y={box.y} width={box.width} height={box.height} fill="rgba(15,23,42,0.32)" stroke={color} strokeWidth={selected || hasError || hasWarning ? 3 : 2} />
        <RoomDetails x={box.x} y={box.y} width={box.width} height={box.height} color={color} />
      </Group>
    );
  }
  if (item.type === 'full_bathroom') {
    return (
      <Group>
        <Rect x={box.x} y={box.y} width={box.width} height={box.height} fill="rgba(20,184,166,0.18)" stroke={color} strokeWidth={selected || hasError || hasWarning ? 3 : 2} />
        <BathroomFixtures x={box.x} y={box.y} width={box.width} height={box.height} color={color} />
      </Group>
    );
  }

  return <Rect x={box.x} y={box.y} width={box.width} height={box.height} stroke={color} />;
};

export const CadObjectsLayer = ({
  items,
  selectedItemId,
  geometry,
  errorItemIds = [],
  warningItemIds = [],
  onSelect,
  onMove,
}: {
  items: LayoutItem[];
  selectedItemId: string | null;
  geometry: PlanGeometry;
  errorItemIds?: string[];
  warningItemIds?: string[];
  onSelect: (id: string | null) => void;
  onMove: (id: string, x: number, y: number) => void;
}) => {
  const sortedItems = [...items].sort((a, b) => Number(isDivision(b)) - Number(isDivision(a)));

  return (
    <Group>
      {sortedItems.map((item) => {
        const box = itemToBox(item, geometry);
        const selected = selectedItemId === item.id;
        const hasError = errorItemIds.includes(item.id);
        const hasWarning = !hasError && warningItemIds.includes(item.id);

        const dragBoundFunc = (pos: { x: number; y: number }) => {
          const minDx = geometry.planX - box.x;
          const maxDx = geometry.planX + geometry.planWidth - (box.x + box.width);
          const minDy = geometry.planY - box.y;
          const maxDy = geometry.planY + geometry.planHeight - (box.y + box.height);

          return {
            x: Math.max(minDx, Math.min(maxDx, pos.x)),
            y: Math.max(minDy, Math.min(maxDy, pos.y)),
          };
        };

        return (
          <Group
            key={item.id}
            draggable
            dragBoundFunc={dragBoundFunc}
            onMouseDown={(event) => {
              event.cancelBubble = true;
              onSelect(item.id);
            }}
            onTouchStart={(event) => {
              event.cancelBubble = true;
              onSelect(item.id);
            }}
            onClick={(event) => {
              event.cancelBubble = true;
              onSelect(item.id);
            }}
            onTap={(event) => {
              event.cancelBubble = true;
              onSelect(item.id);
            }}
            onDragEnd={(event: KonvaEventObject<DragEvent>) => {
              const node = event.target;
              const newTopLeftPxX = box.x + node.x();
              const newTopLeftPxY = box.y + node.y();
              const x = pxToMeters(newTopLeftPxX - geometry.planX, geometry);
              const y = pxToMeters(newTopLeftPxY - geometry.planY, geometry);

              node.position({ x: 0, y: 0 });
              onMove(item.id, x, y);
            }}
          >
            <Rect x={box.x} y={box.y} width={Math.max(box.width, 30)} height={Math.max(box.height, 24)} fill="rgba(0,0,0,0.01)" />
            <CadObjectSymbol item={item} selected={selected} geometry={geometry} hasError={hasError} hasWarning={hasWarning} />
            {(selected || hasError || hasWarning) ? (
              <Group listening={false}>
                <Rect
                  x={box.x - 5}
                  y={box.y - 5}
                  width={box.width + 10}
                  height={box.height + 10}
                  stroke={hasError ? '#ef4444' : hasWarning ? '#f59e0b' : '#fb923c'}
                  strokeWidth={hasError || hasWarning ? 3 : 2}
                  dash={[7, 5]}
                  fill={hasError ? 'rgba(239,68,68,0.08)' : hasWarning ? 'rgba(245,158,11,0.08)' : 'rgba(251,146,60,0.08)'}
                />
              </Group>
            ) : null}
          </Group>
        );
      })}
    </Group>
  );
};
