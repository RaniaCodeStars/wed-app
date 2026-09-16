// lib/cart.ts
// Panier invité 100% côté client (localStorage) — le choix le plus rapide et le plus
// simple (voir décision d'architecture backend). Aucune donnée de panier n'est envoyée
// au serveur avant le clic final "Confirmer la commande" sur /checkout.

const CART_KEY = "wed_cart_v1";

export interface CartItem {
  id: number; // product_id
  name: string;
  price: number;
  priceFormatted: string;
  image: string;
  category: string;
  quantity: number;
  stock: number; // pour ne jamais dépasser le stock disponible
  selected_size?: string | null;
  selected_color?: string | null;
}

function lineKey(item: Pick<CartItem, "id" | "selected_size" | "selected_color">) {
  return `${item.id}__${item.selected_size ?? ""}__${item.selected_color ?? ""}`;
}

function dispatchCartUpdated() {
  window.dispatchEvent(new Event("cartUpdated"));
}

export function getCartItems(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  dispatchCartUpdated();
}

export function addItemToLocalCart(newItem: CartItem) {
  if (typeof window === "undefined") return;
  const items = getCartItems();
  const key = lineKey(newItem);
  const existing = items.find((i) => lineKey(i) === key);

  if (existing) {
    existing.quantity = Math.min(existing.quantity + newItem.quantity, existing.stock || 99);
  } else {
    items.push({ ...newItem, quantity: Math.min(newItem.quantity, newItem.stock || 99) });
  }

  saveCart(items);
}

export function updateItemQuantity(id: number, delta: number, variantKey?: string) {
  if (typeof window === "undefined") return;
  const items = getCartItems();
  const target = variantKey
    ? items.find((i) => lineKey(i) === variantKey)
    : items.find((i) => i.id === id);
  if (!target) return;

  target.quantity += delta;

  const filtered = target.quantity <= 0
    ? items.filter((i) => lineKey(i) !== lineKey(target))
    : items.map((i) => (lineKey(i) === lineKey(target) ? { ...i, quantity: Math.min(target.quantity, target.stock || 99) } : i));

  saveCart(filtered);
}

export function removeFromCart(id: number, variantKey?: string) {
  if (typeof window === "undefined") return;
  const items = getCartItems();
  const filtered = variantKey
    ? items.filter((i) => lineKey(i) !== variantKey)
    : items.filter((i) => i.id !== id);
  saveCart(filtered);
}

export function clearCart() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_KEY);
  dispatchCartUpdated();
}

export function getCartCount(): number {
  return getCartItems().reduce((acc, item) => acc + item.quantity, 0);
}

export function getCartSubtotal(): number {
  return getCartItems().reduce((acc, item) => acc + item.price * item.quantity, 0);
}
