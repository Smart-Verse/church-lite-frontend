import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type NotificationType =
  | 'APPOINTMENT_24_HOURS'
  | 'APPOINTMENT_1_HOUR'
  | 'CASH_PENDING_APPROVAL'
  | 'CASH_APPROVED'
  | 'CASH_REJECTED';

export interface UserNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  readAt?: string | null;
  referenceType?: string | null;
  referenceId?: string | null;
  actionUrl?: string | null;
}

export interface NotificationListResponse {
  notifications: UserNotification[];
  unreadCount: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private readonly http: HttpClient) {}

  list(unreadOnly = false): Observable<NotificationListResponse> {
    return this.http.get<NotificationListResponse>('getNotifications', {
      params: new HttpParams().set('unreadOnly', unreadOnly),
    });
  }

  markRead(notificationId: string): Observable<{ notification: UserNotification }> {
    return this.http.post<{ notification: UserNotification }>('markNotificationRead', { notificationId });
  }

  markAllRead(): Observable<{ unreadCount: number }> {
    return this.http.post<{ unreadCount: number }>('markAllNotificationsRead', { all: true });
  }
}
