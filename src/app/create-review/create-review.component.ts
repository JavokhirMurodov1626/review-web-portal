import { EncodeImagesService } from './../services/uploadImages.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthService } from '../services/auth.service';
import { ReviewService } from '../services/review.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
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
export class CreateReviewComponent implements OnInit, OnDestroy {
  @ViewChild('f') reviewFrom!: NgForm;

  constructor(
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private reviewService: ReviewService,
    private encodeImages: EncodeImagesService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  //review inputs
  authorId!: number;
  reviewTitle: string = '';
  reviewDescription!: string;
  reviewedProductName: string = '';
  reviewedProductGroup: string = '';
  reviewImages: ImageFile[] = [];
  richtextContent: string = '';
  tag: string = '';
  tags: string[] = [];
  reviewedProductGrade: string = '';
  public Editor = ClassicEditor;
  isSubmitted: boolean = false;
  currentUser!: Subscription;
  encodedImages: string[]=[];
  isLoading: boolean = false;

  ngOnInit() {
    this.currentUser = this.authService.user.subscribe((user) => {
      if (user) {
        this.authorId = user.id;
      }
    });
  }

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target.files) {
      const image = target.files[0];
      const imageFile = {
        file: image,
        url: this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(image)
        ),
      };
      this.reviewImages.push(imageFile);
    }
  }

  removeImage(id: number) {
    this.reviewImages.splice(id, 1);
  }

  onGetDroppedFiles(files: ImageFile[]) {
    this.reviewImages.push(...files);
  }

  getTag(event:KeyboardEvent) {
    if(event.key==='Enter'){
      event.preventDefault();

    this.tag.replace(/\s+/g, ' ');
    if (this.tag.length > 1 && !this.tags.includes(this.tag)) {
      this.tag.split(',').forEach((tag) => {
        this.tags.push(tag.trim());
        this.tag = '';
      });
    }
    }
    
  }

  removeTag(index: number) {
    this.tags.splice(index, 1);
  }

  removeAllTags() {
    this.tags = [];
  }

  async handleEncodeImages(images: ImageFile[]) {
    try {
      const result = await this.encodeImages.encodeImages(images);
      this.encodedImages = result;
    } catch (error) {
      console.error('Error encoding images:', error);
    }
  }

  async onSubmit() {
    await this.handleEncodeImages(this.reviewImages);

    const reviewData = {
      authorId: this.authorId,
      title: this.reviewTitle,
      productName: this.reviewedProductName,
      productGroup: this.reviewedProductGroup,
      description: this.reviewDescription,
      content: this.richtextContent,
      tags: this.tags,
      images: this.encodedImages,
      productGrade: +this.reviewedProductGrade,
    };
    
    this.isSubmitted = true;
    if (this.reviewFrom.form.valid && this.encodedImages.length > 0) {
      this.isLoading = true;
      this.reviewService.createReview(reviewData).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.toastr.success(res.message);
          this.reviewFrom.reset();
          this.reviewImages = [];
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.toastr.error(error);
          this.isLoading = false;
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.currentUser.unsubscribe();
  }
}
