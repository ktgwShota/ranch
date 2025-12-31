import { Plus } from 'lucide-react';

export function AddOptionButton({ onClick }: { onClick: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          onClick();
        }
      }}
      className="group pointer-events-auto relative z-10 mb-6 flex h-[90px] cursor-pointer items-center justify-center gap-3 rounded-[4px] border border-slate-200 border-dashed bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500 hover:bg-blue-50/50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:translate-y-0"
    >
      <Plus
        size={28}
        className="text-blue-600 transition-transform duration-500 ease-out group-hover:rotate-90"
      />
      <p className="pointer-events-none m-0 font-bold text-[15px] text-blue-600">候補を追加</p>
    </div>
  );
}
