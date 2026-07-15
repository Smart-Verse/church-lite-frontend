import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import {Observable} from "rxjs";
import {RequestData} from "../../interfaces/request-data";

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(private readonly http: HttpClient) { }

  public onSave(route: string, params: any) : Observable<any> {
    return this.http.post<any>(`${route}`, params);
  }

  public onUpdate(route: string, id: any, params: any) : Observable<any> {
    return this.http.put<any>(`${route}/${id}`, params);
  }

  public onDelete(route: string, id: any) : Observable<any> {
    return this.http.delete<any>(`${route}/${id}`);
  }

  public onGet(route: string, id: any) : Observable<any> {
    return this.http.get<any>(`${route}/${id}`);
  }

  public onGetAll(route: string, params: RequestData): Observable<any> {
    const httpParams = new HttpParams()
      .set("size", String(params.size ?? 10))
      .set("offset", String(params.offset ?? 0))
      .set("filter", params.filter ?? "")
      .set("order", params.order ?? "")
      .set("displayFields", params.displayFields ?? "*");
    return this.http.get<any>(route, {params: httpParams});
  }

}
