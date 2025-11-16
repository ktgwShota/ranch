export interface Voter {
  id: string;
  name: string;
}

export interface Option {
  id: number;
  url: string;
  title?: string;
  image?: string | null;
  votes: number;
  voters: Voter[];
}

export interface Poll {
  id: string;
  title: string;
  duration?: number;
  endDateTime?: string | null;
  createdAt?: string;
  createdBy?: string;
  isClosed?: boolean;
  options: Option[];
}

