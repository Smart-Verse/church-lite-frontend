import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {catchError, finalize, forkJoin, of, switchMap} from 'rxjs';
import {SharedCommonModule} from '../../shared/common/shared-common.module';
import {ImageUploadService} from '../../shared/components/inputs/image-upload/image-upload.service';
import {ToastService} from '../../shared/services/toast/toast.service';
import {MemberFeedService} from '../member-feed/member-feed.service';
import {FeedPost} from '../member-feed/member-feed.models';
import {CommunityGroup, CommunityGroupMember} from './member-groups.models';
import {MemberGroupsService} from './member-groups.service';

@Component({
  selector: 'app-member-group-detail',
  imports: [SharedCommonModule, FormsModule, RouterLink],
  providers: [ImageUploadService, ToastService],
  templateUrl: './member-group-detail.component.html',
  styleUrl: './member-group-detail.component.scss'
})
export class MemberGroupDetailComponent implements OnInit {
  group?: CommunityGroup;
  members: CommunityGroupMember[] = [];
  posts: FeedPost[] = [];
  content = '';
  editing = false;
  loading = true;
  saving = false;
  uploading = false;
  groupImageUrl: string | null = null;
  error = '';

  constructor(private readonly route: ActivatedRoute, private readonly groups: MemberGroupsService,
              private readonly feed: MemberFeedService, private readonly images: ImageUploadService,
              private readonly toast: ToastService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    const id = this.route.snapshot.paramMap.get('id')!;
    this.groups.list().pipe(switchMap(groups => {
      this.group = groups.find(item => item.id === id);
      if (!this.group) throw new Error('group_not_found');
      return forkJoin({
        // A visitor can see the group itself even when the member list is
        // protected (private groups). Keep the detail page usable in that case.
        members: this.groups.members(id).pipe(catchError(() => of([]))),
        // Feed availability must not prevent the group header/details from
        // rendering. Posts are simply shown as empty when the feed request
        // fails.
        posts: this.feed.list().pipe(catchError(() => of([]))),
        image: this.group.image
          ? this.images.onRequestDonwload(this.group.image).pipe(catchError(() => of(null)))
          : of(null)
      });
    }), finalize(() => this.loading = false)).subscribe({
      next: result => {
        this.members = result.members;
        this.posts = result.posts.filter(post => post.groupId === this.group?.id);
        this.groupImageUrl = result.image?.url ?? null;
      },
      error: () => this.error = 'Não foi possível carregar este grupo.'
    });
  }

  imageChanged(value: string): void { if (this.group) this.group.image = value || null; }
  toggleUpload(): void { this.uploading = !this.uploading; }

  save(): void {
    if (!this.group || !this.group.name.trim()) return;
    this.saving = true;
    this.groups.update(this.group).pipe(finalize(() => this.saving = false)).subscribe({
      next: group => { this.group = group; this.editing = false; this.toast.success({summary: 'Grupo', detail: 'Grupo atualizado com sucesso.'}); },
      error: () => this.toast.error({summary: 'Grupo', detail: 'Não foi possível atualizar o grupo.'})
    });
  }

  publish(): void {
    if (!this.group || !this.content.trim()) return;
    this.saving = true;
    this.feed.create(this.content, [], this.group.id).pipe(finalize(() => this.saving = false)).subscribe({
      next: post => { this.posts = [post, ...this.posts]; this.content = ''; },
      error: () => this.toast.error({summary: 'Grupo', detail: 'Não foi possível publicar no grupo.'})
    });
  }
}
