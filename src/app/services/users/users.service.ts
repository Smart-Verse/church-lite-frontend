import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ChurchUserInput {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export interface UserConfiguration {
  id?: string;
  hash?: string;
  name: string;
  email: string;
  phone?: string;
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
}
