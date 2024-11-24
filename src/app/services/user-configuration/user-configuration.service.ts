import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {RequestData} from "../../shared/interfaces/request-data";
import {CookiesService} from "../../shared/services/cookies/cookies.service";
import {EnumCookie} from "../../shared/services/cookies/cookie.enum";

@Injectable({
  providedIn: 'root'
})
export class UserConfigurationService {

  constructor(
    private readonly http: HttpClient,
    private readonly coockieservice: CookiesService
  ) { }

  public onSave( params: any) : Observable<any> {
    return this.http.post<any>(`userConfiguration`, params);
  }

  public onUpdate( id: any, params: any) : Observable<any> {
    return this.http.put<any>(`userConfiguration/${id}`, params);
  }

  public onDelete(id: any) : Observable<any> {
    return this.http.delete<any>(`userConfiguration/${id}`);
  }

  public onGet( id: any) : Observable<any> {
    return this.http.get<any>(`userConfiguration/${id}`);
  }

  public getUser() : Observable<any> {
    return this.http.get<any>(`getUser?hash=${this.coockieservice.get(EnumCookie.HASH)}`);
  }

  public onGetAll(params: RequestData) : Observable<any> {
    return this.http.get<any>(`userConfiguration?size=${params.size}&offset=${params.offset}&filter=${params.filter}&order=${params.order}&displayFields=${params.displayFields}`);
  }
}
