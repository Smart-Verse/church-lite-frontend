import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {forkJoin, map} from 'rxjs';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {TableModule} from 'primeng/table';
import {MenuItem} from 'primeng/api';
import {SharedCommonModule} from '../../shared/common/shared-common.module';
import {LoadingComponent} from '../../shared/components/loading/loading.component';
import {CrudService} from '../../shared/services/crud/crud.service';
import {ToastService} from '../../shared/services/toast/toast.service';
import {TranslateService} from '../../shared/services/translate/translate.service';
import {RequestData} from '../../shared/interfaces/request-data';

@Component({
  selector: 'app-cells-operations',
  imports: [SharedCommonModule, LoadingComponent, BreadcrumbModule, TableModule],
  providers: [CrudService, ToastService],
  templateUrl: './cells-operations.component.html',
  styleUrl: './cells-operations.component.scss'
})
export class CellsOperationsComponent implements OnInit {
  mode: 'meetings' | 'visitors' = 'meetings';
  loading = false;
  selectedCell: any;
  selectedMeeting: any;
  meetings: any[] = [];
  visitors: any[] = [];
  attendances: any[] = [];
  prayers: any[] = [];
  home: MenuItem = {icon: 'pi pi-home', routerLink: '/home/dashboard'};
  items: MenuItem[] = [];
  meetingForm: FormGroup;
  visitorForm: FormGroup;
  attendanceForm: FormGroup;
  prayerForm: FormGroup;
  reviewForm: FormGroup;
  visitorStatuses = ['NEW', 'CONTACT_PENDING', 'CONTACTED', 'RETURNED', 'INTEGRATION', 'CONVERTED_TO_MEMBER', 'NOT_INTERESTED', 'NO_RESPONSE'].map(value => ({
    value,
    labelKey: `cells_visitor_status_${value.toLowerCase()}`
  }));
  attendanceTypes = ['MEMBER', 'VISITOR'].map(value => ({
    value,
    labelKey: `cells_attendance_type_${value.toLowerCase()}`
  }));
  prayerStatuses = ['OPEN', 'IN_FOLLOW_UP', 'ANSWERED', 'CLOSED'].map(value => ({
    value,
    labelKey: `cells_prayer_status_${value.toLowerCase()}`
  }));

  constructor(fb: FormBuilder, private crud: CrudService, private route: ActivatedRoute, private toast: ToastService, public translateService: TranslateService) {
    const now = new Date(), later = new Date(now.getTime() + 5400000), today = now.toISOString().slice(0, 10);
    this.meetingForm = fb.group({
      startAt: [this.local(now), Validators.required],
      endAt: [this.local(later), Validators.required],
      location: [''],
      theme: [''],
      study: [''],
      responsibleLeader: [null, Validators.required],
      adultCount: [0, Validators.min(0)],
      childrenCount: [0, Validators.min(0)],
      memberCount: [0, Validators.min(0)],
      visitorCount: [0, Validators.min(0)],
      decisions: [0, Validators.min(0)],
      reconciliations: [0, Validators.min(0)],
      offering: [null, Validators.min(0)],
      notes: ['']
    });
    this.visitorForm = fb.group({
      person: [null],
      name: ['', Validators.required],
      phone: [''],
      email: [''],
      firstVisitDate: [today, Validators.required],
      lastVisitDate: [today, Validators.required],
      visitCount: [1, Validators.min(1)],
      followUpResponsible: [null],
      status: ['NEW'],
      nextActionDate: [null],
      notes: ['']
    });
    this.attendanceForm = fb.group({type: ['MEMBER'], person: [null], visitor: [null], present: [true], notes: ['']});
    this.prayerForm = fb.group({
      person: [null],
      visitor: [null],
      description: ['', Validators.required],
      status: ['OPEN'],
      confidential: [false],
      followUpResponsible: [null],
      notes: ['']
    });
    this.reviewForm = fb.group({reason: ['']});
  }

  ngOnInit() {
    this.mode = this.route.snapshot.data['mode'] ?? 'meetings';
    this.items = [{label: this.t('cells_menu')}, {label: this.t('cells_' + this.mode)}];
  }

  opts(a: any[]) {
    return a.map(x => ({...x, label: this.t(x.labelKey)}));
  }

