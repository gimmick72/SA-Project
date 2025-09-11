export type Member = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  username: string;
  password?: string;
  created_at?: string;
  updated_at?: string;
};

export type MemberPage = {
  items: Member[];
  total: number;
  page: number;
  page_size: number;
};
