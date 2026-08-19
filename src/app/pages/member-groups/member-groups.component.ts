import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {finalize} from 'rxjs';
import {SharedCommonModule} from '../../shared/common/shared-common.module';
import {ToastService} from '../../shared/services/toast/toast.service';
import {CommunityGroup} from './member-groups.models';
import {MemberGroupsService} from './member-groups.service';

@Component({
  selector: 'app-member-groups',
  imports: [SharedCommonModule, FormsModule, RouterLink],
  providers: [ToastService],
  templateUrl: './member-groups.component.html',
  styleUrl: './member-groups.component.scss'
})
export class MemberGroupsComponent implements OnInit {
  groups: CommunityGroup[] = [];
  loading = true;
  saving = false;
  creating = false;
  name = '';
  description = '';
  visibility: 'PUBLIC' | 'PRIVATE' = 'PUBLIC';

  constructor(private readonly api: MemberGroupsService, private readonly toast: ToastService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.api.list().pipe(finalize(() => this.loading = false)).subscribe({
      next: groups => this.groups = groups,
      error: () => this.toast.error({summary: 'Grupos', detail: 'Não foi possível carregar os grupos da comunidade.'})
    });
  }

  create(): void {
    const name = this.name.trim();
    if (!name) return;
    this.saving = true;
    this.api.create(name, this.description.trim(), this.visibility).pipe(finalize(() => this.saving = false)).subscribe({
      next: group => {
        this.groups = [group, ...this.groups];
        this.name = '';
        this.description = '';
        this.visibility = 'PUBLIC';
        this.creating = false;
        this.toast.success({summary: 'Grupos', detail: 'Grupo criado com sucesso.'});
      },
      error: () => this.toast.error({summary: 'Grupos', detail: 'Não foi possível criar o grupo.'})
    });
  }

  join(group: CommunityGroup): void {
    this.api.join(group.id).subscribe({
      next: () => this.toast.success({summary: 'Grupos', detail: group.visibility === 'PRIVATE' ? 'Solicitação enviada para aprovação.' : 'Você entrou no grupo.'}),
      error: () => this.toast.error({summary: 'Grupos', detail: 'Não foi possível solicitar entrada no grupo.'})
    });
  }
}
