import { Check, ThumbsUp, Utensils } from 'lucide-react';
import { Button } from '@/components/primitives/button';
import { Progress } from '@/components/primitives/progress';
import type { ParsedPollOption as Option, Voter } from '@/db/core/types';

interface OptionCardProps {
  option: Option;
  totalVotes: number;
  isVoted: boolean;
  isVoting: boolean;
  isDisabled: boolean;
  onVote: () => void;
}

export function PollOptionCard({
  option,
  totalVotes,
  isVoted,
  isVoting,
  isDisabled,
  onVote,
}: OptionCardProps) {
  const votes = option.votes || 0;
  const votePercentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;

  return (
    <div className="group relative flex h-full w-full flex-col rounded-[2px] border border-slate-200 bg-gradient-to-br from-white to-slate-50 transition-all duration-300">
      <div className="group/image relative aspect-[16/10] overflow-hidden">
        <a
          href={option.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`block h-full w-full bg-center bg-cover transition-transform duration-500 group-hover/image:scale-105 ${
            !option.image ? 'bg-gradient-to-br from-slate-50 to-slate-200' : ''
          }`}
          style={option.image ? { backgroundImage: `url(${option.image})` } : undefined}
        >
          {!option.image && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <Utensils size={48} className="mb-2 text-slate-300 opacity-80" />
              <p className="font-medium text-slate-400 text-sm">画像を読み込み中...</p>
            </div>
          )}
        </a>
      </div>

      <div className="flex min-h-0 flex-grow flex-col p-6">
        {option.title && (
          <a
            id={`option-title-${option.id}`}
            href={option.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-4 line-clamp-2 cursor-pointer overflow-hidden text-ellipsis font-bold text-lg text-slate-900 leading-snug no-underline transition-colors hover:text-blue-600 hover:underline"
          >
            {option.title}
          </a>
        )}

        {/* 備考の表示 */}
        {option.description && (
          <div className="mb-4">
            <p className="line-clamp-3 text-slate-500 text-sm leading-relaxed">
              {option.description}
            </p>
          </div>
        )}

        {/* 備考より下を一番下に固定するためのコンテナ */}
        <div className="mt-auto flex flex-col border-slate-100 border-t pt-4">
          <ResultDisplay votes={option.votes || 0} percentage={votePercentage} />

          <VoterList voters={option.voters} />

          <Button
            onClick={onVote}
            disabled={isDisabled || isVoting}
            variant="ghost"
            className={`relative h-auto w-full rounded-md py-3 font-bold text-[14px] normal-case shadow-none transition-all ${
              isVoted
                ? 'border border-blue-200 bg-blue-50/50 text-blue-700 hover:border-blue-300 hover:bg-blue-100'
                : 'border border-slate-200 bg-slate-100 text-slate-700 hover:border-slate-300 hover:bg-slate-200'
            }`}
          >
            <span className={isVoting ? 'invisible opacity-0' : ''}>
              {isVoted ? <Check className="mr-2 h-4 w-4" /> : <ThumbsUp className="mr-2 h-4 w-4" />}
              {isVoted ? '投票済み' : '投票する'}
            </span>
            {isVoting && (
              <span className="absolute inset-0 flex items-center justify-center">
                <svg className="h-5 w-5 animate-spin text-current" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface VoterListProps {
  voters: Voter[];
}

export function VoterList({ voters }: VoterListProps) {
  return (
    <div className="mb-6">
      <span className="mb-2 block font-bold text-[12px] text-slate-500 uppercase tracking-wider">
        投票者
      </span>
      {voters && voters.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          {voters.slice(0, 5).map((voter) => (
            <div
              key={voter.id}
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white font-bold text-[12px] text-white shadow-sm ring-1 ring-slate-100"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              }}
            >
              {(voter.name && voter.name.length > 0 ? voter.name.charAt(0) : '?').toUpperCase()}
            </div>
          ))}
          {voters.length > 5 && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 font-bold text-[11px] text-slate-500 shadow-sm ring-1 ring-slate-200">
              +{voters.length - 5}
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-8 items-center text-slate-300 text-xs italic">
          まだ投票はありません
        </div>
      )}
    </div>
  );
}

interface ResultDisplayProps {
  votes: number;
  percentage: number;
}

function ResultDisplay({ votes, percentage }: ResultDisplayProps) {
  return (
    <>
      <div className="mb-3 flex items-end justify-between">
        <div className="flex items-end gap-1.5">
          <span className="font-black text-2xl text-slate-900 leading-none">{votes}</span>
          <span className="mb-0.5 font-bold text-slate-400 text-xs">票</span>
        </div>
        <span className="font-bold text-lg text-slate-900 leading-none">
          {percentage.toFixed(1)}%
        </span>
      </div>

      <Progress
        value={percentage}
        className="mb-4 h-2 bg-slate-100"
        indicatorClassName="bg-blue-500 rounded-full"
      />
    </>
  );
}
