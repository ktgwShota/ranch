// 共通の投票データストア（実際のアプリケーションではデータベースを使用）
let polls: any[] = [];

export const pollStore = {
  // 投票データを取得
  getPoll: (id: string) => {
    return polls.find(poll => poll.id === id);
  },

  // 投票データを保存
  savePoll: (poll: any) => {
    const existingIndex = polls.findIndex(p => p.id === poll.id);
    if (existingIndex >= 0) {
      polls[existingIndex] = poll;
    } else {
      polls.push(poll);
    }
    return poll;
  },

  // 投票を終了状態に更新
  closePoll: (id: string) => {
    const pollIndex = polls.findIndex(poll => poll.id === id);
    if (pollIndex === -1) {
      return null;
    }

    polls[pollIndex] = {
      ...polls[pollIndex],
      isClosed: true
    };

    return polls[pollIndex];
  },

  // すべての投票データを取得
  getAllPolls: () => {
    return polls;
  }
};
