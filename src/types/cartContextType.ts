import { CartItem } from "./cartItem";
export interface CartContextType {
  cartItems: CartItem[];
  cartTotal: number;
  cartReady: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}
// export interface CartContextType {
//   cart: CartItem[];
//   addToCart: (item: CartItem) => void;
//   removeFromCart: (id: number) => void;
//   clearCart: () => void;
// }