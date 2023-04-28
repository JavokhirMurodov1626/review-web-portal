import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export interface ImageFile {
  file: File;
  url: SafeUrl;
}

@Component({
  selector: 'app-create-review',
  templateUrl: './create-review.component.html',
  styleUrls: ['./create-review.component.scss'],
})
export class CreateReviewComponent {
  @ViewChild('f') reviewFrom!:NgForm

  constructor(private sanitizer: DomSanitizer) {}

  //review inputs
  reviewTitle:string=''
  reviewedProductName:string=''
  reviewedProductGroup:string=''
  reviewImages:ImageFile[]=[];
  richtextContent:string=''

  public Editor = ClassicEditor;

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    console.log(event)
    if (target && target.files) {
      const image = target.files[0];

      const imageFile: ImageFile = {
        file: image,
        url: this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(image)
        ),
      };
      this.reviewImages.push(imageFile);
    }
  }

  removeImage(id:number){
    this.reviewImages.splice(id,1)
  }

  onGetDroppedFiles(files:ImageFile[]){
    this.reviewImages.push(...files);
  }

  onSubmit(){
    console.log(this.reviewFrom.value)
  }
}
