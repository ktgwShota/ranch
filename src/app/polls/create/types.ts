export interface PollOption {
  id: number;
  url: string;
  budget?: string;
  budgetMin?: string;
  budgetMax?: string;
  budgetOptions?: Array<{ label: string; min: string; max: string }>;
  description?: string;
  showCustomBudget?: boolean;
  showAutoBudget?: boolean;
}

export interface CommonBudget {
  label: string;
  min: string;
  max: string;
}

