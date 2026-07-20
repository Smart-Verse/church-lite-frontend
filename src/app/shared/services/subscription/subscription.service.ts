import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { finalize } from 'rxjs';
import {
  CurrentSubscription,
  CurrentSubscriptionResponse,
  SubscriptionFeature,
  SubscriptionResource,
  SubscriptionResourceUsage
} from './subscription.models';

@Injectable({providedIn: 'root'})
export class SubscriptionService {
  private readonly currentState = signal<CurrentSubscription | null>(null);
  private readonly loadingState = signal(false);
  private readonly resolvedState = signal(false);
  private requestInProgress = false;

  readonly current = this.currentState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly resolved = this.resolvedState.asReadonly();
  readonly isFree = computed(() => this.currentState()?.planCode === 'FREE');
  readonly upgradeVisible = signal(false);

  constructor(private readonly http: HttpClient) {}

  load(force = false): void {
    if (this.requestInProgress || (!force && this.currentState())) return;
    this.requestInProgress = true;
    this.loadingState.set(true);
    this.http.get<CurrentSubscriptionResponse>('getCurrentSubscription')
      .pipe(finalize(() => {
        this.requestInProgress = false;
        this.loadingState.set(false);
        this.resolvedState.set(true);
      }))
      .subscribe({
        next: response => this.currentState.set(response.subscription),
        error: () => this.currentState.set(null)
      });
  }

  reset(): void {
    this.currentState.set(null);
    this.resolvedState.set(false);
    this.upgradeVisible.set(false);
  }

  resource(resource: SubscriptionResource): SubscriptionResourceUsage | undefined {
    return this.currentState()?.resources.find(item => item.resource === resource);
  }

  canCreate(resource: SubscriptionResource): boolean {
    return this.resource(resource)?.allowed ?? true;
  }

  hasFeature(feature: SubscriptionFeature): boolean {
    return this.currentState()?.features.find(item => item.feature === feature)?.enabled ?? true;
  }

  requestUpgrade(): void {
    this.upgradeVisible.set(true);
  }
}
