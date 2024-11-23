import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {Ripple} from "primeng/ripple";
import {LoadingComponent} from "../../loading/loading.component";
import {ImageUploadService} from "./image-upload.service";
import {BaseComponent} from "../../../common/base-component/base-component";
import {base64ToArrayBuffer, generateUUIDv4} from "../../../util/constants";
import {ToastService} from "../../../services/toast/toast.service";



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
export class ImageUploadComponent extends BaseComponent{

  _image: File | null = null;
  _imageUrl: string | null = null;
  _tokenImageUrl: string = "";

  constructor(
    private readonly imageUploadService: ImageUploadService,
    private readonly toastService: ToastService,
  ) {
    super();
  }

  onFileInput(): void {
    document.getElementById('fileInput')?.click();
  }

  onImageSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this._image = null;
        this._imageUrl = "";
      } else {
        this._image = file;
        const reader = new FileReader();
        reader.onload = () => {
          this.onShowLoading();
          if(this._image){
            this._tokenImageUrl = generateUUIDv4().toUpperCase() + "/" +this._image.name;
            this.imageUploadService.onRequestUpload(this._tokenImageUrl).subscribe({
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
    this.imageUploadService.onRequestDonwload(this._tokenImageUrl).subscribe({
      next: (res) => {
        this._imageUrl = res.url;
        this.onShowLoading();
      },
      error: (err) => {
        this.onShowLoading();
      }
    });
  }

  public onDeleteImage(){
    this.onShowLoading();
    if(this._tokenImageUrl !== ""){
      this.imageUploadService.onDeleteObject(this._tokenImageUrl).subscribe({
        next: (res) => {
          this._tokenImageUrl = "";
          this._image = null;
          this._imageUrl = null;
          this.onShowLoading();
          this.toastService.success({summary: "Mensagem", detail: "Imagem excluida com sucesso"});
        },
        error: (err) => {
          this.onShowLoading();
        }
      });
    }
  }
}
