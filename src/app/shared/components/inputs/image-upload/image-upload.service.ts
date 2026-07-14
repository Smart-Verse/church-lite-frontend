import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  constructor(private readonly http: HttpClient) { }

  public onRequestUpload(imageName: string) : Observable<any> {
    return this.http.get<any>(`requestUpload?fileName=${imageName}&expired=10000`);
  }

  public onRequestDonwload(imageName: string) : Observable<any> {
    return this.http.get<any>(`requestUrl?fileName=${imageName}&expired=10000`);
  }

  public onDeleteObject(imageName: string) : Observable<any> {
    return this.http.get<any>(`deleteObject?fileName=${imageName}`);
  }

  public onUpload(url: string, file: ArrayBuffer) : Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/octet-stream', // Define o tipo como binário
    });
    return this.http.put<any>(url, file, { headers });
  }
}
