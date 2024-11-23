import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {Ripple} from "primeng/ripple";
import {LoadingComponent} from "../../loading/loading.component";
import {ImageUploadService} from "./image-upload.service";
import {BaseComponent} from "../../../common/base-component/base-component";



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
    ImageUploadService
  ],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss'
})
export class ImageUploadComponent extends BaseComponent{

  _image: File | null = null;
  _imageUrl: string | null = null;

  constructor(
    private readonly imageUploadService: ImageUploadService
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
            let extension: any = this._image.type.split("/")[1];
            this.imageUploadService.onRequestUpload("54545454."+ extension).subscribe({
              next: (res) => {
                console.log(res);
                let arr = reader.result as ArrayBuffer;
                this.imageUploadService.onUpload(res.url, arr).subscribe({
                  next: (res) => {
                    console.log(res);
                    this.onShowLoading();
                  },
                  error: (err) => {
                    this.onShowLoading();
                  }
                });
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

}
