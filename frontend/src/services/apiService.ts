import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, AxiosError } from 'axios';

// ═══════════════════════════════════════════
//  TYPES
// ═══════════════════════════════════════════

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  expiresIn: number;
  role: string;
  name?: string;
  userId?: string;
  twoFactorRequired?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  totalPosts: number;
}

export interface Category {
  id: string;
  name: string;
  postCount?: number;
}

export interface Tag {
  id: string;
  name: string;
  postCount?: number;
}

export enum PostStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PUBLISHED = 'PUBLISHED',
  REJECTED = 'REJECTED'
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author?: {
    id: string;
    name: string;
  };
  category: Category;
  tags: Tag[];
  readingTime?: number;
  createdAt: string;
  updatedAt: string;
  status?: PostStatus;
  rejectionMessage?: string;
  submittedByEmail?: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  categoryId: string;
  tagIds: string[];
  status: PostStatus;
}

export interface UpdatePostRequest extends CreatePostRequest {
  id: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  folder?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteRequest {
  title: string;
  content: string;
  tags: string[];
  folder?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

// ── UPDATED: OTP-based reset instead of token-based ──
export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

// ═══════════════════════════════════════════
//  API SERVICE
// ═══════════════════════════════════════════

const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_URL is not defined. Please set it in your .env file or Vercel environment variables.');
}

class ApiService {
  private api: AxiosInstance;
  private static instance: ApiService;

