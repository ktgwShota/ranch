export interface PollOption {
  id: number;
  url: string;
  budget?: string;
  budgetMin?: string;
  budgetMax?: string;
  description?: string;
  showCustomBudget?: boolean;
}

export interface CommonBudget {
  label: string;
  min: string;
  max: string;
}

