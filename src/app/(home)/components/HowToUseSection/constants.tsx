import { Calendar, PlusSquare, Send, Store } from 'lucide-react';

export const STEPS_DATA = {
  poll: [
    {
      num: 1,
      title: '作成',
      desc: 'イベント名と候補となるお店の情報を入力します。',
      icon: <PlusSquare size={32} />,
    },
    {
      num: 2,
      title: '共有',
      desc: (
        <>
          参加者に<span className="font-bold text-orange-500">URL</span>
          を共有して本人が希望するお店に投票してもらいます。
        </>
      ),
      icon: <Send size={32} />,
    },
    {
      num: 3,
      title: '決定',
      desc: '集計されたデータから行き先となるお店を決定します。',
      icon: <Store size={32} />,
    },
  ],
  schedule: [
    {
      num: 1,
      title: '作成',
      desc: 'イベント名と候補となる日程を入力します。',
      icon: <PlusSquare size={32} />,
    },
    {
      num: 2,
      title: '共有',
      desc: (
        <>
          参加者に<span className="font-bold text-violet-500">URL</span>
          を共有して都合の良い日程に記入してもらいます。
        </>
      ),
      icon: <Send size={32} />,
    },
    {
      num: 3,
      title: '決定',
      desc: '集計されたデータから日程を決定します。',
      icon: <Calendar size={32} />,
    },
  ],
};
