import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageFile } from './create-review.component';

@Directive({
  selector: '[appDrag]',
})
export class DragDirective {
  @Output() dropFiles = new EventEmitter<ImageFile[]>();

  @HostBinding('style.backgroundColor') background = '';

  images: ImageFile[] = [];

  constructor(private sanitizer: DomSanitizer) {}

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.background='#eee'
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.background = '#fff';
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer) {
      let files = event.dataTransfer.files;
      for (let i = 0; i < files.length; i++) {
        let imagefile = {
          file: files[i],
          url: this.sanitizer.bypassSecurityTrustUrl(
            window.URL.createObjectURL(files[i])
          ),
        };
        this.images.push(imagefile);
      }
      this.dropFiles.emit(this.images);
    }
  }
}
