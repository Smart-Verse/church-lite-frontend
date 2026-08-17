import { Component, OnInit } from '@angular/core';
import { SharedCommonModule } from '../../shared/common/shared-common.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { BaseComponent } from '../../shared/common/base-component/base-component';
import { TranslateService } from '../../shared/services/translate/translate.service';
import { gender, maritalStatus, status } from '../../shared/util/constants';
import { FormGroup } from '@angular/forms';
import { FieldsService } from '../../shared/services/fields/fields.service';
import { PersonConfig } from './person.config';
import { ToastService } from '../../shared/services/toast/toast.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageUploadService } from '../../shared/components/inputs/image-upload/image-upload.service';
import { CrudService } from '../../shared/services/crud/crud.service';
import {PostalCodeService} from '../../shared/services/address/postal-code.service';

@Component({
  selector: 'app-person-members',
  imports: [SharedCommonModule, BreadcrumbModule],
  providers: [ToastService, DatePipe, ImageUploadService, CrudService],
  templateUrl: './person.component.html',
  styleUrl: './person.component.scss',
})
export class PersonComponent extends BaseComponent implements OnInit {
  public personFormGroup: FormGroup;
  protected readonly _status = status;
  protected readonly _gender = gender;
  protected readonly _maritalStatus = maritalStatus;
  configPerson: PersonConfig = new PersonConfig();
  _type: string = 'MEMBER';
  public imageToken = '';
  public urlImage = '';
  public context = 'personMembers';
  public personId: string | null = null;
  public pageTitle = 'personal_page_member_title';
  public isSaving = false;
  private lastPostalCode = '';
  public breadcrumbItems: MenuItem[] = [];
  public breadcrumbHome: MenuItem = {
    icon: 'pi pi-home',
    routerLink: '/home/dashboard',
  };

  get showMinisterial(): boolean {
    return this._type === 'MEMBER' || this._type === 'NEW_CONVERT';
  }

  constructor(
    private readonly fieldsService: FieldsService,
    public readonly translatePersonMembers: TranslateService,
    private readonly toastService: ToastService,
    private readonly datePipe: DatePipe,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly imageService: ImageUploadService,
    private readonly crudService: CrudService,
    private readonly postalCodeService: PostalCodeService,
  ) {
    super();
    this.personFormGroup = this.fieldsService.onCreateFormBuiderDynamic(
      this.configPerson.person,
    );
  }

  ngOnInit(): void {
    this.context = this.route.snapshot.paramMap.get('hash') ?? 'personMembers';
    this.personId = this.route.snapshot.paramMap.get('id');
    this.setConfigContext(this.context);

    if (this.personId && this.personId !== 'new') {
      this.loadPerson(this.personId);
    }
  }

  private loadPerson(id: string): void {
    this.showLoading = true;
    this.crudService.onGet('person', id).subscribe({
      next: (person) => {
        this.patchPerson(person);
        this.showLoading = false;
      },
      error: (error) => {
        this.showLoading = false;
        this.toastService.error({
          summary: 'Mensagem',
          detail: error.error?.message ?? 'Falha ao carregar o cadastro',
        });
        this.navigateToList();
      },
    });
  }

  private patchPerson(person: any): void {
    const data = {
      ...person,
      status: status.find((item) => item.key === person.status),
      maritalStatus: this._maritalStatus.find(
        (item) => item.key === person.maritalStatus,
      ),
      gender: this._gender.find((item) => item.key === person.gender),
      personalDocs: {
        ...person.personalDocs,
        birthDate: this.onConvertDate(person.personalDocs?.birthDate),
      },
      personAddress: person.personAddress ?? {},
      personalEmail: person.personalEmail ?? {},
      personalTelphone: person.personalTelphone ?? {},
      personMember: {
        ...person.personMember,
        entryDate: this.onConvertDate(person.personMember?.entryDate),
        dateBaptism: this.onConvertDate(person.personMember?.dateBaptism),
      },
    };

    this.imageToken = person.image ?? '';
    this.personFormGroup.patchValue(data);
    if (this.imageToken) {
      this.onGetUrlImage();
    }
  }

