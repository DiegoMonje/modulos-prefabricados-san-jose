import { Group, Rect, Text } from 'react-konva';
import type { LayoutItem } from '../../../types';
import { itemToBox, type PlanGeometry } from './utils/coordinates';
import { formatCurrency, getItemPrice } from '../../../utils/pricing';

export const CadSelectionLayer = ({ selectedItem, geometry }: { selectedItem: LayoutItem | null; geometry: PlanGeometry }) => {
  if (!selectedItem) return null;
  const box = itemToBox(selectedItem, geometry);
  const price = selectedItem.included ? 'Incluido' : getItemPrice(selectedItem) > 0 ? `+ ${formatCurrency(getItemPrice(selectedItem))}` : 'Sin coste';
  return (
    <Group listening={false}>
      <Rect x={box.x + box.width / 2 - 46} y={box.y + box.height + 8} width={92} height={22} fill={selectedItem.included ? '#064e3b' : '#7c2d12'} cornerRadius={8} />
      <Text x={box.x + box.width / 2 - 46} y={box.y + box.height + 13} width={92} align="center" text={price} fontSize={10} fontStyle="bold" fill="#fff" />
    </Group>
  );
};
