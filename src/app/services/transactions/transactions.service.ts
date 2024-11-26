import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {EnumCookie} from "../../shared/services/cookies/cookie.enum";

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  constructor(private readonly http: HttpClient) { }

  public getIDCashTransaction(cash: any) : Observable<any> {
    return this.http.get<any>(`getIDCashTransaction?cash=${cash}`);
  }

  public getSumValuesCash(cash: any) : Observable<any> {
    return this.http.get<any>(`getSumValuesCash?cashTransaction=${cash}`);
  }

}
