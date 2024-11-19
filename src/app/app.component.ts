import { HttpClientModule } from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {Router, RouterOutlet} from '@angular/router';
import {MessageService, PrimeNGConfig} from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HttpModule } from './config/http/http.module';



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

  constructor(private config: PrimeNGConfig) {

  }

  ngOnInit(): void {
    this.config.ripple = true;
  }
}
