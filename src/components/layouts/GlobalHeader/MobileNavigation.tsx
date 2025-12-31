'use client';

import { HelpCircle, Info, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/primitives/button';
import { Separator } from '@/components/primitives/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/primitives/sheet';
import { cn } from '@/utils/styles';
import { SEGMENT_LINKS } from './segmentLinks';

export function MobileNavigation() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="p-0 text-white mix-blend-difference sm:hidden"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-full max-w-[320px] flex-col border-white/5 bg-[#0f172a] p-0 text-[#e5e7eb]"
      >
        {/* Header */}
        <SheetHeader className="flex flex-row items-center justify-between space-y-0 border-white/5 border-b px-8 py-6">
          <SheetTitle className="m-0 font-bold text-[#e5e7eb] tracking-wider">Choisur</SheetTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="text-inherit hover:bg-white/5"
          >
            <X className="h-5 w-5" />
          </Button>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          {/* Main Navigation */}
          <span className="mb-4 block px-2 font-bold text-[#94a3b8] text-[0.75rem] uppercase tracking-widest">
            メインメニュー
          </span>

          <nav className="mb-6 flex flex-col gap-1">
            {SEGMENT_LINKS.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setOpen(false)}
                className="group flex items-center gap-4 rounded-xl px-3 py-3 transition-all duration-200 hover:bg-white/5 active:bg-white/10"
              >
                <div
                  className={cn(
                    'rounded-lg bg-white/5 p-2 transition-colors group-hover:bg-white/10',
                    item.id === 'polls' ? 'text-[#2dd4bf]' : 'text-[#f97316]'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="font-semibold text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>

          <Separator className="my-6 bg-white/5" />

          {/* Sub Navigation */}
          <span className="mb-4 block px-2 font-bold text-[#94a3b8] text-[0.75rem] uppercase tracking-widest">
            サポート
          </span>

          <nav className="flex flex-col gap-1">
            {[
              { label: '利用方法', href: '/#how-to-use', icon: Info },
              { label: 'よくある質問', href: '/#faq', icon: HelpCircle },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 rounded-xl px-3 py-2.5 text-[#94a3b8] transition-all duration-200 hover:bg-white/5 hover:text-[#e5e7eb]"
              >
                <link.icon className="h-5 w-5" />
                <span className="font-medium text-sm">{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
