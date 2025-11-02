import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export interface EggForecast {
  day: string;
  predictedYield: number;
}

export interface AnalyticsData {
  eggYieldForecast: EggForecast[];
  feedEfficiencyScore: number;
  mortalityRisk: {
    level: 'Low' | 'Medium' | 'High';
    reason: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private http = inject(HttpClient);

  getAnalytics(): Observable<AnalyticsData> {
    return this.http.get<AnalyticsData>(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.analytics.data}`
    );
  }
}
