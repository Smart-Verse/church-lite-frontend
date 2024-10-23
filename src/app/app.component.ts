import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
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
    MessageService
  ],
})
export class AppComponent {
  title = 'church-lite-frontend';
}
