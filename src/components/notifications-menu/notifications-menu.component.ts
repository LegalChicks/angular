import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationsService, Notification } from '../../services/notifications.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-notifications-menu',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './notifications-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsMenuComponent {
  private notificationsService = inject(NotificationsService);
  private translationService = inject(TranslationService);

  isOpen = signal(false);
  notifications = this.notificationsService.recentNotifications;
  unreadCount = this.notificationsService.unreadCount;
  t = this.translationService.t;

  toggle() {
    this.isOpen.update(open => !open);
  }

  close() {
    this.isOpen.set(false);
  }

  markAsRead(notification: Notification) {
    this.notificationsService.markAsRead(notification.id);
  }

  markAllAsRead() {
    this.notificationsService.markAllAsRead();
  }

  removeNotification(id: string, event: Event) {
    event.stopPropagation();
    this.notificationsService.remove(id);
  }

  getNotificationIcon(type: Notification['type']): string {
    switch (type) {
      case 'success':
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'warning':
        return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z';
      case 'error':
        return 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z';
      default:
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }

  getNotificationColor(type: Notification['type']): string {
    switch (type) {
      case 'success':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900';
      case 'error':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900';
      default:
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900';
    }
  }

  formatTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  }
}

