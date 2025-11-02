import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export interface UserSettings {
  language: string;
  darkMode: boolean;
  notifications: {
    newMembers: boolean;
    weeklySummary: boolean;
    supplyUpdates: boolean;
    emailNotifications: boolean;
  };
}

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private http = inject(HttpClient);
  private readonly SETTINGS_STORAGE_KEY = 'lcen_user_settings';

  /**
   * Get user settings from localStorage or return defaults
   */
  getSettings(): UserSettings {
    const stored = localStorage.getItem(this.SETTINGS_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return this.getDefaultSettings();
      }
    }
    return this.getDefaultSettings();
  }

  /**
   * Save settings to localStorage
   * In production, this should also sync with backend API
   */
  saveSettings(settings: UserSettings): Observable<UserSettings> {
    try {
      localStorage.setItem(this.SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      // TODO: In production, sync with backend API
      // return this.http.put<UserSettings>(`${API_CONFIG.baseUrl}/settings`, settings);
      return of(settings);
    } catch (error) {
      throw new Error('Failed to save settings');
    }
  }

  /**
   * Get default settings
   */
  private getDefaultSettings(): UserSettings {
    return {
      language: 'en',
      darkMode: false,
      notifications: {
        newMembers: true,
        weeklySummary: false,
        supplyUpdates: true,
        emailNotifications: true,
      },
    };
  }

  /**
   * Apply settings (dark mode, language, etc.)
   */
  applySettings(settings: UserSettings): void {
    // Apply dark mode
    this.applyDarkMode(settings.darkMode);

    // Apply language
    document.documentElement.setAttribute('lang', settings.language);
  }

  /**
   * Apply dark mode to the entire application
   */
  applyDarkMode(enabled: boolean): void {
    const html = document.documentElement;
    if (enabled) {
      html.classList.add('dark');
      html.style.setProperty('color-scheme', 'dark');
    } else {
      html.classList.remove('dark');
      html.style.setProperty('color-scheme', 'light');
    }
  }
}

