import {} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {Router, RouterOutlet} from '@angular/router';
import {PrimeNG} from 'primeng/config';
import { ToastModule } from 'primeng/toast';
import { HttpModule } from './config/http/http.module';
import {UserConfigurationService} from "./services/user-configuration/user-configuration.service";
import {ThemeService} from "./shared/services/theme/theme.service";



@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        ToastModule,
        ReactiveFormsModule,
        HttpModule
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'church-lite-frontend';

  constructor(
    private config: PrimeNG,
    private themeService: ThemeService
  ) {

  }

  ngOnInit(): void {
    this.config.ripple.set(true);
    this.themeService.setTheme('aura-light-purple');
  }
}
