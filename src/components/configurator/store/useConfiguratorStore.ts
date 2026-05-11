import { create } from 'zustand';
import type { ConfiguratorState, DeliveryTimeline, DivisionOrientation, LayoutItem, LayoutItemType, PanelChoice, UseType } from '../../../types';
import { createBaseLayoutItems, getDefaultItemSize, ITEM_LABELS, ITEM_PRICES } from '../../../utils/pricing';
import { normalizeBathroomChildItem, normalizeEdgeItem, normalizeInsideItem } from '../cad/utils/coordinates';

const initialConfig: ConfiguratorState = {
  length: 6,
  width: 2.4,
  widthOption: '2.40 m',
  customWidth: '',
  isSpecialMeasure: false,
  panelChoice: 'Panel sándwich blanco 30 mm',
  panelType: 'Panel sándwich',
  panelThickness: '30 mm',
  panelColor: 'Blanco',
  specialThickness: '',
  specialColor: '',
  isSpecialPanel: false,
  useType: 'Caseta de obra',
  province: '',
  city: '',
  postalCode: '',
  deliveryTimeline: 'Lo antes posible',
  layoutItems: createBaseLayoutItems(),
};

type Store = {
  config: ConfiguratorState;
  selectedItemId: string | null;
  undoStack: LayoutItem[][];
  redoStack: LayoutItem[][];
  setMeasure: (length: number, width: number, widthOption: ConfiguratorState['widthOption'], customWidth?: string) => void;
  setPanelChoice: (choice: PanelChoice, specialThickness?: string, specialColor?: string) => void;
  setUseType: (useType: UseType) => void;
  setLocation: (data: Partial<Pick<ConfiguratorState, 'province' | 'city' | 'postalCode' | 'deliveryTimeline'>>) => void;
  selectItem: (id: string | null) => void;
  addItem: (type: LayoutItemType) => void;
  updateItem: (id: string, patch: Partial<LayoutItem>, recordHistory?: boolean) => void;
  moveItem: (id: string, x: number, y: number) => void;
  removeSelected: () => void;
  rotateSelected: () => void;
  duplicateSelected: () => void;
  setDivisionOrientation: (id: string, orientation: DivisionOrientation) => void;
  resizeBathroom: (id: string, width: number, height: number) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
};

const cloneLayout = (items: LayoutItem[]) => items.map((item) => ({ ...item }));

const isEdgeType = (type: LayoutItemType) => ['base_door', 'additional_door', 'base_window_80x80', 'window_80x80', 'large_window'].includes(type);
const isDivisionType = (type: LayoutItemType) => ['wall_partition', 'interior_room', 'full_bathroom'].includes(type);
const isBathroomChildType = (type: LayoutItemType) => ['bathroom_door', 'bathroom_window_40x40', 'bathroom_light_point', 'bathroom_socket'].includes(type);

const duplicateTypeMap: Partial<Record<LayoutItemType, LayoutItemType>> = {
  base_door: 'additional_door',
  base_window_80x80: 'window_80x80',
  base_socket: 'additional_socket',
  additional_socket: 'additional_socket',
  additional_door: 'additional_door',
  window_80x80: 'window_80x80',
  large_window: 'large_window',
  wall_partition: 'wall_partition',
  interior_room: 'interior_room',
  full_bathroom: 'full_bathroom',
  toilet: 'toilet',
  sink: 'sink',
  shower_tray: 'shower_tray',
  air_conditioning: 'air_conditioning',
};

const normalizeItemForModule = (item: LayoutItem, x: number, y: number, length: number, width: number, items: LayoutItem[] = []) => {
  if (isBathroomChildType(item.type) && item.parentId) {
    const parent = items.find((candidate) => candidate.id === item.parentId);
    if (parent) return normalizeBathroomChildItem(item, parent, x, y);
  }

  return item.zone === 'edge'
    ? normalizeEdgeItem(item, x, y, length, width)
    : normalizeInsideItem(item, x, y, length, width);
};

