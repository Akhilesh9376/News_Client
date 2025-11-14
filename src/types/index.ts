export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "employee";
  createdAt: string;
  isBlocked?: boolean;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  imageUrl?: string;
  category: string;
  author: {
    id: string;
    name: string;
  };
  status: "draft" | "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  rejectionReason?: string;
  // Optional readers count (total users who read the article)
  views?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface NewsState {
  articles: Article[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  filters: {
    category: string;
    search: string;
    status?: string;
  };
}

export interface AdminState {
  employees: User[];
  pendingArticles: Article[];
  statistics: {
    totalArticles: number;
    totalEmployees: number;
    pendingApprovals: number;
    publishedToday: number;
  };
  isLoading: boolean;
  error: string | null;
}