  onCellSelected() {
    this.selectedMeeting = null;
    if (!this.selectedCell?.id) return;
    this.loading = true;
    forkJoin({
      visitors: this.filtered('cellVisitor', `cell.id eq ${this.selectedCell.id}`),
      meetings: this.filtered('cellMeeting', `cell.id eq ${this.selectedCell.id}`)
    }).subscribe({
      next: r => {
        this.visitors = r.visitors;
        this.meetings = r.meetings;
        this.loading = false
      }, error: e => this.error(e)
    });
  }

  saveVisitor() {
    if (!this.valid(this.visitorForm)) return;
    const v = this.visitorForm.value;
    this.persist(this.crud.onSave('cellVisitor', {
      ...v,
      cell: this.selectedCell,
      status: v.status?.value ?? v.status
    }), () => this.onCellSelected());
  }

  saveMeeting() {
    if (!this.valid(this.meetingForm)) return;
    this.persist(this.crud.onSave('cellMeeting', {
      ...this.meetingForm.value,
      cell: this.selectedCell,
      status: 'DRAFT'
    }), () => this.onCellSelected());
  }

  selectMeeting(x: any) {
    this.selectedMeeting = x;
    this.loadDetails();
  }

  submit(x: any) {
    this.persist(this.crud.onSave('submitCellMeeting', {meetingId: x.id}), () => this.onCellSelected());
  }

  review(approved: boolean) {
    const reason = this.reviewForm.value.reason;
    if (!approved && !reason) {
      this.toast.warn({summary: this.t('common_message'), detail: this.t('cells_review_reason_required')});
      return
    }
    this.persist(this.crud.onSave('reviewCellMeeting', {
      meetingId: this.selectedMeeting.id,
      approved,
      reason
    }), () => this.onCellSelected());
  }

  saveAttendance() {
    if (!this.valid(this.attendanceForm)) return;
    const v = this.attendanceForm.value, type = v.type?.value ?? v.type, person = type === 'MEMBER' ? v.person : null,
      visitor = type === 'VISITOR' ? v.visitor : null;
    if (!person && !visitor) {
      this.toast.warn({summary: this.t('common_message'), detail: this.t('cells_attendance_subject_required')});
      return
    }
    this.persist(this.crud.onSave('cellAttendance', {
      ...v,
      type,
      person,
      visitor,
      meeting: this.selectedMeeting
    }), () => this.loadDetails());
  }

  savePrayer() {
    if (!this.valid(this.prayerForm)) return;
    const v = this.prayerForm.value;
    this.persist(this.crud.onSave('cellPrayerRequest', {
      ...v,
      status: v.status?.value ?? v.status,
      meeting: this.selectedMeeting
    }), () => this.loadDetails());
  }

  statusKey(x: string) {
    return 'cells_meeting_status_' + x.toLowerCase();
  }

  private loadDetails() {
    this.loading = true;
    forkJoin({
      attendances: this.filtered('cellAttendance', `meeting.id eq ${this.selectedMeeting.id}`),
      prayers: this.filtered('cellPrayerRequest', `meeting.id eq ${this.selectedMeeting.id}`)
    }).subscribe({
      next: r => {
        this.attendances = r.attendances;
        this.prayers = r.prayers;
        this.loading = false
      }, error: e => this.error(e)
    });
  }

  private filtered(route: string, filter: string) {
    const q = new RequestData();
    q.size = 500;
    q.offset = 1;
    q.filter = filter;
    return this.crud.onGetAll(route, q).pipe(map(r => r.contents ?? []));
  }

  private valid(f: FormGroup) {
    if (!this.selectedCell || f.invalid) {
      f.markAllAsTouched();
      this.toast.warn({summary: this.t('common_message'), detail: this.t('common_message_invalid_fields')});
      return false
    }
    return true
  }

  private persist(req: any, next: () => void) {
    this.loading = true;
    req.subscribe({
      next: () => {
        this.toast.success({summary: this.t('common_message'), detail: this.t('common_message_success')});
        next()
      }, error: (e: any) => this.error(e)
    });
  }

  private error(e: any) {
    this.loading = false;
    this.toast.error({summary: this.t('common_message'), detail: e?.error?.message ?? this.t('cells_operation_error')});
  }

  private local(d: Date) {
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
  }

  private t(k: string) {
    return this.translateService.translate(k);
  }
}
