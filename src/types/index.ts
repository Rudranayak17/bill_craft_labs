export interface Element {
  id: string;
  type: 'text' | 'image' | 'shape' | 'field';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  content?: string;
  style?: ElementStyle;
  layerId?: string;
}

export interface ElementStyle {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  opacity?: number;
  shadow?: string;
}

export interface Template {
  id: string;
  name: string;
  thumbnail: string;
  elements: Element[];
}

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  sender: {
    name: string;
    address: string;
    email: string;
    phone: string;
  };
  recipient: {
    name: string;
    address: string;
    email: string;
    phone: string;
  };
  items: InvoiceItem[];
  notes: string;
  terms: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  tax: number;
  total: number;
}