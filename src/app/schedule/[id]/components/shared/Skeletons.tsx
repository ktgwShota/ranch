'use client';

import { Skeleton } from '@/components/primitives/skeleton';

export function HeaderSkeleton() {
  return (
    <div
      className="mb-[clamp(1.25rem,calc(0.56rem+3.45vw),28px)] grid min-h-[110px] items-end gap-4 rounded-[2px] border border-slate-200 bg-white p-5 sm:min-h-[120px] sm:items-start sm:gap-6 sm:p-6"
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
          div {
            grid-template-areas:
              "title actions"
              "space content" !important;
          }
        }
      `}</style>
      <div className="[grid-area:title]">
        <Skeleton className="h-8 w-[60%]" />
      </div>
      <div className="flex justify-end [grid-area:actions]">
        <Skeleton className="h-[36px] w-[110px] rounded-[2px]" />
      </div>
      <div className="[grid-area:content]">
        <Skeleton className="h-6 w-[40%]" />
      </div>
    </div>
  );
}

export function BannerSkeleton() {
  return (
    <div className="mb-[clamp(1.25rem,calc(0.56rem+3.45vw),28px)] flex flex-col items-start gap-5 rounded-[2px] border border-slate-200 bg-[#f8fafc] p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
      <div className="flex w-full flex-1 items-center gap-6">
        <Skeleton className="h-[26px] w-[26px] shrink-0 rounded-full" />
        <div className="flex-1">
          <Skeleton className="mb-2 h-6 w-[60%]" />
          <Skeleton className="h-5 w-[80%]" />
        </div>
      </div>
      <Skeleton className="h-10 w-[140px] self-stretch rounded-[2px] sm:self-center" />
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="mb-4 overflow-hidden rounded-[2px] border border-slate-200 bg-white">
      <div className="p-0">
        {/* Header Row */}
        <div className="flex border-slate-200 border-b">
          <div className="w-[100px] border-slate-200 border-r p-6">
            <Skeleton className="h-4 w-[80%]" />
          </div>
          <div className="flex flex-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="min-w-[100px] flex-1 border-slate-200 border-r p-6 last:border-r-0"
              >
                <Skeleton className="h-4 w-[60%]" />
              </div>
            ))}
          </div>
        </div>
        {/* Body Rows */}
        {[1, 2, 3, 4, 5].map((row) => (
          <div key={row} className="flex border-slate-200 border-b last:border-b-0">
            <div className="flex w-[100px] justify-center border-slate-200 border-r p-8">
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
            <div className="flex flex-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex min-w-[100px] flex-1 justify-center border-slate-200 border-r p-8 last:border-r-0"
                >
                  <Skeleton className="h-5 w-5 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
        {/* Footer Button if needed */}
        <div className="border-slate-200 border-t p-8">
          <Skeleton className="h-[48px] w-full rounded-[2px]" />
        </div>
      </div>
    </div>
  );
}
