import { Group, Rect, Text } from 'react-konva';
import type { EdgeSide, LayoutItem } from '../../../types';
import { itemToBox, type PlanGeometry } from './utils/coordinates';
import { formatCurrency, getItemPrice } from '../../../utils/pricing';

const sideLabel: Record<EdgeSide, string> = {
  top: 'Pared norte',
  right: 'Pared este',
  bottom: 'Pared sur',
  left: 'Pared oeste',
};

export const CadSelectionLayer = ({ selectedItem, geometry }: { selectedItem: LayoutItem | null; geometry: PlanGeometry }) => {
  if (!selectedItem) return null;

  const box = itemToBox(selectedItem, geometry);
  const itemPrice = getItemPrice(selectedItem);
  const price = selectedItem.included ? 'Incluido de serie' : itemPrice > 0 ? `Extra + ${formatCurrency(itemPrice)}` : 'Sin coste añadido';
  const placement = selectedItem.side ? sideLabel[selectedItem.side] : selectedItem.parentId ? 'Interior del baño' : 'Interior del módulo';
  const title = selectedItem.label.length > 26 ? `${selectedItem.label.slice(0, 25)}…` : selectedItem.label;
  const panelWidth = 210;
  const panelHeight = 66;
  const panelX = Math.max(12, Math.min(geometry.stageWidth - panelWidth - 12, box.x + box.width / 2 - panelWidth / 2));
  const panelY = Math.max(18, box.y - panelHeight - 12);

  return (
    <Group listening={false}>
      <Rect x={panelX} y={panelY} width={panelWidth} height={panelHeight} fill="#020617" cornerRadius={12} stroke="#fb923c" strokeWidth={1.5} shadowColor="#000" shadowBlur={18} shadowOpacity={0.35} />
      <Text x={panelX + 12} y={panelY + 10} width={panelWidth - 24} text={title} fontSize={12} fontStyle="bold" fill="#f8fafc" />
      <Text x={panelX + 12} y={panelY + 29} width={panelWidth - 24} text={placement} fontSize={10} fontStyle="bold" fill="#93c5fd" />
      <Text x={panelX + 12} y={panelY + 46} width={panelWidth - 24} text={`${selectedItem.width.toFixed(2)} x ${selectedItem.height.toFixed(2)} m · ${price}`} fontSize={10} fontStyle="bold" fill={selectedItem.included ? '#86efac' : '#fed7aa'} />
      <Rect x={box.x + box.width / 2 - 5} y={panelY + panelHeight - 1} width={10} height={10} fill="#020617" stroke="#fb923c" strokeWidth={1} rotation={45} />
    </Group>
  );
};
