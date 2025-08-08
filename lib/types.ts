export type Category = {
  id: string;
  user_id: string;
  name: string;
  type: "expense" | "income";
  created_at: string | null;
};

export type Transaction = {
  id: string;
  user_id: string;
  category_id: string | null;
  amount: number;
  occurred_on: string; // ISO date
  note: string | null;
  created_at: string | null;
};

export type Budget = {
  id: string;
  user_id: string;
  category_id: string;
  month: string; // YYYY-MM-01
  limit_amount: number;
};