  onConvertDate(data: any): Date | null {
    return data ? new Date(data) : null;
  }

  onSave(): void {
    if (!this.personFormGroup.valid) {
      this.toastService.warn({
        summary: 'Mensagem',
        detail: this.translatePersonMembers.translate(
          'common_message_invalid_fields',
        ),
      });
      this.fieldsService.verifyIsValid();
      return;
    }

    const person = this.configPerson.convertPersonToDTO(
      this.personFormGroup,
      this.datePipe,
      this._type,
      this.imageToken,
    );
    const request =
      this.personId && this.personId !== 'new'
        ? this.crudService.onUpdate('person', this.personId, person)
        : this.crudService.onSave('person', person);

    this.isSaving = true;
    this.showLoading = true;
    request.subscribe({
      next: () => {
        this.isSaving = false;
        this.showLoading = false;
        this.toastService.success({
          summary: 'Mensagem',
          detail: this.translatePersonMembers.translate(
            'common_message_success',
          ),
        });
        this.navigateToList();
      },
      error: (error) => {
        this.isSaving = false;
        this.showLoading = false;
        this.toastService.error({
          summary: 'Mensagem',
          detail: error.error?.message ?? 'Falha ao salvar o cadastro',
        });
      },
    });
  }

  onCancel(): void {
    this.navigateToList();
  }

  private navigateToList(): void {
    this.router.navigate(['/home/register', this.context]);
  }

  private setConfigContext(context: string): void {
    const contexts: Record<
      string,
      { type: string; title: string; listLabel: string }
    > = {
      personMembers: {
        type: 'MEMBER',
        title: 'personal_page_member_title',
        listLabel: 'registrations_persons_members',
      },
      personSupplier: {
        type: 'SUPPLIER',
        title: 'personal_page_supplier_title',
        listLabel: 'registrations_persons_suppliers',
      },
      personVisitor: {
        type: 'VISITOR',
        title: 'personal_page_visitor_title',
        listLabel: 'registrations_persons_visitor',
      },
      personNewConvert: {
        type: 'NEW_CONVERT',
        title: 'personal_page_new_convert_title',
        listLabel: 'registrations_persons_new_convert',
      },
      personChurch: {
        type: 'CHURCH',
        title: 'personal_page_church_title',
        listLabel: 'registrations_persons',
      },
    };
    const selectedContext = contexts[context] ?? contexts['personMembers'];
    this._type = selectedContext.type;
    this.pageTitle = selectedContext.title;
    this.breadcrumbItems = [
      { label: this.translatePersonMembers.translate('registrations') },
      {
        label: this.translatePersonMembers.translate(selectedContext.listLabel),
        routerLink: ['/home/register', this.context],
      },
      { label: this.translatePersonMembers.translate(this.pageTitle) },
    ];
  }

  public loading(): void {
    this.onShowLoading();
  }

  public onGetTokenImage(image: any): void {
    this.imageToken = image;
  }

  lookupPostalCode(): void {
    const addressGroup = this.personFormGroup.get('personAddress');
    const postalCode = String(addressGroup?.get('postalCode')?.value ?? '').replace(/\D/g, '');
    if (postalCode.length !== 8 || postalCode === this.lastPostalCode) return;
    this.postalCodeService.lookup(postalCode).subscribe({next: result => {
      this.lastPostalCode = postalCode;
      addressGroup?.patchValue({postalCode: result.postalCode, address: result.address, neighborhood: result.neighborhood, city: result.city, ...(result.complement ? {complement: result.complement} : {})});
    }, error: error => this.toastService.warn({summary: this.translatePersonMembers.translate('common_message'), detail: this.translatePersonMembers.translate(error.error?.message ?? 'postal_code_lookup_error')})});
  }

  private onGetUrlImage(): void {
    this.imageService.onRequestDonwload(this.imageToken).subscribe({
      next: (res) => {
        this.urlImage = res['url'];
      },
      error: () => {
        this.toastService.error({
          summary: 'Mensagem',
          detail: 'Falha ao fazer download da imagem',
        });
      },
    });
  }
}
