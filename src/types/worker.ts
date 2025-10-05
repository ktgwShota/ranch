// Worker層で使用する型定義

export interface Poll {
  id: string;
  title: string;
  duration: number;
  endDateTime: string | null;
  createdBy: string;
  createdAt: string;
  isClosed: number;
  options?: PollOption[];
}

export interface PollOption {
  id: number;
  url: string;
  title: string;
  description: string;
  image?: string;
  votes: number;
  voters: string[];
}

export interface CreatePollData {
  id: string;
  title: string;
  duration: number;
  endDateTime: string | null;
  createdBy: string;
  createdAt: string;
  isClosed: number;
  options: Omit<PollOption, 'votes' | 'voters'>[];
}

export interface UpdatePollData {
  id: string;
  options: PollOption[];
}

export interface VoteData {
  pollId: string;
  optionId: number;
  voterId: string;
}


export interface DBResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface DBError {
  code: string;
  message: string;
  details?: any;
}
