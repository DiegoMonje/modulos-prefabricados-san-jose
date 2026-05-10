import type { EdgeSide, LayoutItem } from '../../../../types';

export const GRID_STEP_METERS = 0.1;
export const GRID_MINOR_METERS = 0.5;
export const GRID_MAJOR_METERS = 1;

const OPENING_DEPTH = 0.1;
const WALL_PARTITION_THICKNESS = 0.08;
const MIN_BATHROOM_SIZE = 1.2;
const MAX_BATHROOM_LENGTH = 3.5;
const MAX_BATHROOM_WIDTH = 2.4;
const MIN_ROOM_DEPTH = 1.5;

export interface PlanGeometry {
  stageWidth: number;
  stageHeight: number;
  planX: number;
  planY: number;
  planWidth: number;
  planHeight: number;
  scale: number;
}

export const calculatePlanGeometry = (stageWidth: number, length: number, width: number, zoom = 1): PlanGeometry => {
  const safeLength = Math.max(length, 0.1);
  const safeWidth = Math.max(width, 0.1);
  const paddingLeft = 88;
  const paddingRight = 40;
  const paddingTop = 76;
  const paddingBottom = 76;
  const availableWidth = Math.max(420, stageWidth - paddingLeft - paddingRight);
  const planWidth = availableWidth * zoom;
  const scale = planWidth / safeLength;
  const planHeight = safeWidth * scale;
  return {
    stageWidth: Math.max(stageWidth, planWidth + paddingLeft + paddingRight),
    stageHeight: planHeight + paddingTop + paddingBottom,
    planX: paddingLeft,
    planY: paddingTop,
    planWidth,
    planHeight,
    scale,
  };
};

export const metersToPx = (meters: number, geometry: PlanGeometry) => meters * geometry.scale;
export const pxToMeters = (px: number, geometry: PlanGeometry) => px / geometry.scale;

export const itemToBox = (item: LayoutItem, geometry: PlanGeometry) => ({
  x: geometry.planX + metersToPx(item.x, geometry),
  y: geometry.planY + metersToPx(item.y, geometry),
  width: Math.max(metersToPx(item.width, geometry), 8),
  height: Math.max(metersToPx(item.height, geometry), 8),
});

export const snapMeters = (value: number, step = GRID_STEP_METERS) => Number((Math.round(value / step) * step).toFixed(2));
export const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const openingLengthFor = (item: LayoutItem) => {
  if (item.type === 'large_window') return 1.2;
  if (['base_door', 'additional_door', 'base_window_80x80', 'window_80x80'].includes(item.type)) return 0.8;
  return Math.max(item.width, item.height);
};

export const nearestEdgeSide = (x: number, y: number, itemWidth: number, itemHeight: number, length: number, width: number): EdgeSide => {
  const distances = {
    top: Math.abs(y),
    bottom: Math.abs(width - (y + itemHeight)),
    left: Math.abs(x),
    right: Math.abs(length - (x + itemWidth)),
  };
  return Object.entries(distances).sort((a, b) => a[1] - b[1])[0][0] as EdgeSide;
};

export const normalizeEdgeItem = (item: LayoutItem, x: number, y: number, length: number, width: number): LayoutItem => {
  const openingLength = openingLengthFor(item);
  const side = nearestEdgeSide(x, y, openingLength, OPENING_DEPTH, length, width);
  if (side === 'top') {
    return { ...item, x: clamp(snapMeters(x), 0, length - openingLength), y: 0, width: openingLength, height: OPENING_DEPTH, side, rotation: 0 };
  }
  if (side === 'bottom') {
    return { ...item, x: clamp(snapMeters(x), 0, length - openingLength), y: width - OPENING_DEPTH, width: openingLength, height: OPENING_DEPTH, side, rotation: 180 };
  }
  if (side === 'left') {
    return { ...item, x: 0, y: clamp(snapMeters(y), 0, width - openingLength), width: OPENING_DEPTH, height: openingLength, side, rotation: 270 };
  }
  return { ...item, x: length - OPENING_DEPTH, y: clamp(snapMeters(y), 0, width - openingLength), width: OPENING_DEPTH, height: openingLength, side, rotation: 90 };
};

export const clampInsideItem = (item: LayoutItem, x: number, y: number, length: number, width: number): LayoutItem => ({
  ...item,
  x: clamp(snapMeters(x), 0, Math.max(0, length - item.width)),
  y: clamp(snapMeters(y), 0, Math.max(0, width - item.height)),
});

export const normalizeBathroomChildItem = (item: LayoutItem, parent: LayoutItem, x: number, y: number): LayoutItem => {
  const childWidth = item.width;
  const childHeight = item.height;
  const minX = parent.x;
  const maxX = parent.x + parent.width - childWidth;
  const minY = parent.y;
  const maxY = parent.y + parent.height - childHeight;

  return {
    ...item,
    zone: 'inside',
    x: clamp(snapMeters(x), minX, Math.max(minX, maxX)),
    y: clamp(snapMeters(y), minY, Math.max(minY, maxY)),
  };
};

export const normalizeInsideItem = (item: LayoutItem, x: number, y: number, length: number, width: number): LayoutItem => {
  const snappedX = snapMeters(x);
  const snappedY = snapMeters(y);
  const orientation = item.orientation ?? 'transversal';

  if (item.type === 'wall_partition') {
    if (orientation === 'transversal') {
      return {
        ...item,
        orientation,
        x: 0,
        y: clamp(snappedY, 0, Math.max(0, width - WALL_PARTITION_THICKNESS)),
        width: length,
        height: WALL_PARTITION_THICKNESS,
        zone: 'inside',
      };
    }

    return {
      ...item,
      orientation,
      x: clamp(snappedX, 0, Math.max(0, length - WALL_PARTITION_THICKNESS)),
      y: 0,
      width: WALL_PARTITION_THICKNESS,
      height: width,
      zone: 'inside',
    };
  }

  if (item.type === 'interior_room') {
    if (orientation === 'transversal') {
      const roomDepth = clamp(item.height || MIN_ROOM_DEPTH, MIN_ROOM_DEPTH, width);
      return {
        ...item,
        orientation,
        x: 0,
        y: clamp(snappedY, 0, Math.max(0, width - roomDepth)),
        width: length,
        height: roomDepth,
        zone: 'inside',
      };
    }

    const roomDepth = clamp(item.width || MIN_ROOM_DEPTH, MIN_ROOM_DEPTH, length);
    return {
      ...item,
      orientation,
      x: clamp(snappedX, 0, Math.max(0, length - roomDepth)),
      y: 0,
      width: roomDepth,
      height: width,
      zone: 'inside',
    };
  }

  if (item.type === 'full_bathroom') {
    const bathroomWidth = clamp(item.width || MIN_BATHROOM_SIZE, MIN_BATHROOM_SIZE, Math.min(MAX_BATHROOM_LENGTH, length));
    const bathroomHeight = clamp(item.height || MIN_BATHROOM_SIZE, MIN_BATHROOM_SIZE, Math.min(MAX_BATHROOM_WIDTH, width));
    return {
      ...item,
      orientation,
      x: clamp(snappedX, 0, Math.max(0, length - bathroomWidth)),
      y: clamp(snappedY, 0, Math.max(0, width - bathroomHeight)),
      width: bathroomWidth,
      height: bathroomHeight,
      zone: 'inside',
    };
  }

  return clampInsideItem(item, x, y, length, width);
};
