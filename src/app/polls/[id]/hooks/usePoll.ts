import { useState, useEffect } from 'react';
import type { Poll, Option } from '../types';

export function usePoll(pollId: string) {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await fetch(`/api/polls/${pollId}`);
        if (response.ok) {
          const pollData = (await response.json()) as Poll;
          setPoll(pollData);

          // OGPデータを取得
          const updatedOptions = await Promise.all(
            pollData.options.map(async (option: Option) => {
              try {
                const ogpResponse = await fetch('/api/ogp', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ url: option.url }),
                });

                if (ogpResponse.ok) {
                  const ogpData = (await ogpResponse.json()) as {
                    title: string;
                    image: string | null;
                    error?: string;
                  };

                  if (ogpData.error) {
                    return {
                      ...option,
                      title: '対応していないURLです',
                      image: null,
                    };
                  }

                  return {
                    ...option,
                    title: ogpData.title,
                    image: ogpData.image,
                    voters: option.voters || [],
                  };
                }
              } catch (error) {
                console.error('Error fetching OGP data:', error);
              }
              return {
                ...option,
                voters: option.voters || [],
              };
            })
          );

          const updatedPoll: Poll = {
            ...pollData,
            options: updatedOptions,
            isClosed: pollData.isClosed,
          };

          setPoll(updatedPoll);
        }
      } catch (error) {
        console.error('Error fetching poll:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [pollId]);

  return { poll, setPoll, loading };
}

