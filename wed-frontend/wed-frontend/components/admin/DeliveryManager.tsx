"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, Truck, X } from "lucide-react";
import { toast } from "sonner";

import type { DeliveryPrice, Wilaya } from "@/lib/types";
import { apiFetch } from "@/lib/api";

interface DeliveryManagerProps {
  initialDeliveryPrices: DeliveryPrice[];
  wilayas: Wilaya[];
}

interface DeliveryForm {
  wilaya: string;
  home_price: string;
  office_price: string;
}

const emptyForm: DeliveryForm = {
  wilaya: "",
  home_price: "",
  office_price: "",
};

export default function DeliveryManager({
  initialDeliveryPrices,
  wilayas,
}: DeliveryManagerProps) {
  const [deliveryPrices, setDeliveryPrices] = useState<DeliveryPrice[]>(
    initialDeliveryPrices,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingDelivery, setEditingDelivery] = useState<DeliveryPrice | null>(
    null,
  );

  const [deleteTarget, setDeleteTarget] = useState<DeliveryPrice | null>(null);

  const [form, setForm] = useState<DeliveryForm>(emptyForm);

  const [loading, setLoading] = useState(false);

  const [deleting, setDeleting] = useState(false);

  // --------------------------------------------------
  // OUVRIR MODAL AJOUT
  // --------------------------------------------------

  const openAddModal = () => {
    setEditingDelivery(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  // --------------------------------------------------
  // OUVRIR MODAL MODIFICATION
  // --------------------------------------------------

  const openEditModal = (delivery: DeliveryPrice) => {
    setEditingDelivery(delivery);

    setForm({
      wilaya: delivery.wilaya,
      home_price: String(delivery.home_price),
      office_price: String(delivery.office_price),
    });

    setIsModalOpen(true);
  };

  // --------------------------------------------------
  // FERMER MODAL
  // --------------------------------------------------

  const closeModal = () => {
    if (loading) return;

    setIsModalOpen(false);
    setEditingDelivery(null);
    setForm(emptyForm);
  };

  // --------------------------------------------------
  // AJOUT / MODIFICATION
  // --------------------------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Wilaya obligatoire
    if (!form.wilaya) {
      toast.error("Veuillez sélectionner une Wilaya.");
      return;
    }

    // Vérification des prix
    if (form.home_price === "" || form.office_price === "") {
      toast.error("Veuillez renseigner les deux tarifs.");
      return;
    }

    const homePrice = Number(form.home_price);
    const officePrice = Number(form.office_price);

    if (Number.isNaN(homePrice) || Number.isNaN(officePrice)) {
      toast.error("Les tarifs doivent être des nombres.");
      return;
    }

    if (homePrice < 0 || officePrice < 0) {
      toast.error("Les tarifs ne peuvent pas être négatifs.");
      return;
    }

    setLoading(true);

    try {
      // ------------------------------------------------
      // MODIFICATION
      // ------------------------------------------------

      if (editingDelivery) {
        const updated = await apiFetch<DeliveryPrice>(
          `/admin/delivery-prices/${editingDelivery.id}`,
          {
            method: "PUT",
            body: JSON.stringify({
              wilaya: form.wilaya,
              home_price: homePrice,
              office_price: officePrice,
            }),
          },
        );

        setDeliveryPrices((current) =>
          current.map((item) => (item.id === updated.id ? updated : item)),
        );

        toast.success("Tarif de livraison modifié avec succès.");
      }

      // ------------------------------------------------
      // AJOUT
      // ------------------------------------------------
      else {
        const created = await apiFetch<DeliveryPrice>(
          `/admin/delivery-prices`,
          {
            method: "POST",
            body: JSON.stringify({
              wilaya: form.wilaya,
              home_price: homePrice,
              office_price: officePrice,
            }),
          },
        );

        setDeliveryPrices((current) => [...current, created]);

        toast.success("Tarif de livraison ajouté avec succès.");
      }

      closeModal();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Une erreur est survenue.",
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // OUVRIR POPUP SUPPRESSION
  // --------------------------------------------------

  const openDeleteModal = (delivery: DeliveryPrice) => {
    setDeleteTarget(delivery);
  };

  // --------------------------------------------------
  // SUPPRESSION
  // --------------------------------------------------

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      await apiFetch<void>(`/admin/delivery-prices/${deleteTarget.id}`, {
        method: "DELETE",
      });

      setDeliveryPrices((current) =>
        current.filter((item) => item.id !== deleteTarget.id),
      );

      toast.success(`Le tarif de ${deleteTarget.wilaya} a été supprimé.`);

      setDeleteTarget(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible de supprimer le tarif.",
      );
    } finally {
      setDeleting(false);
    }
  };

  // --------------------------------------------------
  // WILAYAS DÉJÀ CONFIGURÉES
  // --------------------------------------------------

  const configuredWilayas = new Set(
    deliveryPrices.map((delivery) => delivery.wilaya),
  );

  // --------------------------------------------------
  // WILAYAS DISPONIBLES POUR AJOUT
  // --------------------------------------------------

  const availableWilayas = wilayas.filter(
    (wilaya) =>
      editingDelivery?.wilaya === wilaya.name_fr ||
      !configuredWilayas.has(wilaya.name_fr),
  );

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <>
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Tarifs par Wilaya
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Définissez séparément les tarifs à domicile et au bureau.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-[#b88080] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#a96f6f]"
        >
          <Plus className="h-4 w-4" />
          Ajouter un tarif
        </button>
      </div>

      {/* ==================================================
          TABLEAU
      ================================================== */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {deliveryPrices.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f8f3f1]">
              <Truck className="h-7 w-7 text-[#b88080]" />
            </div>

            <h3 className="text-base font-semibold text-gray-900">
              Aucun tarif configuré
            </h3>

            <p className="mt-1 max-w-sm text-sm text-gray-500">
              Commencez par ajouter les tarifs de livraison pour vos Wilayas.
            </p>

            <button
              type="button"
              onClick={openAddModal}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#b88080] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#a96f6f]"
            >
              <Plus className="h-4 w-4" />
              Ajouter un tarif
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  <th className="px-6 py-4 text-right font-semibold text-gray-600">
                    Wilaya
                  </th>

                  <th className="px-6 py-4 text-right font-semibold text-gray-600">
                    Livraison à domicile
                  </th>

                  <th className="px-6 py-4 text-right font-semibold text-gray-600">
                    Livraison au bureau
                  </th>

                  <th className="px-6 py-4 text-center font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {deliveryPrices.map((delivery) => (
                  <tr
                    key={delivery.id}
                    className="transition hover:bg-gray-50/50"
                  >
                    {/* Wilaya */}
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {delivery.wilaya}
                    </td>

                    {/* Domicile */}
                    <td className="px-6 py-4">
                      <span className="font-medium text-[#b88080]">
                        {delivery.home_price.toLocaleString("fr-DZ")} DA
                      </span>
                    </td>

                    {/* Bureau */}
                    <td className="px-6 py-4">
                      <span className="font-medium text-[#b88080]">
                        {delivery.office_price.toLocaleString("fr-DZ")} DA
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Modifier */}
                        <button
                          type="button"
                          onClick={() => openEditModal(delivery)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-[#b88080] hover:bg-[#f8f3f1] hover:text-[#b88080]"
                          title="Modifier"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        {/* Supprimer */}
                        <button
                          type="button"
                          onClick={() => openDeleteModal(delivery)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ==================================================
          MODAL AJOUT / MODIFICATION
      ================================================== */}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            {/* Header modal */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingDelivery ? "Modifier le tarif" : "Ajouter un tarif"}
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Configurez les deux modes de livraison.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={loading}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              {/* Wilaya */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Wilaya
                </label>

                <select
                  value={form.wilaya}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      wilaya: e.target.value,
                    }))
                  }
                  disabled={!!editingDelivery || loading}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#b88080] focus:ring-2 focus:ring-[#b88080]/10 disabled:bg-gray-100"
                >
                  <option value="">Sélectionner une Wilaya</option>

                  {availableWilayas.map((wilaya) => (
                    <option key={wilaya.code} value={wilaya.name_fr}>
                      {wilaya.name_fr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Domicile */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Livraison à domicile
                </label>

                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.home_price}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        home_price: e.target.value,
                      }))
                    }
                    disabled={loading}
                    placeholder="Ex : 500"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-14 text-sm outline-none transition focus:border-[#b88080] focus:ring-2 focus:ring-[#b88080]/10"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                    DA
                  </span>
                </div>
              </div>

              {/* Bureau */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Livraison au bureau
                </label>

                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.office_price}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        office_price: e.target.value,
                      }))
                    }
                    disabled={loading}
                    placeholder="Ex : 300"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-14 text-sm outline-none transition focus:border-[#b88080] focus:ring-2 focus:ring-[#b88080]/10"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                    DA
                  </span>
                </div>
              </div>

              {/* Boutons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={loading}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-xl bg-[#b88080] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#a96f6f] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Enregistrement..."
                    : editingDelivery
                      ? "Enregistrer"
                      : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================
          MODAL SUPPRESSION
      ================================================== */}

      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl">
            <div className="p-6 text-center">
              {/* Icône */}
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                <Trash2 className="h-6 w-6 text-red-500" />
              </div>

              {/* Titre */}
              <h3 className="text-lg font-semibold text-gray-900">
                Supprimer ce tarif ?
              </h3>

              {/* Message */}
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Voulez-vous vraiment supprimer le tarif de livraison pour{" "}
                <span className="font-semibold text-gray-800">
                  {deleteTarget.wilaya}
                </span>{" "}
                ?
              </p>

              {/* Prix actuels */}
              <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Domicile</span>

                  <span className="font-medium text-gray-800">
                    {deleteTarget.home_price.toLocaleString("fr-DZ")} DA
                  </span>
                </div>

                <div className="mt-2 flex justify-between">
                  <span className="text-gray-500">Bureau</span>

                  <span className="font-medium text-gray-800">
                    {deleteTarget.office_price.toLocaleString("fr-DZ")} DA
                  </span>
                </div>
              </div>

              {/* Boutons */}
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Annuler
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deleting ? "Suppression..." : "Supprimer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
