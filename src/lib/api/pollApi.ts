/**
 * Poll関連のAPIリクエストをまとめたクライアント
 */

export interface CreatePollRequest {
  title: string;
  options: Array<{
    url: string;
    title: string;
    description?: string;
  }>;
  endDate?: string | null;
  endTime?: string | null;
  password?: string | null;
}

export interface CreatePollResponse {
  poll: {
    id: string;
  };
}

export interface VoteRequest {
  optionId: number;
  voterId: string;
  voterName: string;
}

export interface UpdateVoterNameRequest {
  voterId: string;
  voterName: string;
}

/**
 * 投票を作成
 */
export async function createPoll(data: CreatePollRequest): Promise<CreatePollResponse> {
  const response = await fetch('/api/polls', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('多数決の作成に失敗しました');
  }

  return response.json();
}

/**
 * 投票を取得
 */
export async function getPoll(pollId: string) {
  const response = await fetch(`/api/polls/${pollId}`);

  if (!response.ok) {
    throw new Error('投票の取得に失敗しました');
  }

  return response.json();
}

/**
 * 投票を更新
 */
export async function updatePoll(pollId: string, data: CreatePollRequest) {
  const response = await fetch(`/api/polls/${pollId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('投票の更新に失敗しました');
  }

  return response.json();
}

/**
 * 投票を削除
 */
export async function deletePoll(pollId: string) {
  const response = await fetch(`/api/polls/${pollId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('投票の削除に失敗しました');
  }

  return response.json();
}

/**
 * 投票を終了（結果を公開）
 */
export async function closePoll(pollId: string) {
  const response = await fetch(`/api/polls/${pollId}/close`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pollId }),
  });

  if (!response.ok) {
    throw new Error('投票の終了に失敗しました');
  }

  return response.json();
}

/**
 * 投票を実行
 */
export async function votePoll(pollId: string, data: VoteRequest) {
  const response = await fetch(`/api/polls/${pollId}/votes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('投票に失敗しました');
  }

  return response.json();
}

/**
 * 投票者名を更新
 */
export async function updateVoterName(pollId: string, data: UpdateVoterNameRequest) {
  const response = await fetch(`/api/polls/${pollId}/voter-name`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('投票者名の更新に失敗しました');
  }

  return response.json();
}

/**
 * パスワードを検証
 */
export async function verifyPassword(pollId: string, password: string) {
  const response = await fetch(`/api/polls/${pollId}/verify-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(errorData.error || 'パスワードが正しくありません');
  }

  return response.json();
}

