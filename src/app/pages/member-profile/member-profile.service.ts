import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {SocialProfile,SocialProfileUpdate} from './member-profile.models';

@Injectable({providedIn:'root'})
export class MemberProfileService {
  private readonly url=`${environment.socialApiUrl}/social-api/profile`;
  constructor(private readonly http:HttpClient){}
  get():Observable<SocialProfile>{return this.http.get<SocialProfile>(this.url);}
  update(value:SocialProfileUpdate):Observable<SocialProfile>{return this.http.put<SocialProfile>(this.url,value);}
}
