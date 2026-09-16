"use client";

// components/CartShell.tsx
// Isole tout l'état "interactif" (panier, tiroir latéral) dans un Client Component,
// utilisé uniquement par le groupe de routes (store) — cf. app/(store)/layout.tsx.
// Le layout racine (app/layout.tsx) reste un Server Component pur (SEO, métadonnées),
// et /admin garde son propre layout sans aucune trace du "chrome" boutique.

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { getCartItems, updateItemQuantity, removeFromCart, type CartItem } from "@/lib/cart";

export default function CartShell({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const loadCart = () => setCartItems(getCartItems());

  useEffect(() => {
    loadCart();
    window.addEventListener("cartUpdated", loadCart);
    return () => window.removeEventListener("cartUpdated", loadCart);
  }, []);

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <Navbar onOpenCart={() => setIsCartOpen(true)} cartCount={totalItemsCount} />
      <main className="flex-grow flex flex-col">{children}</main>
      <Footer />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={(id, delta) => {
          updateItemQuantity(id, delta);
          loadCart();
        }}
        onRemoveItem={(id) => {
          removeFromCart(id);
          loadCart();
        }}
      />
    </>
  );
}
