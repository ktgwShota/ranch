'use client';

import type { CSSProperties } from 'react';

interface StyledListProps {
  items: string[];
  sx?: CSSProperties;
}

export default function StyledList({ items, sx }: StyledListProps) {
  return (
    <ul
      className="m-0 mb-0 list-disc pl-10 [&>li]:list-item [&>li]:marker:text-[rgba(0,0,0,0.6)]"
      style={sx}
    >
      {items.map((item, index) => (
        <li
          key={index}
          className="text-[rgba(0,0,0,0.6)] leading-relaxed"
          style={{
            marginBottom: index === items.length - 1 ? 0 : '24px',
          }}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
