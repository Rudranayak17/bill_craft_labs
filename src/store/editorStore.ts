import { create } from 'zustand';
import type { Element, Template, InvoiceData, Layer } from '../types';

interface EditorState {
  elements: Element[];
  selectedElement: Element | null;
  canvas: fabric.Canvas | null;
  zoom: number;
  isDragging: boolean;
  currentTemplate: Template | null;
  invoiceData: InvoiceData;
  history: Element[][];
  historyIndex: number;
  layers: Layer[];
  
  // Actions
  addElement: (element: Element) => void;
  updateElement: (id: string, updates: Partial<Element>) => void;
  removeElement: (id: string) => void;
  setSelectedElement: (element: Element | null) => void;
  setCanvas: (canvas: fabric.Canvas) => void;
  setZoom: (zoom: number) => void;
  setIsDragging: (isDragging: boolean) => void;
  setTemplate: (template: Template) => void;
  updateInvoiceData: (data: Partial<InvoiceData>) => void;
  undo: () => void;
  redo: () => void;
  addLayer: (layer: Layer) => void;
  updateLayer: (id: string, updates: Partial<Layer>) => void;
  removeLayer: (id: string) => void;
  setLayers: (layers: Layer[]) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  elements: [],
  selectedElement: null,
  canvas: null,
  zoom: 1,
  isDragging: false,
  currentTemplate: null,
  invoiceData: {
    invoiceNumber: '',
    date: new Date().toISOString(),
    dueDate: '',
    sender: { name: '', address: '', email: '', phone: '' },
    recipient: { name: '', address: '', email: '', phone: '' },
    items: [],
    notes: '',
    terms: '',
  },
  history: [],
  historyIndex: -1,
  layers: [
    {
      id: 'base',
      name: 'Base Layer',
      visible: true,
      locked: false,
    }
  ],

  addElement: (element) => {
    set((state) => {
      const newElements = [...state.elements, element];
      const newHistory = [...state.history.slice(0, state.historyIndex + 1), newElements];
      return {
        elements: newElements,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  updateElement: (id, updates) => {
    set((state) => {
      const newElements = state.elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      );
      const newHistory = [...state.history.slice(0, state.historyIndex + 1), newElements];
      return {
        elements: newElements,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  removeElement: (id) => {
    set((state) => {
      const newElements = state.elements.filter((el) => el.id !== id);
      const newHistory = [...state.history.slice(0, state.historyIndex + 1), newElements];
      return {
        elements: newElements,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  setSelectedElement: (element) => set({ selectedElement: element }),
  setCanvas: (canvas) => set({ canvas }),
  setZoom: (zoom) => set({ zoom }),
  setIsDragging: (isDragging) => set({ isDragging }),
  setTemplate: (template) => set({ currentTemplate: template }),
  
  updateInvoiceData: (data) =>
    set((state) => ({
      invoiceData: { ...state.invoiceData, ...data },
    })),

  undo: () => {
    const { historyIndex, history, canvas } = get();
    if (historyIndex > 0 && canvas) {
      canvas.getObjects().forEach(obj => canvas.remove(obj));
      history[historyIndex - 1].forEach(element => {
        // Recreate objects from history
        const fabricObject = new fabric[element.type](element);
        canvas.add(fabricObject);
      });
      canvas.renderAll();
      set({
        elements: history[historyIndex - 1],
        historyIndex: historyIndex - 1,
      });
    }
  },

  redo: () => {
    const { historyIndex, history, canvas } = get();
    if (historyIndex < history.length - 1 && canvas) {
      canvas.getObjects().forEach(obj => canvas.remove(obj));
      history[historyIndex + 1].forEach(element => {
        // Recreate objects from history
        const fabricObject = new fabric[element.type](element);
        canvas.add(fabricObject);
      });
      canvas.renderAll();
      set({
        elements: history[historyIndex + 1],
        historyIndex: historyIndex + 1,
      });
    }
  },

  addLayer: (layer) =>
    set((state) => ({
      layers: [...state.layers, layer],
    })),

  updateLayer: (id, updates) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === id ? { ...layer, ...updates } : layer
      ),
    })),

  removeLayer: (id) =>
    set((state) => ({
      layers: state.layers.filter((layer) => layer.id !== id),
    })),

  setLayers: (layers) => set({ layers }),
}));