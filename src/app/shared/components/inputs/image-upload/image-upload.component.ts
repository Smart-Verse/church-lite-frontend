import {Component, EventEmitter, Input, Output} from '@angular/core';

import {ButtonModule} from "primeng/button";
import {Ripple} from "primeng/ripple";
import {ImageUploadService} from "./image-upload.service";
import {base64ToArrayBuffer, generateUUIDv4} from "../../../util/constants";
import {ToastService} from "../../../services/toast/toast.service";
import {AppControlValueAccessor} from "../../../interfaces/app-control-value";
import {FieldsService} from "../../../services/fields/fields.service";
import {ImageCroppedEvent, ImageCropperComponent} from 'ngx-image-cropper';



@Component({
    selector: 'app-image-upload',
    imports: [
    ButtonModule,
    Ripple,
    ImageCropperComponent,
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
  @Input() ownerId: string = "";
  @Input() cropAspectRatio?: number;
  @Input() cropResizeWidth = 1600;
  @Output() eventLoading: EventEmitter<void> = new EventEmitter();
  @Output() eventImageToken: EventEmitter<string> = new EventEmitter();
  imageChangedEvent: Event | null = null;
  croppedImage: Blob | null = null;
  cropVisible = false;

  constructor(
    private readonly imageUploadService: ImageUploadService,
    private readonly toastService: ToastService,
    private readonly fieldServiceInputText: FieldsService
  ) {
    super(fieldServiceInputText);
  }

  onFileInput(fileInput?: HTMLInputElement): void {
    fileInput?.click();
  }

  onImageSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this._image = null;
        this.imageUrl = "";
      } else if (this.cropAspectRatio) {
        this.imageChangedEvent = event;
        this.croppedImage = null;
        this.cropVisible = true;
      } else {
        this._image = file;
        const reader = new FileReader();
        reader.onload = () => {
          this.onShowLoading();
          if(this._image){
            const imageId = generateUUIDv4().toUpperCase();
            const extension = this.imageExtension(this._image.name);
            const folder = this.ownerId || imageId;
            this.tokenImageUrl = `${folder}/${imageId}${extension}`;
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

  onImageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.blob ?? null;
  }

  cancelCrop(fileInput?: HTMLInputElement): void {
    this.cropVisible = false;
    this.imageChangedEvent = null;
    this.croppedImage = null;
    if (fileInput) fileInput.value = '';
  }

  async confirmCrop(fileInput?: HTMLInputElement): Promise<void> {
    if (!this.croppedImage) return;
    const imageId = generateUUIDv4().toUpperCase();
    const folder = this.ownerId || imageId;
    this.tokenImageUrl = `${folder}/${imageId}.jpg`;
    const buffer = await this.croppedImage.arrayBuffer();
    this.cropVisible = false;
    this.imageChangedEvent = null;
    this.croppedImage = null;
    if (fileInput) fileInput.value = '';
    this.onShowLoading();
    this.imageUploadService.onRequestUpload(this.tokenImageUrl).subscribe({
      next: res => this.onSendAws(res.url, buffer),
      error: () => this.onShowLoading()
    });
  }


  private imageExtension(fileName: string): string {
    const lastDot = fileName.lastIndexOf(".");
    if (lastDot <= 0 || lastDot === fileName.length - 1) return "";
    return fileName.substring(lastDot).toLowerCase().replace(/[^.a-z0-9]/g, "");
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
