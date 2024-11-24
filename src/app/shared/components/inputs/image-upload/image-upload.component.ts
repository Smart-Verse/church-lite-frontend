import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {Ripple} from "primeng/ripple";
import {LoadingComponent} from "../../loading/loading.component";
import {ImageUploadService} from "./image-upload.service";
import {base64ToArrayBuffer, generateUUIDv4} from "../../../util/constants";
import {ToastService} from "../../../services/toast/toast.service";
import {AppControlValueAccessor} from "../../../interfaces/app-control-value";
import {FieldsService} from "../../../services/fields/fields.service";
import {File} from "node:buffer";
import {arrayBuffer} from "node:stream/consumers";



@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    Ripple,
    LoadingComponent,
  ],
  providers: [
    ImageUploadService,
    ToastService
  ],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss'
})
export class ImageUploadComponent extends AppControlValueAccessor{

  _image: File | null = null;
  @Input() imageUrl: string | null = null;
  @Input() tokenImageUrl: string = "";
  @Output() eventLoading: EventEmitter<void> = new EventEmitter();
  @Output() eventImageToken: EventEmitter<string> = new EventEmitter();

  constructor(
    private readonly imageUploadService: ImageUploadService,
    private readonly toastService: ToastService,
    private readonly fieldServiceInputText: FieldsService
  ) {
    super(fieldServiceInputText);
  }

  onFileInput(): void {
    document.getElementById('fileInput')?.click();
  }

  onImageSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this._image = null;
        this.imageUrl = "";
      } else {
        this._image = file;
        const reader = new FileReader();
        reader.onload = () => {
          this.onShowLoading();
          if(this._image){
            this.tokenImageUrl = generateUUIDv4().toUpperCase() + "/" +this._image.name;
            this.imageUploadService.onRequestUpload(this.tokenImageUrl).subscribe({
              next: (res) => {
                var arr = base64ToArrayBuffer(reader.result);
                this.onSendAws(res.url, arr);
              },
              error: (err) => {
                this.onShowLoading();
              }
            })
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }


  private onSendAws(url: string, arrayBuffer: ArrayBuffer) {
    this.imageUploadService.onUpload(url, arrayBuffer).subscribe({
      next: (res) => {
        this.onRequestDonwload();
      },
      error: (err) => {
        this.onShowLoading();
      }
    });
  }

  private onRequestDonwload(){
    this.imageUploadService.onRequestDonwload(this.tokenImageUrl).subscribe({
      next: (res) => {
        this.imageUrl = res.url;
        this.onShowLoading();
        this.onImageToken();
      },
      error: (err) => {
        this.onShowLoading();
      }
    });
  }

  public onDeleteImage(){
    this.onShowLoading();
    if(this.tokenImageUrl !== ""){
      this.imageUploadService.onDeleteObject(this.tokenImageUrl).subscribe({
        next: (res) => {
          this.tokenImageUrl = "";
          this._image = null;
          this.imageUrl = null;
          this.onImageToken();
          this.onShowLoading();
          this.toastService.success({summary: "Mensagem", detail: "Imagem excluida com sucesso"});
        },
        error: (err) => {
          this.onShowLoading();
        }
      });
    }
  }

  public onShowLoading() {
    this.eventLoading.emit();
  }

  public onImageToken() {
    this.eventImageToken.emit(this.tokenImageUrl);
  }

}
