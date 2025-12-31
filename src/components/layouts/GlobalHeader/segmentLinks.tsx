import { Calendar, Utensils } from 'lucide-react';

export const SEGMENT_LINKS = [
  {
    id: 'polls',
    label: '店決め',
    href: '/polls/create',
    pathPrefix: '/polls/',
    icon: Utensils,
  },
  {
    id: 'schedule',
    label: '日程調整',
    href: '/schedule/create',
    pathPrefix: '/schedule/',
    icon: Calendar,
  },
] as const;
