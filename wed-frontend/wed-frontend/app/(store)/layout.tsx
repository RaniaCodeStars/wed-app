import CartShell from "@/components/CartShell";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <CartShell>{children}</CartShell>;
}
