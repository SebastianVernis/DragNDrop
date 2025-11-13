/**
 * API service for communicating with the backend
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type { 
  Project, 
  Template, 
  User, 
  AuthTokens, 
  ApiResponse, 
  ComponentDefinition 
} from '@/types';

class ApiService {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:8000/api/v1') {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearAuthToken();
          // Redirect to login or emit event
          window.dispatchEvent(new CustomEvent('auth:logout'));
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth methods
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  private clearAuthToken(): void {
    localStorage.removeItem('auth_token');
  }

  // Authentication endpoints
  async login(username: string, password: string): Promise<AuthTokens> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await this.client.post<AuthTokens>('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    this.setAuthToken(response.data.accessToken);
    return response.data;
  }

  async register(userData: {
    username: string;
    email: string;
    password: string;
    fullName?: string;
  }): Promise<User> {
    const response = await this.client.post<User>('/auth/register', userData);
    return response.data;
  }

  async logout(): Promise<void> {
    this.clearAuthToken();
  }

  // User endpoints
  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<User>('/users/me');
    return response.data;
  }

  async updateCurrentUser(userData: Partial<User>): Promise<User> {
    const response = await this.client.put<User>('/users/me', userData);
    return response.data;
  }

  // Project endpoints
  async getProjects(params?: {
    skip?: number;
    limit?: number;
    category?: string;
    isPublic?: boolean;
  }): Promise<Project[]> {
    const response = await this.client.get<Project[]>('/projects', { params });
    return response.data;
  }

  async getPublicProjects(params?: {
    skip?: number;
    limit?: number;
    category?: string;
  }): Promise<Project[]> {
    const response = await this.client.get<Project[]>('/projects/public', { params });
    return response.data;
  }

  async getProject(id: number): Promise<Project> {
    const response = await this.client.get<Project>(`/projects/${id}`);
    return response.data;
  }

  async createProject(projectData: Omit<Project, 'id'>): Promise<Project> {
    const response = await this.client.post<Project>('/projects', projectData);
    return response.data;
  }

  async updateProject(id: number, projectData: Partial<Project>): Promise<Project> {
    const response = await this.client.put<Project>(`/projects/${id}`, projectData);
    return response.data;
  }

  async deleteProject(id: number): Promise<void> {
    await this.client.delete(`/projects/${id}`);
  }

  async duplicateProject(id: number): Promise<Project> {
    const response = await this.client.post<Project>(`/projects/${id}/duplicate`);
    return response.data;
  }

  // Template endpoints
  async getTemplates(category?: string): Promise<Template[]> {
    const params = category ? { category } : undefined;
    const response = await this.client.get<Template[]>('/templates', { params });
    return response.data;
  }

  async getTemplate(id: string): Promise<Template> {
    const response = await this.client.get<Template>(`/templates/${id}`);
    return response.data;
  }

  async getTemplateCategories(): Promise<string[]> {
    const response = await this.client.get<string[]>('/templates/categories');
    return response.data;
  }

  // Component endpoints
  async getComponents(): Promise<Record<string, ComponentDefinition[]>> {
    const response = await this.client.get<Record<string, ComponentDefinition[]>>('/components');
    return response.data;
  }

  async getComponentsByCategory(category: string): Promise<ComponentDefinition[]> {
    const response = await this.client.get<ComponentDefinition[]>(`/components/${category}`);
    return response.data;
  }

  async getComponent(category: string, id: string): Promise<ComponentDefinition> {
    const response = await this.client.get<ComponentDefinition>(`/components/${category}/${id}`);
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; version: string }> {
    const response = await this.client.get('/health');
    return response.data;
  }
}

// Create singleton instance
export const apiService = new ApiService();

// Export for testing or custom instances
export { ApiService };