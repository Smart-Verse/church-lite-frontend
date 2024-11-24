import { HttpClientModule } from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {Router, RouterOutlet} from '@angular/router';
import {MessageService, PrimeNGConfig} from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HttpModule } from './config/http/http.module';
import {UserConfigurationService} from "./services/user-configuration/user-configuration.service";
import {ImageUploadService} from "./shared/components/inputs/image-upload/image-upload.service";



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HttpClientModule,
    ToastModule,
    ReactiveFormsModule,
    HttpModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    MessageService,
  ],
})
export class AppComponent implements OnInit{
  title = 'church-lite-frontend';

  constructor(
    private config: PrimeNGConfig
  ) {

  }

  ngOnInit(): void {
    this.config.ripple = true;
  }
}
