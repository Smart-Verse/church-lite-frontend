import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {FeedPost} from './member-feed.models';

@Injectable({providedIn: 'root'})
export class MemberFeedService {
  private readonly url = `${environment.socialApiUrl}/social-api/feed`;

  constructor(private http: HttpClient) {
  }

  list(): Observable<FeedPost[]> {
    return this.http.get<FeedPost[]>(this.url)
  }

  create(content: string, images: string[]): Observable<FeedPost> {
    return this.http.post<FeedPost>(this.url, {content, images})
  }

  like(id: string): Observable<FeedPost> {
    return this.http.post<FeedPost>(`${this.url}/${id}/like`, {})
  }

  comment(id: string, content: string): Observable<FeedPost> {
    return this.http.post<FeedPost>(`${this.url}/${id}/comments`, {content})
  }

  reply(postId: string, commentId: string, content: string): Observable<FeedPost> {
    return this.http.post<FeedPost>(`${this.url}/${postId}/comments/${commentId}/replies`, {content})
  }

  commentLike(postId: string, commentId: string): Observable<FeedPost> {
    return this.http.post<FeedPost>(`${this.url}/${postId}/comments/${commentId}/like`, {})
  }

  visibility(id: string): Observable<FeedPost> {
    return this.http.post<FeedPost>(`${this.url}/${id}/visibility`, {})
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`)
  }

  deleteComment(postId: string, id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${postId}/comments/${id}`)
  }
}
