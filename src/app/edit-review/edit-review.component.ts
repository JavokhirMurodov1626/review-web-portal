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
  fetchedReviewImages!: { imageUrl: string; filename: string }[];
  reviewImages: ImageFile[] = [];
  richtextContent!: string;
  tag: string = '';
  tags!: string[];
  reviewedProductGrade!: number;
  public Editor = ClassicEditor;
  isSubmitted: boolean = false;
  currentUser!: Subscription;
  encodedImages!: string[];
  isLoading: boolean = false;

  constructor(
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private reviewService: ReviewService,
    private encodeImages: EncodeImagesService,
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
        this.fetchedReviewImages = res.review.images;
        this.richtextContent = res.review.content;
        this.tags = res.review.tags.map((tag) => tag.name);
        this.reviewedProductGrade = res.review.productGrade;
        this.isLoading = false;
      },
      error: (error) => {
        console.log(error);
        this.isLoading = false;
      },
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
      productGrade: this.reviewedProductGrade,
    };
    
    this.isSubmitted = true;
    this.isLoading = true;

    if (this.reviewFrom.form.valid) {
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
          console.log(error);
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.currentUser.unsubscribe();
  }
}
