import {Component, effect, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import {SubscriptionService} from "../../shared/services/subscription/subscription.service";

@Component({
    selector: 'app-home',
    imports: [SidebarComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  constructor(
    public readonly subscription: SubscriptionService,
    private readonly router: Router
  ) {
    effect(() => {
      if (!this.subscription.resolved() || !this.subscription.isFree()) return;
      const path = this.router.url.split('?')[0];
      if (path === '/home' || path === '/home/dashboard') {
        this.router.navigate(['/home/scheduler'], {replaceUrl: true});
      }
    });
  }

  ngOnInit(): void {
    this.subscription.load();
  }
}
