import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  constructor(private readonly http: HttpClient) { }

  public onRequestUpload(imageName: string) : Observable<any> {
    return this.http.get<any>(`requestUpload?fileName=${imageName}&expired=10000`);
  }

  public onUpload(url: string, file: ArrayBuffer) : Observable<any> {
    return this.http.post<any>(url, file);
  }
}
