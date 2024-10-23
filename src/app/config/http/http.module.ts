import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '../interceptor/auth-interceptor';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    provideHttpClient(
        withFetch(),
        withInterceptors([
          authInterceptor
        ])
    ),
    {
        provide: HttpClient
    },
]
})
export class HttpModule { }
