import { Review } from './../services/review.model';
import { EncodeImagesService } from './../services/uploadImages.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AuthService } from '../services/auth.service';
import { ReviewService } from '../services/review.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';

export interface ImageFile {
  file: File;
  url: SafeUrl;
}

@Component({
  selector: 'app-edit-review',
  templateUrl: './edit-review.component.html',
  styleUrls: ['./edit-review.component.scss'],
})
export class EditReviewComponent implements OnInit, OnDestroy {
  @ViewChild('f') reviewFrom!: NgForm;

  //review inputs
  authorId!: number;
  reviewId!: number;
  //
  reviewTitle!: string;
  reviewDescription!: string;
  reviewedProductName!: string;
  reviewedProductGroup!: string;
  richtextContent!: string;
  tag: string = '';
  tags!: string[];
  reviewedProductGrade!: number;
  previousImages!:{imageUrl:string,generation:string,filename:string}[]

  //ckEditor initializing
  public Editor = ClassicEditor;

  isSubmitted: boolean = false;
  currentUser!: Subscription;
  encodedImages: string[] = [];
  isLoading: boolean = false;

  constructor(
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private reviewService: ReviewService,
    private encode: EncodeImagesService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    //getting reviewId from route
    this.route.paramMap.subscribe((params) => {
      if (params) {
        let paramId = params.get('id');
        this.reviewId = paramId ? +paramId : 0;
      }
    });

    this.currentUser = this.authService.user.subscribe((user) => {
      if (user) {
        this.authorId = user.id;
      }
    });

    this.isLoading = true;
    //assigning values
    this.reviewService.getSelectedReview(this.reviewId).subscribe({
      next: (res) => {
        this.reviewTitle = res.review.title;
        this.reviewDescription = res.review.description;
        this.reviewedProductName = res.review.product.name;
        this.reviewedProductGroup = res.review.group;
        this.encodedImages = res.review.images.map((image) => image.imageUrl);
        this.richtextContent = res.review.content;
        this.tags = res.review.tags.map((tag) => tag.name);
        this.reviewedProductGrade = res.review.productGrade;
        this.previousImages=res.review.images
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      },
    });
  }

  async onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target.files) {
      const image = target.files[0];
      const imageFile = {
        file: image,
        url: this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(image)
        ),
      };

      const codedImageFile = await this.encode.convertFileToBase64(
        imageFile.file
      );

      this.encodedImages.push(codedImageFile);
    }
  }

  removeImage(id: number) {
    this.encodedImages.splice(id, 1);
  }

  async onGetDroppedFiles(files: ImageFile[]) {
    const codedImages = await this.encode.encodeImages(files);

    this.encodedImages.push(...codedImages);
  }

  getTag() {
    this.tag.replace(/\s+/g, ' ');
    if (this.tag.length > 1 && !this.tags.includes(this.tag)) {
      this.tag.split(',').forEach((tag) => {
        this.tags.push(tag.trim());
        this.tag = '';
      });
    }
  }

  removeTag(index: number) {
    this.tags.splice(index, 1);
  }

  removeAllTags() {
    this.tags = [];
  }

  async onSubmit() {
    const reviewData = {
      reviewId:this.reviewId,
      authorId: this.authorId,
      title: this.reviewTitle,
      productName: this.reviewedProductName,
      productGroup: this.reviewedProductGroup,
      description: this.reviewDescription,
      content: this.richtextContent,
      tags: this.tags,
      images: this.encodedImages,
      productGrade: this.reviewedProductGrade,
      previousImages:this.previousImages,
    };

    this.isSubmitted = true;
    this.isLoading = true;

    if (this.reviewFrom.form.valid) {
      this.reviewService.editReview(reviewData).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.toastr.success(res.message);
          this.reviewFrom.reset();
          this.encodedImages = [];
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
