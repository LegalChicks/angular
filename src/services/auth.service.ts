import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  visibility: 'public' | 'private';
}

interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  isAuthenticated = signal<boolean>(false);
  currentUser = signal<User | null>(null);

  async checkAuthStatus(): Promise<void> {
    const token = localStorage.getItem('authToken');
    const userJson = localStorage.getItem('currentUser');
    
    if (token && userJson) {
      // Verify token with backend
      try {
        const response = await firstValueFrom(
          this.http.post<{ success: boolean; user: User }>(
            `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.verify}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          )
        );
        
        if (response.success && response.user) {
          this.isAuthenticated.set(true);
          this.currentUser.set(response.user);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
        } else {
          console.warn('[AuthService] Token verification failed - invalid response');
          this.logout();
        }
      } catch (error: any) {
        // Token is invalid, clear auth state
        console.error('[AuthService] Token verification error:', {
          status: error.status,
          message: error.error?.message || 'Invalid or expired token',
          timestamp: new Date().toISOString()
        });
        this.logout();
      }
    } else {
      this.isAuthenticated.set(false);
      this.currentUser.set(null);
    }
  }

  async login(email: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await firstValueFrom(
        this.http.post<LoginResponse>(
          `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.login}`,
          { email, password }
        )
      );

      if (response.success && response.token && response.user) {
        console.log('[AuthService] Login successful for user:', email);
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.isAuthenticated.set(true);
        this.currentUser.set(response.user);
        this.router.navigate(['/dashboard']);
      } else {
        console.warn('[AuthService] Login failed:', {
          email,
          reason: response.message,
          timestamp: new Date().toISOString()
        });
      }

      return { success: response.success, message: response.message };
    } catch (error: any) {
      const status = error.status || 'unknown';
      const errorMessage = error.error?.message || 'An error occurred during login. Please try again.';
      
      // Log credential errors with details (but not the password)
      console.error('[AuthService] Login error:', {
        email,
        status,
        message: errorMessage,
        errorType: status === 401 ? 'INVALID_CREDENTIALS' : 'NETWORK_ERROR',
        timestamp: new Date().toISOString(),
        url: error.url || `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.login}`
      });

      return { success: false, message: errorMessage };
    }
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  async register(name: string, email: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await firstValueFrom(
        this.http.post<RegisterResponse>(
          `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.register}`,
          { name, email, password }
        )
      );

      if (response.success && response.token && response.user) {
        console.log('[AuthService] Registration successful for user:', email);
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.isAuthenticated.set(true);
        this.currentUser.set(response.user);
        // Navigate to profile first to complete profile setup, then dashboard
        this.router.navigate(['/dashboard/profile']);
      } else {
        console.warn('[AuthService] Registration failed:', {
          email,
          reason: response.message,
          timestamp: new Date().toISOString()
        });
      }

      return { success: response.success, message: response.message };
    } catch (error: any) {
      const status = error.status || 'unknown';
      const errorMessage = error.error?.message || 'An error occurred during registration. Please try again.';
      
      // Log registration errors
      console.error('[AuthService] Registration error:', {
        email,
        status,
        message: errorMessage,
        errorType: status === 400 ? 'VALIDATION_ERROR' : 'NETWORK_ERROR',
        timestamp: new Date().toISOString(),
        url: error.url || `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.register}`
      });

      return { success: false, message: errorMessage };
    }
  }

  async getMembers(): Promise<User[]> {
    try {
      const members = await firstValueFrom(
        this.http.get<User[]>(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.users.members}`)
      );
      return members;
    } catch (error) {
      console.error('Error fetching members:', error);
      return [];
    }
  }

  async updateProfile(userId: string, updates: Partial<Pick<User, 'name' | 'email' | 'visibility'>>): Promise<User> {
    try {
      const response = await firstValueFrom(
        this.http.put<{ success: boolean; user: User }>(
          `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.users.profile(userId)}`,
          updates
        )
      );

      const updatedUser = response.user;

      // If the updated user is the current user, update the signal and local storage
      if (this.currentUser()?.id === userId) {
        this.currentUser.set(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }

      return updatedUser;
    } catch (error: any) {
      throw new Error(error.error?.message || 'Failed to update profile');
    }
  }
}
