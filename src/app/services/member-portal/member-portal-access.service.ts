import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface MemberRegistrationContext {
  churchName: string;
  memberId?: string | null;
  memberName?: string | null;
  maskedEmail?: string | null;
  existingMember: boolean;
}

export interface MemberRegistrationRequest {
  name: string;
  email: string;
  cpf: string;
  phone?: string;
  password: string;
  passwordConfirmation: string;
}

@Injectable({providedIn: 'root'})
export class MemberPortalAccessService {
  constructor(private readonly http: HttpClient) {}

  context(churchId: string, memberId?: string | null): Observable<MemberRegistrationContext> {
    return this.http.get<{context: MemberRegistrationContext}>('getMemberRegistrationContext', {
      params: {...(memberId ? {memberId} : {}), churchId}
    }).pipe(map(response => response.context));
  }

  register(churchId: string, memberId: string | null, request: MemberRegistrationRequest): Observable<{accepted: boolean; existingAccess: boolean}> {
    return this.http.post<{accepted: boolean; existingAccess: boolean}>('registerMemberAccess', {
      ...request, churchId, memberId
    });
  }

  churchLink(): Observable<{churchId: string; path: string}> {
    return this.http.get<{churchId: string; path: string}>('getMemberPortalLink');
  }

  memberLink(memberId: string): Observable<{path: string}> {
    return this.http.get<{path: string}>('getMemberPortalMemberLink', {params: {memberId}});
  }

  sendMemberLink(memberId: string): Observable<void> {
    return this.http.post<{sent: boolean}>('sendMemberPortalLink', {memberId}).pipe(map(() => void 0));
  }

  absoluteUrl(path: string): string {
    return new URL(path.replace(/^\/+/, ''), document.baseURI).toString();
  }

  async copyUrl(path: string): Promise<void> {
    const url = this.absoluteUrl(path);
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(url);
        return;
      } catch {
        // Alguns navegadores negam a Clipboard API mesmo em contexto seguro.
      }
    }

    const input = document.createElement('textarea');
    input.value = url;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    input.setSelectionRange(0, input.value.length);
    const copied = document.execCommand('copy');
    document.body.removeChild(input);
    if (!copied) throw new Error('clipboard_copy_failed');
  }
}
