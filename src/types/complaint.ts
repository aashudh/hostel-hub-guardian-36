
export interface Complaint {
  id: string;
  title: string;
  category: string;
  description: string;
  status: string;
  createdAt: string;
  resolvedAt?: string;
  response?: string;
}