  private constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/api/v1`,
      headers: { 'Content-Type': 'application/json' }
    });

    // ── Request interceptor — attach JWT ──
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    // ── Response interceptor — handle 401 ──
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('userId');
          localStorage.removeItem('email');
          window.location.href = '/login';
        }
        return Promise.reject(this.handleError(error));
      }
    );
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) ApiService.instance = new ApiService();
    return ApiService.instance;
  }

  public setAuthToken(token: string | null): void {
    if (token) {
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.api.defaults.headers.common['Authorization'];
    }
  }

  private handleError(error: AxiosError): ApiError {
    if (error.response?.data) return error.response.data as ApiError;
    return { status: 500, message: 'An unexpected error occurred' };
  }

  // ═══════════════════════════════════════════
  //  AUTH
  // ═══════════════════════════════════════════

  public async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', credentials);
    if (!response.data.twoFactorRequired) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('email', credentials.email);
      if (response.data.userId) localStorage.setItem('userId', response.data.userId);
    }
    return response.data;
  }

  public async register(data: RegisterRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/register', data);
    return response.data;
  }

  public async sendOtp(email: string): Promise<void> {
    await this.api.post('/auth/register/send-otp', { email });
  }

  public async verifyOtpAndRegister(data: {
    name: string;
    email: string;
    password: string;
    otp: string;
  }): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post(
      '/auth/register/verify-otp',
      data
    );
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('email', data.email);
      if (response.data.userId) localStorage.setItem('userId', response.data.userId);
    }
    return response.data;
  }

  public async verifyTwoFactor(email: string, otp: string): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/2fa/verify', { email, otp });
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('role', response.data.role);
    localStorage.setItem('email', email);
    if (response.data.userId) localStorage.setItem('userId', response.data.userId);
    return response.data;
  }

  public async forgotPassword(email: string): Promise<void> {
    await this.api.post('/auth/forgot-password', { email });
  }

  // ── UPDATED: sends { email, otp, newPassword } to backend ──
  public async resetPassword(data: ResetPasswordRequest): Promise<void> {
    await this.api.post('/auth/reset-password', data);
  }

  public async changePassword(data: ChangePasswordRequest): Promise<void> {
    await this.api.post('/auth/change-password', data);
  }

  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
  }

  // ═══════════════════════════════════════════
  //  USER
  // ═══════════════════════════════════════════

  public async getUserProfile(): Promise<UserProfile> {
    const response: AxiosResponse<UserProfile> = await this.api.get('/users/me');
    return response.data;
  }

  // ═══════════════════════════════════════════
  //  POSTS
  // ═══════════════════════════════════════════

  public async getPosts(params: { categoryId?: string; tagId?: string }): Promise<Post[]> {
    const response: AxiosResponse<Post[]> = await this.api.get('/posts', { params });
    return response.data;
  }

  public async getPost(id: string): Promise<Post> {
    const response: AxiosResponse<Post> = await this.api.get(`/posts/${id}`);
    return response.data;
  }

  public async createPost(post: CreatePostRequest): Promise<Post> {
    const response: AxiosResponse<Post> = await this.api.post('/posts', post);
    return response.data;
  }

  public async updatePost(id: string, post: UpdatePostRequest): Promise<Post> {
    const response: AxiosResponse<Post> = await this.api.put(`/posts/${id}`, post);
    return response.data;
  }

  public async deletePost(id: string): Promise<void> {
    await this.api.delete(`/posts/${id}`);
  }

  public async getDrafts(): Promise<Post[]> {
    const response: AxiosResponse<Post[]> = await this.api.get('/posts/drafts');
    return response.data;
  }

  public async getMyPosts(): Promise<Post[]> {
    const response: AxiosResponse<Post[]> = await this.api.get('/posts/my-posts');
    return response.data;
  }

  public async submitPostForReview(id: string): Promise<Post> {
    const response: AxiosResponse<Post> = await this.api.post(`/posts/${id}/submit`);
    return response.data;
  }

  // ── Admin only ──

  public async getPendingPosts(): Promise<Post[]> {
    const response: AxiosResponse<Post[]> = await this.api.get('/posts/pending');
    return response.data;
  }

  public async approvePost(id: string): Promise<Post> {
    const response: AxiosResponse<Post> = await this.api.post(`/posts/${id}/approve`);
    return response.data;
  }

  public async rejectPost(id: string, message: string): Promise<Post> {
    const response: AxiosResponse<Post> = await this.api.post(`/posts/${id}/reject`, { message });
    return response.data;
  }

  // ═══════════════════════════════════════════
  //  CATEGORIES
  // ═══════════════════════════════════════════

  public async getCategories(): Promise<Category[]> {
    const response: AxiosResponse<Category[]> = await this.api.get('/categories');
    return response.data;
  }

  public async createCategory(name: string): Promise<Category> {
    const response: AxiosResponse<Category> = await this.api.post('/categories', { name });
    return response.data;
  }

  public async updateCategory(id: string, name: string): Promise<Category> {
    const response: AxiosResponse<Category> = await this.api.put(`/categories/${id}`, { id, name });
    return response.data;
  }

  public async deleteCategory(id: string): Promise<void> {
    await this.api.delete(`/categories/${id}`);
  }

  // ═══════════════════════════════════════════
  //  TAGS
  // ═══════════════════════════════════════════

  public async getTags(): Promise<Tag[]> {
    const response: AxiosResponse<Tag[]> = await this.api.get('/tags');
    return response.data;
  }

  public async createTags(name: string[]): Promise<Tag[]> {
    const response: AxiosResponse<Tag[]> = await this.api.post('/tags', { name });
    return response.data;
  }

  public async deleteTag(id: string): Promise<void> {
    await this.api.delete(`/tags/${id}`);
  }

  // ═══════════════════════════════════════════
  //  NOTES
  // ═══════════════════════════════════════════

  public async getNotes(folder?: string): Promise<Note[]> {
    const response: AxiosResponse<Note[]> = await this.api.get('/notes', {
      params: folder ? { folder } : {}
    });
    return response.data;
  }

  public async getNote(id: string): Promise<Note> {
    const response: AxiosResponse<Note> = await this.api.get(`/notes/${id}`);
    return response.data;
  }

  public async createNote(note: NoteRequest): Promise<Note> {
    const response: AxiosResponse<Note> = await this.api.post('/notes', note);
    return response.data;
  }

  public async updateNote(id: string, note: NoteRequest): Promise<Note> {
    const response: AxiosResponse<Note> = await this.api.put(`/notes/${id}`, note);
    return response.data;
  }

  public async deleteNote(id: string): Promise<void> {
    await this.api.delete(`/notes/${id}`);
  }

  public async getNoteFolders(): Promise<string[]> {
    const response: AxiosResponse<string[]> = await this.api.get('/notes/folders');
    return response.data;
  }
}

// ═══════════════════════════════════════════
//  SINGLETON EXPORT
// ═══════════════════════════════════════════

export const apiService = ApiService.getInstance();