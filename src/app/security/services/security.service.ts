import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(private readonly http: HttpClient) { }


  public login(params: any) : Observable<any> {
    return this.http.post<String>(`authenticate`, params);
  }

  public register(params: any) : Observable<any> {
    return this.http.post<any>(`register`, params);
  }

  public resendConfirmation(email: string): Observable<{ accepted: boolean }> {
    return this.http.post<{ accepted: boolean }>(`resendConfirmation`, { email });
  }

}
