import type { LayoutItem } from '../../../../types';

const isOpening = (item: LayoutItem) => item.zone === 'edge' && ['base_door', 'additional_door', 'base_window_80x80', 'window_80x80', 'large_window'].includes(item.type);
const isDivision = (item: LayoutItem) => ['interior_room', 'full_bathroom', 'wall_partition'].includes(item.type);

export const boxesOverlap = (a: LayoutItem, b: LayoutItem, padding = 0.02) =>
  a.x + padding < b.x + b.width &&
  a.x + a.width > b.x + padding &&
  a.y + padding < b.y + b.height &&
  a.y + a.height > b.y + padding;

export const buildCadWarnings = (items: LayoutItem[]) => {
  const warnings: string[] = [];
  const openings = items.filter(isOpening);
  openings.forEach((item, index) => {
    openings.slice(index + 1).forEach((other) => {
      if (item.side === other.side && boxesOverlap(item, other, 0.05)) {
        warnings.push(`${item.label} y ${other.label} se solapan en el mismo muro.`);
      }
    });
  });

  items.filter(isDivision).forEach((item) => {
    if (item.type === 'full_bathroom' && Math.min(item.width, item.height) < 1.2) {
      warnings.push('El baño debería tener al menos 1,20 m de ancho útil.');
    }
    if (item.type === 'interior_room' && Math.min(item.width, item.height) < 1.5) {
      warnings.push('La habitación debería tener al menos 1,50 m de ancho útil.');
    }
  });

  return [...new Set(warnings)].slice(0, 5);
};