const createBathroomChildren = (bathroom: LayoutItem): LayoutItem[] => [
  {
    id: `${bathroom.id}-door`,
    type: 'bathroom_door',
    label: ITEM_LABELS.bathroom_door,
    x: bathroom.x + 0.2,
    y: bathroom.y + bathroom.height - 0.08,
    width: 0.7,
    height: 0.08,
    rotation: 0,
    zone: 'inside',
    price: 0,
    included: true,
    parentId: bathroom.id,
    bathroomChildType: 'door',
  },
  {
    id: `${bathroom.id}-window`,
    type: 'bathroom_window_40x40',
    label: ITEM_LABELS.bathroom_window_40x40,
    x: bathroom.x + bathroom.width - 0.6,
    y: bathroom.y,
    width: 0.4,
    height: 0.08,
    rotation: 0,
    zone: 'inside',
    price: 0,
    included: true,
    parentId: bathroom.id,
    bathroomChildType: 'window',
  },
  {
    id: `${bathroom.id}-light`,
    type: 'bathroom_light_point',
    label: ITEM_LABELS.bathroom_light_point,
    x: bathroom.x + bathroom.width / 2 - 0.14,
    y: bathroom.y + bathroom.height / 2 - 0.14,
    width: 0.28,
    height: 0.28,
    rotation: 0,
    zone: 'inside',
    price: 0,
    included: true,
    parentId: bathroom.id,
    bathroomChildType: 'light',
  },
  {
    id: `${bathroom.id}-socket`,
    type: 'bathroom_socket',
    label: ITEM_LABELS.bathroom_socket,
    x: bathroom.x + 0.2,
    y: bathroom.y + 0.2,
    width: 0.28,
    height: 0.28,
    rotation: 0,
    zone: 'inside',
    price: 0,
    included: true,
    parentId: bathroom.id,
    bathroomChildType: 'socket',
  },
];

const normalizeBathroomChildrenForParent = (items: LayoutItem[], bathroom: LayoutItem) =>
  items.map((item) => {
    if (item.parentId !== bathroom.id) return item;
    return normalizeBathroomChildItem(item, bathroom, item.x, item.y);
  });

