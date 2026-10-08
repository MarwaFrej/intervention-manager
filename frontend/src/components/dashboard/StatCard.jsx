import { ArrowUpRight } from "lucide-react";

function StatCard({ title, value, icon: Icon, description }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
          <Icon size={20} className="text-slate-700" />
        </div>
      </div>

      {description && (
        <div className="mt-4 flex items-center gap-1 text-xs text-slate-500">
          <ArrowUpRight size={14} />
          <span>{description}</span>
        </div>
      )}
    </div>
  );
}

export default StatCard;