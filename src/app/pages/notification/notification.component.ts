import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoadingComponent} from "../../shared/components/loading/loading.component";
import {TranslateService} from "../../shared/services/translate/translate.service";
import {BaseComponent} from "../../shared/common/base-component/base-component";
import {SharedCommonModule} from "../../shared/common/shared-common.module";
import {
  NotificationService,
  NotificationType,
  UserNotification
} from '../../services/notification/notification.service';

@Component({
  selector: 'app-notification',
  imports: [
    LoadingComponent,
    SharedCommonModule
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent extends BaseComponent implements OnInit {
  notifications: UserNotification[] = [];
  unreadCount = 0;
  unreadOnly = false;
  error = false;

  constructor(
    public readonly translateService: TranslateService,
    private readonly notificationService: NotificationService,
    private readonly router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.showLoading = true;
    this.error = false;
    this.notificationService.list(this.unreadOnly).subscribe({
      next: response => {
        this.notifications = response.notifications ?? [];
        this.unreadCount = response.unreadCount ?? 0;
        this.showLoading = false;
      },
      error: () => {
        this.error = true;
        this.showLoading = false;
      },
    });
  }

  setUnreadOnly(value: boolean): void {
    if (this.unreadOnly === value) return;
    this.unreadOnly = value;
    this.load();
  }

  markAllRead(): void {
    if (!this.unreadCount) return;
    this.notificationService.markAllRead().subscribe(() => this.load());
  }

  open(notification: UserNotification): void {
    const navigate = () => notification.actionUrl && this.router.navigateByUrl(notification.actionUrl);
    if (notification.readAt) {
      navigate();
      return;
    }
    this.notificationService.markRead(notification.id).subscribe({
      next: response => {
        notification.readAt = response.notification.readAt;
        this.unreadCount = Math.max(0, this.unreadCount - 1);
        if (this.unreadOnly) this.notifications = this.notifications.filter(item => item.id !== notification.id);
        navigate();
      },
    });
  }

  icon(type: NotificationType): string {
    if (type.startsWith('APPOINTMENT')) return 'pi pi-calendar';
    if (type === 'CASH_PENDING_APPROVAL') return 'pi pi-clock';
    if (type === 'CASH_REJECTED') return 'pi pi-times';
    return 'pi pi-check';
  }

  tone(type: NotificationType): string {
    if (type.startsWith('APPOINTMENT')) return 'appointment';
    if (type === 'CASH_PENDING_APPROVAL') return 'pending';
    if (type === 'CASH_REJECTED') return 'rejected';
    return 'approved';
  }
}
