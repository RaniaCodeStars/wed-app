import type { LucideIcon } from "lucide-react";

export default function StatCard({ title, value, change, icon: Icon, color }: { title: string; value: string; change?: string; icon: LucideIcon; color: string }) {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-gray-100 shadow-sm space-y-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{title}</p>
        {change && <p className="text-[10px] text-emerald-600 font-semibold mt-1">{change}</p>}
      </div>
    </div>
  );
}
