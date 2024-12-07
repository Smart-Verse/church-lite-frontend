import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {isPlatformBrowser} from "@angular/common";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private model: any[] = [];

  constructor(private readonly http: HttpClient) { }

  loadModelRegister(): Observable<void> {

    let urlProduction = "";
    if(environment.production){
      urlProduction = "/church-lite"
    }

    return this.http.get<any[]>(`${urlProduction}/assets/configuration/view.json`).pipe(
      map((data) => {
        this.model = data;
      })
    );
  }

  getModel(key: string): any {
    return this.model.filter(e => e.hash === key)[0];
  }

}
