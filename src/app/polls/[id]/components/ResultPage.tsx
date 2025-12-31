import { BarChart3, Users, Vote } from 'lucide-react';
import { Progress } from '@/components/primitives/progress';
import { LinkNotificationBanner } from '@/components/ui/LinkNotificationBanner';
import type { ParsedPollOption as Option, ParsedPoll as Poll } from '@/db/core/types';
import { ResultVoterList } from './ResultVoterList';

interface ResultPageProps {
  pollData: Poll;
}

export function ResultPage({ pollData }: ResultPageProps) {
  const sortedOptions = [...pollData.options].sort((a, b) => (b.votes || 0) - (a.votes || 0));
  const totalVotes = calculateTotalVotes(pollData);
  const winningOption = getWinningOption(pollData);

  const hasSchedule = !!pollData.scheduleId;

  return (
    <>
      <LinkNotificationBanner
        title={
          hasSchedule ? '出欠表（日程調整）が作成されています！' : '日程はもう決まりましたか？'
        }
        description={
          hasSchedule
            ? '候補日時の確認や、メンバーの出欠状況が確認できます。'
            : 'まだ決まっていなければ、日程調整機能を使って全員の都合を聞いてみましょう。'
        }
        buttonText={hasSchedule ? '出欠表を表示' : '出欠表を作成'}
        href={
          hasSchedule
            ? `/schedule/${pollData.scheduleId}`
            : `/schedule/create?title=${encodeURIComponent(pollData.title)}&pollId=${pollData.id}`
        }
        color={hasSchedule ? 'blue' : 'orange'}
      />

      <div className="box-border flex w-full flex-col gap-8 md:flex-row lg:gap-12">
        <LeftColumn
          poll={pollData}
          sortedOptions={sortedOptions}
          totalVotes={totalVotes}
          winningOption={winningOption}
        />
        <RightColumn poll={pollData} totalVotes={totalVotes} />
      </div>
    </>
  );
}

function LeftColumn({
  poll,
  sortedOptions,
  totalVotes,
  winningOption,
}: {
  poll: Poll;
  sortedOptions: Option[];
  totalVotes: number;
  winningOption: Option | null;
}) {
  return (
    <div className="box-border min-w-0 flex-1">
      <div className="box-border rounded-[2px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-blue-500" />
            <h2 className="m-0 font-black text-slate-900 text-xl tracking-tight">投票結果</h2>
          </div>
        </div>

        <p className="mb-8 font-bold text-lg text-slate-700 leading-relaxed">{poll.title}</p>

        <div className="flex flex-col gap-8">
          {sortedOptions.map((option, index) => (
            <ResultOptionCard
              key={option.id}
              option={option}
              rank={index + 1}
              totalVotes={totalVotes}
              isWinner={!!(winningOption && winningOption.id === option.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ResultOptionCard({
  option,
  rank,
  totalVotes,
  isWinner,
}: {
  option: Option;
  rank: number;
  totalVotes: number;
  isWinner: boolean;
}) {
  const percentage = totalVotes > 0 ? ((option.votes || 0) / totalVotes) * 100 : 0;
  const rankColors: Record<number, string> = {
    1: 'bg-amber-100 text-amber-700 ring-amber-200',
    2: 'bg-slate-100 text-slate-600 ring-slate-200',
    3: 'bg-orange-50 text-orange-700 ring-orange-100',
  };
  const rankClass = rankColors[rank] || 'bg-slate-50 text-slate-400 ring-slate-100';

  return (
    <a
      href={option.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`relative block cursor-pointer overflow-hidden rounded-[2px] border-2 p-5 no-underline transition-all duration-300 sm:p-6 ${isWinner
          ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-white shadow-[0_8px_25px_rgba(245,158,11,0.15)] ring-1 ring-amber-400/20'
          : 'border-slate-100 bg-gradient-to-br from-white to-slate-50 shadow-sm hover:translate-y-[-2px] hover:border-blue-400 hover:shadow-md'
        }
      `}
    >
      <div className="relative z-10 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <span
            className={`rounded-full px-3 py-1 font-black text-[12px] uppercase tracking-widest ring-1 ${rankClass}
          `}
          >
            {rank}位
          </span>
        </div>

        <div className="flex gap-5">
          {option.image && (
            <div
              className="h-16 w-16 shrink-0 rounded-[2px] shadow-inner ring-1 ring-slate-200/50 sm:h-20 sm:w-20"
              style={{
                backgroundImage: `url(${option.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          )}
          <div className="min-w-0">
            <h3 className="mb-1 truncate font-black text-lg text-slate-900 leading-tight sm:text-xl">
              {option.title || option.url}
            </h3>
            {option.description && (
              <p className="line-clamp-2 text-slate-400 text-sm leading-relaxed">
                {option.description}
              </p>
            )}
          </div>
        </div>

        <div className="mt-1 flex items-end justify-between">
          <div className="flex items-end gap-1.5">
            <span className="font-black text-2xl text-slate-900 leading-none sm:text-3xl">
              {(option.votes || 0).toLocaleString()}
            </span>
            <span className="mb-1 font-bold text-slate-400 text-sm">票</span>
          </div>
          <span className="font-bold text-lg text-slate-900 leading-none sm:text-xl">
            {percentage.toFixed(1)}%
          </span>
        </div>

        <Progress
          value={percentage}
          className="h-2 rounded-full bg-slate-100/80"
          indicatorClassName={`rounded-full ${isWinner ? 'bg-amber-500' : 'bg-blue-500'}`}
        />
      </div>
    </a>
  );
}

function RightColumn({ poll, totalVotes }: { poll: Poll; totalVotes: number }) {
  return (
    <div className="box-border w-full shrink-0 space-y-6 md:w-64 lg:w-72">
      <div className="rounded-[2px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <Vote className="h-5 w-5 text-blue-500" />
          <h3 className="m-0 font-black text-base text-slate-900 tracking-tight">総投票数</h3>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-black text-3xl text-slate-900 leading-none">
            {totalVotes.toLocaleString()}
          </span>
          <span className="font-bold text-slate-400 text-sm">票</span>
        </div>
      </div>

      <div className="rounded-[2px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <Users className="h-5 w-5 text-blue-500" />
          <h3 className="m-0 font-black text-base text-slate-900 tracking-tight">投票者</h3>
        </div>
        <ResultVoterList poll={poll} />
      </div>
    </div>
  );
}

/**
 * 総投票数を計算
 */
export function calculateTotalVotes(poll: Poll): number {
  return poll.options.reduce((sum, option) => sum + (option.votes || 0), 0);
}

/**
 * 最多得票の選択肢を取得
 */
export function getWinningOption(poll: Poll): Option | null {
  if (poll.options.length === 0) return null;
  return poll.options.reduce(
    (max, option) => ((option.votes || 0) > (max.votes || 0) ? option : max),
    poll.options[0]
  );
}
