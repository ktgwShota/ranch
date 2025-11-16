// Worker層で使用する型定義（DBの実際の構造に合わせた型）
// 注意: getPoll関数内でJSON.parseされているため、votersはVoter[]として扱われる

export interface DBPoll {
  id: string;
  title: string;
  duration: number;
  endDateTime: string | null;
  createdBy: string;
  createdAt: string;
  isClosed: number; // 0 = 開いている, 1 = 閉じている
  options: DBPollOption[];
}

export interface DBPollOption {
  id: number;
  url: string | undefined;
  title: string;
  description: string | undefined;
  image?: string;
  budgetMin?: string;
  budgetMax?: string;
  votes: number;
  voters: Array<{ id: string; name: string }>; // JSON.parseでVoter[]に変換される
}

// voters配列の要素型を抽出
export type Voter = DBPollOption['voters'][number];

export interface CreatePollData {
  title: string;
  duration?: number;
  endDateTime?: string | null;
  createdBy: string;
  options: Omit<DBPollOption, 'id' | 'votes' | 'voters'>[];
}

export interface UpdatePollData {
  title: string;
  duration?: number;
  endDateTime?: string | null;
  options: DBPollOption[];
}

export interface VoteData {
  pollId: string;
  optionId: number;
  voterId: string;
  voterName: string;
}

export interface UpdateVoterNameData {
  pollId: string;
  voterId: string;
  voterName: string;
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
