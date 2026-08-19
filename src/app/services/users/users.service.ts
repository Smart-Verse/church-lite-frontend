import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ChurchUserInput {
  name: string;
  email: string;
  phone?: string;
  cpf: string;
  password: string;
}

export interface UserConfiguration {
  id?: string;
  hash?: string;
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  userPhoto?: string;
  theme?: string;
  lang?: string;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private readonly http: HttpClient) {}

  create(input: ChurchUserInput): Observable<{ user: UserConfiguration }> {
    return this.http.post<{ user: UserConfiguration }>('createChurchUser', input);
  }

  get(id: string): Observable<UserConfiguration> {
    return this.http.get<UserConfiguration>(`userConfiguration/${id}`);
  }

  update(id: string, user: UserConfiguration): Observable<UserConfiguration> {
    return this.http.put<UserConfiguration>(`userConfiguration/${id}`, user);
  }

  linkMember(memberId: string, userId: string): Observable<{ linked: boolean }> {
    return this.http.post<{ linked: boolean }>('linkMemberPortalUser', {memberId, userId});
  }

  promoteMember(memberId: string): Observable<{ user: UserConfiguration }> {
    return this.http.post<{ user: UserConfiguration }>('promoteMemberPortalUser', {memberId});
  }

  deleteAdministrativeUser(userConfigurationId: string): Observable<{ deleted: boolean }> {
    return this.http.post<{ deleted: boolean }>('deleteChurchUser', {userConfigurationId});
  }
}
