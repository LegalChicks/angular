import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-members-dashboard',
  templateUrl: './members-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
})
export class MembersDashboardComponent {
  authService = inject(AuthService);
  router = inject(Router);
  user = this.authService.currentUser;

  // Mock data for the new dashboard
  farmStats = {
    flockSize: 150,
    weeklyEggCount: 850,
    projectedEarnings: '₱10,200', // Using a string to include currency symbol
    feedUsageKg: 75
  };

  farmJourney = {
    currentStep: 2, // Index of the current step (0-based)
    steps: [
      { name: 'Onboarding', status: 'completed' },
      { name: 'First Flock', status: 'completed' },
      { name: 'First Harvest', status: 'inprogress' },
      { name: 'Profitable', status: 'pending' }
    ]
  };

  downloadResource(resourceName: string): void {
    const placeholderContent = `This is a placeholder file for ${resourceName}. In a real application, this would be the actual resource content.`;
    const blob = new Blob([placeholderContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = resourceName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  // Placeholder methods for new quick actions
  requestFarmVisit(): void {
    alert('Farm visit request submitted! Our team will contact you shortly to schedule.');
  }

  reorderSupplies(): void {
    this.router.navigate(['/dashboard/supplies']);
  }

  viewFranchiseInfo(): void {
    alert('Displaying information about franchise opportunities...');
  }
}
