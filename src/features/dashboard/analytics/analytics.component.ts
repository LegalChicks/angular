import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsData, AnalyticsService } from '../../../services/analytics.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  imports: [CommonModule],
  // FIX: Corrected the typo from `Change.OnPush` to `ChangeDetectionStrategy.OnPush`.
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsComponent implements OnInit {
  private analyticsService = inject(AnalyticsService);

  isLoading = signal(true);
  analyticsData = signal<AnalyticsData | null>(null);

  maxPredictedYield = computed(() => {
    const data = this.analyticsData();
    if (!data || !data.eggYieldForecast || data.eggYieldForecast.length === 0) {
      return 0;
    }
    return Math.max(...data.eggYieldForecast.map(d => d.predictedYield));
  });

  ngOnInit(): void {
    this.analyticsService.getAnalytics()
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe(data => {
        this.analyticsData.set(data);
      });
  }

  getBarHeight(value: number): string {
    const max = this.maxPredictedYield();
    if (max === 0) return '0%';
    const percentage = (value / max) * 100;
    return `${percentage}%`;
  }
}