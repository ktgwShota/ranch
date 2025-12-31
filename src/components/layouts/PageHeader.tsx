'use client';

import { UserCog } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/primitives/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/primitives/tooltip';

interface HeaderBaseProps {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  onOrganizerMenuClick?: (event: React.MouseEvent<HTMLElement>) => void;
  isOrganizer?: boolean;
}

export default function PageHeader({
  title,
  children,
  actions,
  onOrganizerMenuClick,
  isOrganizer = true,
}: HeaderBaseProps) {
  return (
    <div
      className="mb-[clamp(1.25rem,calc(0.56rem+3.45vw),28px)] grid items-end gap-4 rounded-[2px] border border-slate-200 bg-white p-5 sm:items-start sm:gap-6 sm:p-6"
      style={{
        gridTemplateColumns: '1fr auto',
        gridTemplateAreas: `
          "title title"
          "content actions"
        `,
      }}
    >
      <style jsx>{`
        @media (min-width: 640px) {
          .page-header-container {
            grid-template-areas:
              "title actions"
              "space content" !important;
          }
        }
      `}</style>

      {/* Title Area */}
      <div className="[grid-area:title]">
        <h5 className="m-0 font-bold text-[18px] text-slate-900 sm:text-[20px]">{title}</h5>
      </div>

      {/* Actions Area (Organizer Button + Other Actions) */}
      <div className="flex items-center justify-end gap-2 [grid-area:actions]">
        {onOrganizerMenuClick && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-block">
                <Button
                  onClick={onOrganizerMenuClick}
                  variant="outline"
                  disabled={!isOrganizer}
                  className="h-auto gap-1.5 rounded-[2px] border border-slate-300 bg-transparent px-4 py-2 font-semibold text-[13px] text-slate-500 hover:border-slate-400 hover:bg-slate-500/5 disabled:border-slate-200 disabled:text-slate-400"
                >
                  <UserCog size={20} />
                  幹事メニュー
                </Button>
              </span>
            </TooltipTrigger>
            {!isOrganizer && (
              <TooltipContent>
                <p>幹事（作成者）のみ利用可能</p>
              </TooltipContent>
            )}
          </Tooltip>
        )}
        {actions}
      </div>

      {/* Content Area */}
      <div className="min-w-0 [grid-area:content]">{children}</div>
    </div>
  );
}
