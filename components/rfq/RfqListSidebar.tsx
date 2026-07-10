import type { ReactNode } from "react";

interface RfqListSidebarProps {
  stats: { label: string; value: string | number; highlight?: boolean }[];
  action?: ReactNode;
}

export default function RfqListSidebar({
  stats,
  action,
}: RfqListSidebarProps) {
  const highlightClass = "text-[#1565C0]";

  return (
    <aside className="mt-6 hidden lg:mt-0 lg:block">
      <div className="sticky top-4 space-y-4">
        <div className="rounded-2xl border border-[#E8ECF0] bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-[#90A4AE]">Quick stats</p>
          <dl className="mt-3 space-y-3">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-xs text-[#546E7A]">{stat.label}</dt>
                <dd
                  className={`text-2xl font-extrabold ${
                    stat.highlight ? highlightClass : "text-[#0D1B2A]"
                  }`}
                >
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {action ?? null}
      </div>
    </aside>
  );
}
