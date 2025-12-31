'use client';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/primitives/accordion';
import { COLORS } from '../../constants';

interface FAQAccordionItemProps {
  item: { question: string; answer: string };
  index: number;
}

export default function FAQAccordionItem({ item, index }: FAQAccordionItemProps) {
  return (
    <AccordionItem
      value={`panel${index}`}
      className="overflow-hidden rounded-[2px] border border-[#e0e0e0] bg-white transition-all duration-200"
      style={{
        backgroundColor: COLORS.CARD_BG,
        borderColor: COLORS.BORDER_LIGHT,
      }}
    >
      <AccordionTrigger className="group flex w-full items-center justify-between px-4 py-4 text-left hover:no-underline md:px-5 md:py-5">
        <div
          className="pr-4 font-bold"
          style={{
            color: COLORS.TEXT_MAIN,
            fontSize: 'clamp(0.95rem, 0.95rem, 1rem)',
            fontFeatureSettings: '"palt"',
          }}
        >
          {item.question}
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pt-0 pb-6 md:px-6 md:pb-8">
        <p
          className="whitespace-pre-wrap leading-relaxed"
          style={{
            color: COLORS.TEXT_SUB,
            fontSize: 'clamp(0.9rem, 0.9rem, 0.95rem)',
          }}
        >
          {item.answer}
        </p>
      </AccordionContent>
    </AccordionItem>
  );
}