export const useConfiguratorStore = create<Store>((set, get) => ({
  config: initialConfig,
  selectedItemId: null,
  undoStack: [],
  redoStack: [],
  setMeasure: (length, width, widthOption, customWidth = '') => {
    set((state) => {
      let normalizedItems = state.config.layoutItems.map((item) => normalizeItemForModule(item, item.x, item.y, length, width, state.config.layoutItems));
      normalizedItems
        .filter((item) => item.type === 'full_bathroom')
        .forEach((bathroom) => {
          normalizedItems = normalizeBathroomChildrenForParent(normalizedItems, bathroom);
        });
      return {
        config: {
          ...state.config,
          length,
          width,
          widthOption,
          customWidth,
          isSpecialMeasure: length === 8 || widthOption === 'Otro ancho' || width < 2 || width > 3,
          layoutItems: normalizedItems,
        },
      };
    });
  },
  setPanelChoice: (choice, specialThickness = '', specialColor = '') => {
    let panelType = 'Panel sándwich';
    let panelThickness = '30 mm';
    let panelColor = 'Blanco';
    let isSpecialPanel = false;
    if (choice === 'Otro grosor de panel') {
      panelType = 'Panel sándwich especial';
      panelThickness = specialThickness;
      isSpecialPanel = true;
    }
    if (choice === 'Otro color de panel') {
      panelType = 'Panel sándwich especial';
      panelColor = specialColor;
      isSpecialPanel = true;
    }
    if (choice === 'Otro grosor y otro color') {
      panelType = 'Panel sándwich especial';
      panelThickness = specialThickness;
      panelColor = specialColor;
      isSpecialPanel = true;
    }
    set((state) => ({
      config: { ...state.config, panelChoice: choice, panelType, panelThickness, panelColor, specialThickness, specialColor, isSpecialPanel },
    }));
  },
  setUseType: (useType) => set((state) => ({ config: { ...state.config, useType } })),
  setLocation: (data) => set((state) => ({ config: { ...state.config, ...data } })),
  selectItem: (id) => set({ selectedItemId: id }),
  addItem: (type) => {
    const { config } = get();
    const size = getDefaultItemSize(type);
    const index = config.layoutItems.filter((item) => item.type === type).length;
    const draft: LayoutItem = {
      id: crypto.randomUUID(),
      type,
      label: ITEM_LABELS[type],
      x: isEdgeType(type) ? 0.6 + index * 0.5 : Math.min(0.6 + index * 0.35, Math.max(0, config.length - size.width)),
      y: isEdgeType(type) ? 0 : Math.min(0.5 + index * 0.2, Math.max(0, config.width - size.height)),
      width: size.width,
      height: size.height,
      rotation: 0,
      zone: isEdgeType(type) ? 'edge' : 'inside',
      side: isEdgeType(type) ? 'top' : undefined,
      price: ITEM_PRICES[type],
      included: false,
      orientation: isDivisionType(type) ? 'transversal' : undefined,
      hasShowerTray: type === 'full_bathroom' ? true : undefined,
    };
    const normalized = normalizeItemForModule(draft, draft.x, draft.y, config.length, config.width, config.layoutItems);
    const children = type === 'full_bathroom' ? createBathroomChildren(normalized).map((child) => normalizeBathroomChildItem(child, normalized, child.x, child.y)) : [];
    set((state) => ({
      undoStack: [...state.undoStack.slice(-30), cloneLayout(state.config.layoutItems)],
      redoStack: [],
      selectedItemId: normalized.id,
      config: { ...state.config, layoutItems: [...state.config.layoutItems, normalized, ...children] },
    }));
  },
  updateItem: (id, patch, recordHistory = true) => {
    const { config } = get();
    set((state) => {
      let updatedParent: LayoutItem | null = null;
      let layoutItems = state.config.layoutItems.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, ...patch };
        const normalized = normalizeItemForModule(updated, updated.x, updated.y, state.config.length, state.config.width, state.config.layoutItems);
        if (normalized.type === 'full_bathroom') updatedParent = normalized;
        return normalized;
      });
      if (updatedParent) layoutItems = normalizeBathroomChildrenForParent(layoutItems, updatedParent);
      return {
        undoStack: recordHistory ? [...state.undoStack.slice(-30), cloneLayout(config.layoutItems)] : state.undoStack,
        redoStack: recordHistory ? [] : state.redoStack,
        config: { ...state.config, layoutItems },
      };
    });
  },
  moveItem: (id, x, y) => {
    const { config } = get();
    const before = cloneLayout(config.layoutItems);
    set((state) => {
      const current = state.config.layoutItems.find((item) => item.id === id);
      let dx = 0;
      let dy = 0;
      let movedParent: LayoutItem | undefined;

      let layoutItems = state.config.layoutItems.map((item) => {
        if (item.id !== id) return item;
        const normalized = normalizeItemForModule(item, x, y, state.config.length, state.config.width, state.config.layoutItems);
        if (item.type === 'full_bathroom' && current) {
          dx = normalized.x - current.x;
          dy = normalized.y - current.y;
          movedParent = normalized;
        }
        return normalized;
      });

      if (movedParent) {
        const bathroom = movedParent;
        layoutItems = layoutItems.map((item) => {
          if (item.parentId !== bathroom.id) return item;
          return normalizeBathroomChildItem(item, bathroom, item.x + dx, item.y + dy);
        });
      }

      return {
        undoStack: [...state.undoStack.slice(-30), before],
        redoStack: [],
        config: { ...state.config, layoutItems },
      };
    });
  },
  removeSelected: () => {
    const { selectedItemId, config } = get();
    if (!selectedItemId) return;
    const selected = config.layoutItems.find((item) => item.id === selectedItemId);
    if (!selected || selected.included) return;
    set((state) => ({
      undoStack: [...state.undoStack.slice(-30), cloneLayout(state.config.layoutItems)],
      redoStack: [],
      selectedItemId: null,
      config: { ...state.config, layoutItems: state.config.layoutItems.filter((item) => item.id !== selectedItemId && item.parentId !== selectedItemId) },
    }));
  },
  rotateSelected: () => {
    const { selectedItemId } = get();
    if (!selectedItemId) return;
    get().updateItem(selectedItemId, {}, true);
    set((state) => ({
      config: {
        ...state.config,
        layoutItems: state.config.layoutItems.map((item) => {
          if (item.id !== selectedItemId) return item;
          return normalizeItemForModule({ ...item, rotation: (((item.rotation + 90) % 360) as LayoutItem['rotation']) }, item.x, item.y, state.config.length, state.config.width, state.config.layoutItems);
        }),
      },
    }));
  },
  duplicateSelected: () => {
    const { selectedItemId, config } = get();
    if (!selectedItemId) return;
    const selected = config.layoutItems.find((item) => item.id === selectedItemId);
    if (!selected || isBathroomChildType(selected.type)) return;

    const duplicateType = duplicateTypeMap[selected.type];
    if (!duplicateType) return;

    const newId = crypto.randomUUID();
    const offsetX = selected.zone === 'edge' ? 0.5 : 0.25;
    const offsetY = selected.zone === 'edge' ? 0 : 0.25;
    const baseDuplicate: LayoutItem = {
      ...selected,
      id: newId,
      type: duplicateType,
      label: ITEM_LABELS[duplicateType],
      x: selected.x + offsetX,
      y: selected.y + offsetY,
      price: ITEM_PRICES[duplicateType],
      included: false,
      parentId: undefined,
      bathroomChildType: undefined,
    };

    const normalized = normalizeItemForModule(baseDuplicate, baseDuplicate.x, baseDuplicate.y, config.length, config.width, config.layoutItems);
    const children = duplicateType === 'full_bathroom' ? createBathroomChildren(normalized).map((child) => normalizeBathroomChildItem(child, normalized, child.x, child.y)) : [];

    set((state) => ({
      undoStack: [...state.undoStack.slice(-30), cloneLayout(state.config.layoutItems)],
      redoStack: [],
      selectedItemId: normalized.id,
      config: { ...state.config, layoutItems: [...state.config.layoutItems, normalized, ...children] },
    }));
  },
  setDivisionOrientation: (id, orientation) => {
    const { config } = get();
    set((state) => ({
      undoStack: [...state.undoStack.slice(-30), cloneLayout(config.layoutItems)],
      redoStack: [],
      config: {
        ...state.config,
        layoutItems: state.config.layoutItems.map((item) => {
          if (item.id !== id) return item;
          const oriented = { ...item, orientation };
          return normalizeItemForModule(oriented, oriented.x, oriented.y, state.config.length, state.config.width, state.config.layoutItems);
        }),
      },
    }));
  },
  resizeBathroom: (id, width, height) => {
    const { config } = get();
    set((state) => {
      let bathroom: LayoutItem | null = null;
      let layoutItems = state.config.layoutItems.map((item) => {
        if (item.id !== id || item.type !== 'full_bathroom') return item;
        const updated = normalizeItemForModule({ ...item, width, height }, item.x, item.y, state.config.length, state.config.width, state.config.layoutItems);
        bathroom = updated;
        return updated;
      });
      if (bathroom) layoutItems = normalizeBathroomChildrenForParent(layoutItems, bathroom);
      return {
        undoStack: [...state.undoStack.slice(-30), cloneLayout(config.layoutItems)],
        redoStack: [],
        config: { ...state.config, layoutItems },
      };
    });
  },
  undo: () => {
    const { undoStack, config } = get();
    if (!undoStack.length) return;
    const previous = undoStack[undoStack.length - 1];
    set((state) => ({
      undoStack: state.undoStack.slice(0, -1),
      redoStack: [...state.redoStack, cloneLayout(config.layoutItems)],
      selectedItemId: null,
      config: { ...state.config, layoutItems: cloneLayout(previous) },
    }));
  },
  redo: () => {
    const { redoStack, config } = get();
    if (!redoStack.length) return;
    const next = redoStack[redoStack.length - 1];
    set((state) => ({
      redoStack: state.redoStack.slice(0, -1),
      undoStack: [...state.undoStack, cloneLayout(config.layoutItems)],
      selectedItemId: null,
      config: { ...state.config, layoutItems: cloneLayout(next) },
    }));
  },
  reset: () => set({ config: { ...initialConfig, layoutItems: createBaseLayoutItems() }, selectedItemId: null, undoStack: [], redoStack: [] }),
}));
