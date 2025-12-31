interface InfoLabelProps {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
}

export function InfoLabel({ label, value, icon }: InfoLabelProps) {
  return (
    <div className="inline-flex max-w-full items-center gap-4 rounded-[2px] border border-[#e2e8f0] bg-[#f8fafc] py-4 pr-[10px] pl-4">
      <div className="flex shrink-0 items-center gap-3">
        {icon}
        <span className="whitespace-nowrap font-semibold text-[#475569] text-xs">{label}</span>
      </div>

      {/* 区切り線 */}
      <div className="h-[14px] w-[1px] shrink-0 bg-[#cbd5e1]" />

      <span
        className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-[#1e293b] text-xs"
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {value}
      </span>
    </div>
  );
}
