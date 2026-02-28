import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, AxiosError } from 'axios';

// Types
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
  expiresIn: number;
  role: string;
}

export interface UserProfile {
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

export interface ApiError {
  status: number;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

class ApiService {
  private api: AxiosInstance;
  private static instance: ApiService;

  private constructor() {
    this.api = axios.create({
      baseURL: '/api/v1',
      headers: { 'Content-Type': 'application/json' }
    });

    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
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

  private handleError(error: AxiosError): ApiError {
    if (error.response?.data) return error.response.data as ApiError;
    return { status: 500, message: 'An unexpected error occurred' };
  }

  // Auth
  public async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    return response.data;
  }

 // ✅ Purana register method replace karo
public async register(data: RegisterRequest): Promise<AuthResponse> {
  const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/register', data);
  return response.data;
}

// ✅ YE DO NEW METHODS ADD KARO — register ke neeche
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
  return response.data;
}

  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  // User
  public async getUserProfile(): Promise<UserProfile> {
    const response: AxiosResponse<UserProfile> = await this.api.get('/users/me');
    return response.data;
  }

  // Posts
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

  // ✅ My Posts — user ke saare posts (all statuses)
  public async getMyPosts(): Promise<Post[]> {
    const response: AxiosResponse<Post[]> = await this.api.get('/posts/my-posts');
    return response.data;
  }

  // ✅ Submit post for admin review
  public async submitPostForReview(id: string): Promise<Post> {
    const response: AxiosResponse<Post> = await this.api.post(`/posts/${id}/submit`);
    return response.data;
  }

  // ✅ Admin — pending posts
  public async getPendingPosts(): Promise<Post[]> {
    const response: AxiosResponse<Post[]> = await this.api.get('/posts/pending');
    return response.data;
  }

  // ✅ Admin — approve post
  public async approvePost(id: string): Promise<Post> {
    const response: AxiosResponse<Post> = await this.api.post(`/posts/${id}/approve`);
    return response.data;
  }

  // ✅ Admin — reject post with message
  public async rejectPost(id: string, message: string): Promise<Post> {
    const response: AxiosResponse<Post> = await this.api.post(`/posts/${id}/reject`, { message });
    return response.data;
  }

  // Categories
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

  // Tags
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

  // ✅ Notes
  public async getNotes(folder?: string): Promise<Note[]> {
    const response: AxiosResponse<Note[]> = await this.api.get('/notes', { params: folder ? { folder } : {} });
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



export const apiService = ApiService.getInstance();