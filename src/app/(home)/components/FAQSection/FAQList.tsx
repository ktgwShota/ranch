'use client';

import React from 'react';
import { FAQ_ITEMS } from '@/app/(home)/constants';
import { Accordion } from '@/components/primitives/accordion';
import ScrollReveal from '@/components/ui/ScrollReveal';
import FAQAccordionItem from './FAQAccordionItem';

export default function FAQList() {
  const [value, setValue] = React.useState<string>('');

  return (
    <div className="mx-auto w-full max-w-[800px]">
      <Accordion
        type="single"
        collapsible
        value={value}
        onValueChange={setValue}
        className="flex flex-col gap-4 md:gap-6"
      >
        {FAQ_ITEMS.map((item: { question: string; answer: string }, index: number) => (
          <ScrollReveal key={index} mode="slide" direction="up" distance={30} delay={index * 0.1}>
            <FAQAccordionItem item={item} index={index} />
          </ScrollReveal>
        ))}
      </Accordion>
    </div>
  );
}
