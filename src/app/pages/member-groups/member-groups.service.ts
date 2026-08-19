import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, map} from 'rxjs';
import {environment} from '../../../environments/environment';
import {CommunityGroup, CommunityGroupMember} from './member-groups.models';

@Injectable({providedIn: 'root'})
export class MemberGroupsService {
  private readonly url = environment.socialApiUrl;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<CommunityGroup[]> {
    return this.http.get<{groups: CommunityGroup[]}>(`${this.url}/listSocialGroups`).pipe(map(response => response.groups || []));
  }

  create(name: string, description: string, visibility: 'PUBLIC' | 'PRIVATE'): Observable<CommunityGroup> {
    return this.http.post<{group: CommunityGroup}>(`${this.url}/createSocialGroup`, {name, description, image: null, visibility})
      .pipe(map(response => response.group));
  }

  join(groupId: string): Observable<unknown> {
    return this.http.post(`${this.url}/joinSocialGroup`, {groupId});
  }

  update(group: CommunityGroup): Observable<CommunityGroup> {
    return this.http.post<{group: CommunityGroup}>(`${this.url}/updateSocialGroup`, {
      groupId: group.id, name: group.name, description: group.description, image: group.image, active: group.active
    }).pipe(map(response => response.group));
  }

  members(groupId: string): Observable<CommunityGroupMember[]> {
    return this.http.get<{members: CommunityGroupMember[]}>(`${this.url}/listSocialGroupMembers`, {params: {groupId}})
      .pipe(map(response => response.members || []));
  }
}
