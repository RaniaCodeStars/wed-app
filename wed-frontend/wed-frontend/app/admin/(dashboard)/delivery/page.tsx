import AdminHeader from "@/components/admin/AdminHeader";
import DeliveryManager from "@/components/admin/DeliveryManager";
import { getAdminDeliveryPrices, getWilayas } from "@/lib/data";

export default async function DeliveryPage() {
  const [deliveryPrices, wilayas] = await Promise.all([
    getAdminDeliveryPrices().catch(() => []),
    getWilayas().catch(() => []),
  ]);

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Gestion de la livraison"
        subtitle="Gérez les tarifs de livraison par Wilaya"
      />

      <DeliveryManager
        initialDeliveryPrices={deliveryPrices}
        wilayas={wilayas}
      />
    </div>
  );
}
