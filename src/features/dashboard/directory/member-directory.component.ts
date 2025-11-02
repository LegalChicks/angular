import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-member-directory',
  templateUrl: './member-directory.component.html',
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberDirectoryComponent implements OnInit {
  authService = inject(AuthService);

  isLoading = signal(true);
  allMembers = signal<User[]>([]);
  searchTerm = signal('');

  publicMembers = computed(() => this.allMembers().filter(m => m.visibility === 'public'));

  filteredMembers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) {
      return this.publicMembers();
    }
    return this.publicMembers().filter(
      member =>
        member.name.toLowerCase().includes(term) ||
        member.email.toLowerCase().includes(term)
    );
  });

  async ngOnInit() {
    this.isLoading.set(true);
    try {
      const members = await this.authService.getMembers();
      this.allMembers.set(members);
    } catch (error) {
      console.error('Error loading members:', error);
      this.allMembers.set([]);
    } finally {
      this.isLoading.set(false);
    }
  }

  // Refresh members list
  async refreshMembers() {
    this.isLoading.set(true);
    try {
      const members = await this.authService.getMembers();
      this.allMembers.set(members);
    } catch (error) {
      console.error('Error refreshing members:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }
}
