import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {finalize, forkJoin, of, switchMap} from 'rxjs';
import {SharedCommonModule} from '../../shared/common/shared-common.module';
import {ImageUploadService} from '../../shared/components/inputs/image-upload/image-upload.service';
import {ToastService} from '../../shared/services/toast/toast.service';
import {SocialProfile} from './member-profile.models';
import {MemberProfileService} from './member-profile.service';

@Component({
  selector: 'app-member-profile',
  imports: [SharedCommonModule, FormsModule],
  providers: [ImageUploadService, ToastService],
  templateUrl: './member-profile.component.html',
  styleUrl: './member-profile.component.scss'
})
export class MemberProfileComponent implements OnInit {
  profile?: SocialProfile;
  avatarUrl: string | null = null;
  coverUrl: string | null = null;
  loading = true;
  saving = false;
  uploading = false;
  error = '';

  constructor(private readonly service: MemberProfileService, private readonly images: ImageUploadService, private readonly toast: ToastService) {
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.service.get().pipe(switchMap(profile => {
      this.profile = profile;
      return forkJoin({
        avatar: profile.profileImage ? this.images.onRequestDonwload(profile.profileImage) : of(null),
        cover: profile.coverImage ? this.images.onRequestDonwload(profile.coverImage) : of(null)
      });
    }), finalize(() => this.loading = false)).subscribe({
      next: urls => {
        this.avatarUrl = urls.avatar?.url ?? null;
        this.coverUrl = urls.cover?.url ?? null;
      }, error: () => this.error = 'Não foi possível carregar seu perfil agora.'
    });
  }

  toggleUpload(): void {
    this.uploading = !this.uploading;
  }

  avatarChanged(value: string): void {
    if (this.profile) this.profile.profileImage = value || null;
  }

  coverChanged(value: string): void {
    if (this.profile) this.profile.coverImage = value || null;
  }

  save(): void {
    if (!this.profile || !this.profile.displayName.trim()) return;
    this.saving = true;
    this.service.update({
      displayName: this.profile.displayName,
      username: this.profile.username,
      bio: this.profile.bio,
      profileImage: this.profile.profileImage,
      coverImage: this.profile.coverImage
    }).pipe(finalize(() => this.saving = false)).subscribe({
      next: saved => {
        this.profile = saved;
        this.toast.success({summary: 'Perfil', detail: 'Perfil salvo com sucesso.'});
      }, error: () => this.toast.error({summary: 'Perfil', detail: 'Não foi possível salvar seu perfil.'})
    });
  }
}
