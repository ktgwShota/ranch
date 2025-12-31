'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/primitives/avatar';
import { Button } from '@/components/primitives/button';
import { Separator } from '@/components/primitives/separator';
import type { ParsedPoll as Poll } from '@/db/core/types';

interface ResultVoterListProps {
  poll: Poll;
}

export function ResultVoterList({ poll }: ResultVoterListProps) {
  const [showAll, setShowAll] = useState(false);
  const allVoters = poll.options.flatMap((option) =>
    option.voters.map((voter) => ({ ...voter, votedFor: option.title || option.url }))
  );

  const displayedVoters = showAll ? allVoters : allVoters.slice(0, 3);
  const hasMore = allVoters.length > 3;

  return (
    <div className="flex flex-col gap-5">
      {displayedVoters.map((voter, index) => (
        <div key={`${voter.id}-${index}`} className="group">
          <div className="flex items-center gap-4">
            <Avatar className="h-9 w-9 border border-slate-100 shadow-sm">
              <AvatarFallback className="bg-indigo-50 font-black text-[13px] text-indigo-600">
                {(voter.name && voter.name.length > 0 ? voter.name.charAt(0) : '?').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="m-0 font-bold text-slate-900 leading-tight">{voter.name || '匿名'}</p>
              <span className="block overflow-hidden text-ellipsis whitespace-nowrap text-[13px] text-slate-400 leading-relaxed">
                {voter.votedFor}
              </span>
            </div>
          </div>
          {index < displayedVoters.length - 1 && <Separator className="mt-4 bg-slate-50" />}
        </div>
      ))}

      {hasMore && !showAll && (
        <Button
          variant="ghost"
          onClick={() => setShowAll(true)}
          className="mt-1 h-9 rounded-[2px] font-bold text-[13px] text-blue-500 hover:bg-blue-50/50 hover:text-blue-600"
        >
          もっと見る ({allVoters.length - 3}人)
        </Button>
      )}
    </div>
  );
}
