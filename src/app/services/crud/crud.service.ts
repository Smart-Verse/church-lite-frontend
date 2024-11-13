import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {RequestData} from "../../shared/interfaces/request-data";

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

  public onGetAll(route: string, params: RequestData) : Observable<any> {
    return this.http.get<any>(`${route}?size=${params.size}&offset=${params.offset}&filter=${params.filter}&order=${params.order}&displayFields=${params.displayFields}`);
  }

}
