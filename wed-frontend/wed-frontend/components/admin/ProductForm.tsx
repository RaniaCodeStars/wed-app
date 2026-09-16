"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, UploadCloud, Save } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch, ApiClientError } from "@/lib/api";
import { getImageUrl } from "@/lib/media";
import type { Category, Product } from "@/lib/types";

interface ProductFormProps {
  categories: Category[];
  existingProduct?: Product;
}

export default function ProductForm({
  categories,
  existingProduct,
}: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!existingProduct;

  const [form, setForm] = useState({
    title: existingProduct?.title ?? "",
    description: existingProduct?.description ?? "",
    price: existingProduct?.price?.toString() ?? "",
    stock: existingProduct?.stock?.toString() ?? "",
    category_id:
      existingProduct?.category?.id?.toString() ??
      categories[0]?.id.toString() ??
      "",
    badge: existingProduct?.badge ?? "",
    sizes: existingProduct?.sizes ?? "",
    colors: existingProduct?.colors ?? "",
  });

  const [existingImages, setExistingImages] = useState<string[]>(
    existingProduct?.images ?? [],
  );
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setNewFiles((prev) => [...prev, ...files]);
  };

  const removeExistingImage = (url: string) =>
    setExistingImages((prev) => prev.filter((i) => i !== url));
  const removeNewFile = (index: number) =>
    setNewFiles((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (!isEdit) {
        // Création : un seul appel multipart avec tous les champs + fichiers
        const fd = new FormData();
        fd.append("title", form.title);
        fd.append("description", form.description);
        fd.append("price", form.price);
        fd.append("stock", form.stock);
        fd.append("category_id", form.category_id);
        fd.append("badge", form.badge);
        fd.append("sizes", form.sizes);
        fd.append("colors", form.colors);
        newFiles.forEach((file) => fd.append("images", file));

        await apiFetch("/admin/products/", { method: "POST", body: fd });
        toast.success("تم إنشاء المنتج بنجاح!");
      } else {
        let finalImages = existingImages;

        // 1. Si de nouvelles images ont été ajoutées, on les upload d'abord (elles sont
        //    ajoutées à la suite des images existantes côté backend)
        if (newFiles.length > 0) {
          const fd = new FormData();
          newFiles.forEach((file) => fd.append("images", file));
          const updated = await apiFetch<Product>(
            `/admin/products/${existingProduct!.id}/images/`,
            { method: "POST", body: fd },
          );
          finalImages = updated.images ?? [];
        }

        // 2. On envoie ensuite les champs texte + la liste finale d'images (après suppressions)
        console.log("🖼️ New files:", newFiles);
        console.log("🖼️ Number of files:", newFiles.length);

        await apiFetch(`/admin/products/${existingProduct!.id}/`, {
          method: "PUT",
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            price: parseFloat(form.price),
            stock: parseInt(form.stock, 10),
            category_id: parseInt(form.category_id, 10),
            badge: form.badge || null,
            sizes: form.sizes || null,
            colors: form.colors || null,
            images: finalImages,
          }),
        });
        toast.success("تم تحديث المنتج بنجاح!");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof ApiClientError ? err.message : "حدث خطأ أثناء الحفظ",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-gray-100 shadow-sm space-y-5">
        <h3 className="font-bold text-gray-900 text-sm">المعلومات الأساسية</h3>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            اسم المنتج
          </label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8C4C4]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            الوصف
          </label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8C4C4] resize-none"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              السعر (د.ج)
            </label>
            <input
              required
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8C4C4]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              المخزون
            </label>
            <input
              required
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8C4C4]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              التصنيف
            </label>
            <select
              required
              value={form.category_id}
              onChange={(e) =>
                setForm({ ...form, category_id: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8C4C4]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              شارة (اختياري)
            </label>
            <input
              placeholder="جديد"
              value={form.badge}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8C4C4]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              المقاسات (مفصولة بفاصلة)
            </label>
            <input
              placeholder="S,M,L,XL"
              value={form.sizes}
              onChange={(e) => setForm({ ...form, sizes: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8C4C4]"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              الألوان (مفصولة بفاصلة)
            </label>
            <input
              placeholder="أسود,أحمر,بيج"
              value={form.colors}
              onChange={(e) => setForm({ ...form, colors: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8C4C4]"
            />
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 text-sm">
          صور المنتج (الأولى = الصورة الرئيسية)
        </h3>

        <div className="flex flex-wrap gap-3">
          {existingImages.map((url) => (
            <div
              key={url}
              className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 group"
            >
              <Image
                src={getImageUrl(url)}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeExistingImage(url)}
                className="absolute top-1 left-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {newFiles.map((file, i) => (
            <div
              key={i}
              className="relative w-24 h-24 rounded-xl overflow-hidden border border-dashed border-[#b88080] group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(file)}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeNewFile(i)}
                className="absolute top-1 left-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          <label className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-[#b88080] hover:text-[#b88080] transition">
            <UploadCloud className="w-5 h-5 mb-1" />
            <span className="text-[10px]">إضافة صورة</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white text-sm font-bold rounded-2xl hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-60"
      >
        <Save className="w-4 h-4" />
        <span>
          {saving ? "جاري الحفظ..." : isEdit ? "حفظ التعديلات" : "إنشاء المنتج"}
        </span>
      </button>
    </form>
  );
}
