import { create } from 'zustand';
import type { MenuItem } from '../data/mockData';

export interface CartItem extends MenuItem {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (item: MenuItem, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addToCart: (item, quantity) => {
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity }] };
    });
  },
  removeFromCart: (itemId) => {
    set((state) => ({
      items: state.items.filter((i) => i.id !== itemId),
    }));
  },
  updateQuantity: (itemId, quantity) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.id === itemId ? { ...i, quantity } : i
      ),
    }));
  },
  clearCart: () => set({ items: [] }),
  getTotal: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));
