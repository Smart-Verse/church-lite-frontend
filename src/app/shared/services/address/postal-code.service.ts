import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

export interface PostalCodeAddress {postalCode: string; address: string; neighborhood: string; complement: string; city: any;}

@Injectable({providedIn: 'root'})
export class PostalCodeService {
  constructor(private readonly http: HttpClient) {}
  lookup(postalCode: string): Observable<PostalCodeAddress> {return this.http.get<PostalCodeAddress>('lookupPostalCode', {params: new HttpParams().set('postalCode', postalCode)});}
}
