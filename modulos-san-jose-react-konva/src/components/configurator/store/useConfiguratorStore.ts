import { create } from 'zustand';
import type { ConfiguratorState, DeliveryTimeline, DivisionOrientation, LayoutItem, LayoutItemType, PanelChoice, UseType } from '../../../types';
import { createBaseLayoutItems, getDefaultItemSize, ITEM_LABELS, ITEM_PRICES } from '../../../utils/pricing';
import { clampInsideItem, normalizeEdgeItem } from '../cad/utils/coordinates';

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
  setDivisionOrientation: (id: string, orientation: DivisionOrientation) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
};

const cloneLayout = (items: LayoutItem[]) => items.map((item) => ({ ...item }));

const isEdgeType = (type: LayoutItemType) => ['base_door', 'additional_door', 'base_window_80x80', 'window_80x80', 'large_window'].includes(type);
const isDivisionType = (type: LayoutItemType) => ['wall_partition', 'interior_room', 'full_bathroom'].includes(type);

export const useConfiguratorStore = create<Store>((set, get) => ({
  config: initialConfig,
  selectedItemId: null,
  undoStack: [],
  redoStack: [],
  setMeasure: (length, width, widthOption, customWidth = '') => {
    set((state) => ({
      config: {
        ...state.config,
        length,
        width,
        widthOption,
        customWidth,
        isSpecialMeasure: length === 8 || widthOption === 'Otro ancho' || width < 2 || width > 3,
        layoutItems: state.config.layoutItems.map((item) => {
          if (item.zone === 'edge') return normalizeEdgeItem(item, item.x, item.y, length, width);
          return clampInsideItem(item, item.x, item.y, length, width);
        }),
      },
    }));
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
      x: isEdgeType(type) ? 0.6 + index * 0.5 : Math.min(0.6 + index * 0.35, config.length - size.width),
      y: isEdgeType(type) ? 0 : Math.min(0.5 + index * 0.2, config.width - size.height),
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
    const normalized = draft.zone === 'edge'
      ? normalizeEdgeItem(draft, draft.x, draft.y, config.length, config.width)
      : clampInsideItem(draft, draft.x, draft.y, config.length, config.width);
    set((state) => ({
      undoStack: [...state.undoStack.slice(-30), cloneLayout(state.config.layoutItems)],
      redoStack: [],
      selectedItemId: normalized.id,
      config: { ...state.config, layoutItems: [...state.config.layoutItems, normalized] },
    }));
  },
  updateItem: (id, patch, recordHistory = true) => {
    const { config } = get();
    set((state) => ({
      undoStack: recordHistory ? [...state.undoStack.slice(-30), cloneLayout(config.layoutItems)] : state.undoStack,
      redoStack: recordHistory ? [] : state.redoStack,
      config: { ...state.config, layoutItems: state.config.layoutItems.map((item) => (item.id === id ? { ...item, ...patch } : item)) },
    }));
  },
  moveItem: (id, x, y) => {
    const { config } = get();
    const before = cloneLayout(config.layoutItems);
    set((state) => ({
      undoStack: [...state.undoStack.slice(-30), before],
      redoStack: [],
      config: {
        ...state.config,
        layoutItems: state.config.layoutItems.map((item) => {
          if (item.id !== id) return item;
          return item.zone === 'edge'
            ? normalizeEdgeItem(item, x, y, state.config.length, state.config.width)
            : clampInsideItem(item, x, y, state.config.length, state.config.width);
        }),
      },
    }));
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
      config: { ...state.config, layoutItems: state.config.layoutItems.filter((item) => item.id !== selectedItemId) },
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
          return { ...item, rotation: (((item.rotation + 90) % 360) as LayoutItem['rotation']) };
        }),
      },
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
          if (item.type === 'wall_partition') {
            return orientation === 'transversal'
              ? { ...item, orientation, x: 0, y: Math.min(item.y, state.config.width - 0.08), width: state.config.length, height: 0.08 }
              : { ...item, orientation, x: Math.min(item.x, state.config.length - 0.08), y: 0, width: 0.08, height: state.config.width };
          }
          if (item.type === 'interior_room') {
            return orientation === 'transversal'
              ? { ...item, orientation, x: 0, width: state.config.length, height: Math.max(1.5, Math.min(item.height, state.config.width)) }
              : { ...item, orientation, y: 0, height: state.config.width, width: Math.max(1.5, Math.min(item.width, state.config.length)) };
          }
          if (item.type === 'full_bathroom') {
            return orientation === 'transversal'
              ? { ...item, orientation, x: 0, width: Math.min(2.2, state.config.length), height: Math.max(1.2, Math.min(item.height, state.config.width)) }
              : { ...item, orientation, y: 0, height: Math.min(1.7, state.config.width), width: Math.max(1.2, Math.min(item.width, state.config.length)) };
          }
          return item;
        }),
      },
    }));
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
