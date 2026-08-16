import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { finalize } from 'rxjs';
import {
  BillingCycle,
  PaymentHistoryItem
} from '../../services/subscription/subscription.models';
import { SubscriptionService } from '../../services/subscription/subscription.service';
import { ToastService } from '../../services/toast/toast.service';
import { TranslateService } from '../../services/translate/translate.service';

@Component({
  selector: 'app-subscription-banner',
  imports: [CommonModule, FormsModule, ButtonModule, DialogModule, SelectModule],
  templateUrl: './subscription-banner.component.html',
  styleUrl: './subscription-banner.component.scss'
})
export class SubscriptionBannerComponent {
  readonly cycles: Array<{
    labelKey: string;
    value: BillingCycle;
    months: number;
    discount: number;
  }> = [
    {labelKey: 'subscription_cycle_monthly', value: 'MONTHLY', months: 1, discount: 0},
    {labelKey: 'subscription_cycle_quarterly', value: 'QUARTERLY', months: 3, discount: 10},
    {labelKey: 'subscription_cycle_semiannual', value: 'SEMIANNUAL', months: 6, discount: 15}
  ];

  billingCycle: BillingCycle = 'MONTHLY';
  checkoutPlan: 'ESSENTIAL' | 'PREMIUM' | null = null;
  history: PaymentHistoryItem[] = [];
  historyLoading = false;

  constructor(
    public readonly subscription: SubscriptionService,
    public readonly translate: TranslateService,
    private readonly toast: ToastService
  ) {}

  visibleChanged(visible: boolean): void {
    this.subscription.upgradeVisible.set(visible);
    if (visible) this.loadHistory();
  }

  checkout(planCode: 'ESSENTIAL' | 'PREMIUM'): void {
    if (this.checkoutPlan) return;
    this.checkoutPlan = planCode;
    this.subscription.createPaymentLink(planCode, this.billingCycle)
      .pipe(finalize(() => this.checkoutPlan = null))
      .subscribe({
        next: response => {
          const checkoutUrl = this.validCheckoutUrl(response.url);
          if (!checkoutUrl) {
            this.toast.error({
              summary: this.translate.translate('common_message'),
              detail: this.translate.translate('subscription_checkout_invalid_url')
            });
            return;
          }
          window.location.assign(checkoutUrl);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 403 || error.status === 422) return;
          this.toast.error({
            summary: this.translate.translate('common_message'),
            detail: this.translate.translate('subscription_checkout_error')
          });
        }
      });
  }

  total(planCode: 'ESSENTIAL' | 'PREMIUM'): number {
    const monthlyPrice = planCode === 'ESSENTIAL' ? 19.99 : 39.99;
    const cycle = this.cycles.find(item => item.value === this.billingCycle)!;
    return monthlyPrice * cycle.months * (1 - cycle.discount / 100);
  }

  money(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  cycleLabel(cycle: BillingCycle): string {
    const option = this.cycles.find(item => item.value === cycle);
    return option ? this.translate.translate(option.labelKey) : cycle;
  }

  statusLabel(status: string): string {
    return this.translate.translate(`subscription_payment_status_${status.toLowerCase()}`);
  }

  private loadHistory(): void {
    this.historyLoading = true;
    this.subscription.paymentHistory()
      .pipe(finalize(() => this.historyLoading = false))
      .subscribe({
        next: response => this.history = response.payments ?? [],
        error: () => this.history = []
      });
  }

  private validCheckoutUrl(value: string): string | null {
    try {
      const url = new URL(value);
      const localHttp = url.protocol === 'http:'
        && (url.hostname === 'localhost' || url.hostname === '127.0.0.1');
      return url.protocol === 'https:' || localHttp ? url.toString() : null;
    } catch {
      return null;
    }
  }
}
