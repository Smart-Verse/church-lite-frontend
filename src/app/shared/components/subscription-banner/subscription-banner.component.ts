import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SubscriptionService } from '../../services/subscription/subscription.service';
import { TranslateService } from '../../services/translate/translate.service';

@Component({
  selector: 'app-subscription-banner',
  imports: [ButtonModule, DialogModule],
  templateUrl: './subscription-banner.component.html',
  styleUrl: './subscription-banner.component.scss'
})
export class SubscriptionBannerComponent {
  constructor(
    public readonly subscription: SubscriptionService,
    public readonly translate: TranslateService
  ) {}
}
