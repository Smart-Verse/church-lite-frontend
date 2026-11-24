import { Injectable, computed, signal } from '@angular/core';
import {
  CurrentSubscription,
  SubscriptionFeature,
  SubscriptionResource,
  SubscriptionResourceUsage
} from './subscription.models';

@Injectable({providedIn: 'root'})
export class SubscriptionService {
  private readonly currentState = signal<CurrentSubscription | null>(null);
  private readonly loadingState = signal(false);
  private readonly resolvedState = signal(true);

  readonly current = this.currentState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly resolved = this.resolvedState.asReadonly();
  readonly isFree = computed(() => false);
  readonly upgradeVisible = signal(false);

  load(_force = false): void {
    this.resolvedState.set(true);
  }

  reset(): void {
    this.currentState.set(null);
    this.resolvedState.set(true);
    this.upgradeVisible.set(false);
  }

  resource(_resource: SubscriptionResource): SubscriptionResourceUsage | undefined {
    return undefined;
  }

  canCreate(_resource: SubscriptionResource): boolean {
    return true;
  }

  hasFeature(_feature: SubscriptionFeature): boolean {
    return true;
  }

  requestUpgrade(): void {
    this.upgradeVisible.set(false);
  }
}
