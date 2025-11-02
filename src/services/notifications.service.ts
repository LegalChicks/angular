import { Injectable, signal, computed } from '@angular/core';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private notifications = signal<Notification[]>([]);

  // Unread count
  unreadCount = computed(() => 
    this.notifications().filter(n => !n.read).length
  );

  // Recent notifications (last 10)
  recentNotifications = computed(() => 
    [...this.notifications()].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10)
  );

  constructor() {
    this.loadNotifications();
    // Demo notifications
    if (this.notifications().length === 0) {
      this.addDemoNotifications();
    }
  }

  private loadNotifications() {
    try {
      const stored = localStorage.getItem('lcen_notifications');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.notifications.set(
          parsed.map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp)
          }))
        );
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }

  private saveNotifications() {
    try {
      localStorage.setItem('lcen_notifications', JSON.stringify(this.notifications()));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }

  private addDemoNotifications() {
    const demos: Notification[] = [
      {
        id: '1',
        type: 'success',
        title: 'Welcome to LCEN!',
        message: 'Your account has been successfully activated. Start exploring the portal!',
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        read: false,
        actionUrl: '/dashboard/overview',
        actionLabel: 'Go to Dashboard'
      },
      {
        id: '2',
        type: 'info',
        title: 'New Supply Available',
        message: 'Day-Old RIR Chicks are now available for order. Place your order now!',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        read: false,
        actionUrl: '/dashboard/supplies',
        actionLabel: 'View Supplies'
      },
      {
        id: '3',
        type: 'info',
        title: 'Weekly Summary Ready',
        message: 'Your farm performance summary for this week is ready to view.',
        timestamp: new Date(Date.now() - 7200000), // 2 hours ago
        read: true,
        actionUrl: '/dashboard/analytics',
        actionLabel: 'View Summary'
      }
    ];
    
    this.notifications.set(demos);
    this.saveNotifications();
  }

  add(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };

    this.notifications.update(n => [newNotification, ...n]);
    this.saveNotifications();
    return newNotification;
  }

  markAsRead(id: string) {
    this.notifications.update(n => 
      n.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
    this.saveNotifications();
  }

  markAllAsRead() {
    this.notifications.update(n => 
      n.map(notif => ({ ...notif, read: true }))
    );
    this.saveNotifications();
  }

  remove(id: string) {
    this.notifications.update(n => n.filter(notif => notif.id !== id));
    this.saveNotifications();
  }

  clearAll() {
    this.notifications.set([]);
    this.saveNotifications();
  }

  getAll() {
    return this.notifications();
  }
}

