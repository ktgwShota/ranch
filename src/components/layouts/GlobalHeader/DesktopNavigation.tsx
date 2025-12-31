'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/utils/styles';
import { SEGMENT_LINKS } from './segmentLinks';

/**
 * DesktopNav
 *
 * デスクトップ向けのナビゲーションリンクを表示するコンポーネントです。
 */
export const DesktopNavigation = () => {
  return (
    <nav className="hidden items-center gap-8 sm:flex">
      <NavLink href="/#how-to-use" label="利用方法" sectionId="how-to-use" />
      <NavLink href="/#faq" label="よくある質問" sectionId="faq" />
      {SEGMENT_LINKS.map((link) => (
        <NavLink key={link.id} href={link.href} label={link.label} pathPrefix={link.pathPrefix} />
      ))}
    </nav>
  );
};

interface NavLinkProps {
  href: string;
  label: string;
  sectionId?: string;
  pathPrefix?: string;
}

export function NavLink({ href, label, sectionId, pathPrefix }: NavLinkProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [isActive, setIsActive] = useState(false);
  const [isOverHero, setIsOverHero] = useState(true);

  // スクロールによる色（透明背景時の白 vs 白背景時の黒）の判定
  useEffect(() => {
    if (!isHomePage) return;
    const update = () => {
      const hero = document.getElementById('hero-section');
      if (hero) setIsOverHero(hero.getBoundingClientRect().bottom > 80);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [isHomePage]);

  // アクティブ表示（オレンジ色）の判定
  useEffect(() => {
    if (sectionId && isHomePage) {
      const observer = new IntersectionObserver(([entry]) => setIsActive(entry.isIntersecting), {
        rootMargin: '-20% 0px -60% 0px',
      });
      const el = document.getElementById(sectionId);
      if (el) observer.observe(el);
      return () => observer.disconnect();
    } else if (pathPrefix) {
      setIsActive(pathname.startsWith(pathPrefix));
    }
  }, [pathname, sectionId, isHomePage, pathPrefix]);

  const textColor = isHomePage ? (isOverHero ? '#333333' : '#f9fafb') : '#333';
  const color = isActive ? '#f97316' : textColor;

  const handleClick = (e: React.MouseEvent) => {
    if (sectionId && isHomePage) {
      e.preventDefault();
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      style={{ color }}
      className={cn(
        'cursor-pointer font-medium text-[14px] decoration-0 transition-all duration-300 hover:opacity-80'
      )}
    >
      {label}
    </Link>
  );
}
