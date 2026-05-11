import type { LayoutItem } from '../../../../types';

export type CadValidationSeverity = 'error' | 'warning';

export interface CadValidationIssue {
  id: string;
  severity: CadValidationSeverity;
  message: string;
  itemId?: string;
  relatedItemId?: string;
}

const OPENING_TYPES = ['base_door', 'additional_door', 'base_window_80x80', 'window_80x80', 'large_window', 'bathroom_window_40x40'];
const DIVISION_TYPES = ['interior_room', 'full_bathroom', 'wall_partition'];
const TECHNICAL_INSIDE_TYPES = ['base_socket', 'additional_socket', 'base_light_point', 'additional_light_point', 'base_electrical_panel', 'air_conditioning', 'toilet', 'sink', 'shower_tray'];
const MIN_OPENING_DISTANCE_TO_CORNER = 0.2;

const isOpening = (item: LayoutItem) => item.zone === 'edge' && OPENING_TYPES.includes(item.type);
const isDivision = (item: LayoutItem) => DIVISION_TYPES.includes(item.type);
const isTechnicalInsideItem = (item: LayoutItem) => item.zone === 'inside' && TECHNICAL_INSIDE_TYPES.includes(item.type);
const isInteriorDoor = (item: LayoutItem) => item.type === 'interior_door';

export const boxesOverlap = (a: LayoutItem, b: LayoutItem, padding = 0.02) =>
  a.x + padding < b.x + b.width &&
  a.x + a.width > b.x + padding &&
  a.y + padding < b.y + b.height &&
  a.y + a.height > b.y + padding;

const issueKey = (prefix: string, item: LayoutItem, other?: LayoutItem) => `${prefix}-${item.id}${other ? `-${other.id}` : ''}`;

const isItemInsideModule = (item: LayoutItem, length: number, width: number) =>
  item.x >= -0.01 &&
  item.y >= -0.01 &&
  item.x + item.width <= length + 0.01 &&
  item.y + item.height <= width + 0.01;

const openingDistanceToNearestCorner = (item: LayoutItem, length: number, width: number) => {
  if (item.side === 'top' || item.side === 'bottom') {
    return Math.min(item.x, Math.max(0, length - (item.x + item.width)));
  }
  if (item.side === 'left' || item.side === 'right') {
    return Math.min(item.y, Math.max(0, width - (item.y + item.height)));
  }
  return Infinity;
};

const isDoorCloseToPartition = (door: LayoutItem, partition: LayoutItem) => {
  const doorCenterX = door.x + door.width / 2;
  const doorCenterY = door.y + door.height / 2;
  const partitionCenterX = partition.x + partition.width / 2;
  const partitionCenterY = partition.y + partition.height / 2;
  const horizontalPartition = partition.width >= partition.height;

  if (horizontalPartition) {
    return door.x < partition.x + partition.width && door.x + door.width > partition.x && Math.abs(doorCenterY - partitionCenterY) < 0.25;
  }

  return door.y < partition.y + partition.height && door.y + door.height > partition.y && Math.abs(doorCenterX - partitionCenterX) < 0.25;
};

export const validateCadLayout = (items: LayoutItem[], length: number, width: number): CadValidationIssue[] => {
  const issues: CadValidationIssue[] = [];

  items.forEach((item) => {
    if (!isItemInsideModule(item, length, width)) {
      issues.push({
        id: issueKey('outside', item),
        severity: 'error',
        itemId: item.id,
        message: `${item.label} queda fuera de los límites del módulo.`,
      });
    }
  });

  const openings = items.filter(isOpening);
  openings.forEach((item, index) => {
    openings.slice(index + 1).forEach((other) => {
      if (item.side === other.side && boxesOverlap(item, other, 0.05)) {
        issues.push({
          id: issueKey('opening-overlap', item, other),
          severity: 'error',
          itemId: item.id,
          relatedItemId: other.id,
          message: `${item.label} y ${other.label} se solapan en el mismo muro.`,
        });
      }
    });

    if (openingDistanceToNearestCorner(item, length, width) < MIN_OPENING_DISTANCE_TO_CORNER) {
      issues.push({
        id: issueKey('opening-corner', item),
        severity: 'warning',
        itemId: item.id,
        message: `${item.label} está muy cerca de una esquina. Revisa si deja margen suficiente para fabricación y montaje.`,
      });
    }
  });

  const divisions = items.filter(isDivision);
  divisions.forEach((item, index) => {
    divisions.slice(index + 1).forEach((other) => {
      if (boxesOverlap(item, other, 0.04)) {
        issues.push({
          id: issueKey('division-overlap', item, other),
          severity: 'error',
          itemId: item.id,
          relatedItemId: other.id,
          message: `${item.label} y ${other.label} se solapan en el interior del módulo.`,
        });
      }
    });

    if (item.type === 'full_bathroom' && Math.min(item.width, item.height) < 1.2) {
      issues.push({
        id: issueKey('bathroom-size', item),
        severity: 'error',
        itemId: item.id,
        message: 'El baño debería tener al menos 1,20 m de ancho útil.',
      });
    }

    if (item.type === 'interior_room' && Math.min(item.width, item.height) < 1.5) {
      issues.push({
        id: issueKey('room-size', item),
        severity: 'warning',
        itemId: item.id,
        message: 'La habitación debería tener al menos 1,50 m de ancho útil.',
      });
    }
  });

  const interiorDoors = items.filter(isInteriorDoor);
  const partitions = items.filter((item) => item.type === 'wall_partition' || item.type === 'interior_room' || item.type === 'full_bathroom');
  interiorDoors.forEach((door) => {
    const hasPartition = partitions.some((partition) => isDoorCloseToPartition(door, partition));
    if (!hasPartition) {
      issues.push({
        id: issueKey('interior-door-floating', door),
        severity: 'warning',
        itemId: door.id,
        message: `${door.label} debería colocarse sobre un tabique o pared interior.`,
      });
    }
  });

  const technicalItems = items.filter(isTechnicalInsideItem);
  technicalItems.forEach((item) => {
    divisions.forEach((division) => {
      if (item.id !== division.id && boxesOverlap(item, division, 0.01)) {
        issues.push({
          id: issueKey('technical-over-division', item, division),
          severity: 'warning',
          itemId: item.id,
          relatedItemId: division.id,
          message: `${item.label} coincide con ${division.label}. Revisa su ubicación técnica.`,
        });
      }
    });
  });

  return issues.filter((issue, index, all) => all.findIndex((candidate) => candidate.id === issue.id) === index);
};

export const buildCadWarnings = (items: LayoutItem[], length?: number, width?: number) => {
  const issues = typeof length === 'number' && typeof width === 'number'
    ? validateCadLayout(items, length, width)
    : validateCadLayout(items, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);

  return issues.map((issue) => issue.message).slice(0, 8);
};
