import { Injectable } from '@angular/core';
import { ImageFile } from '../create-review/create-review.component';

@Injectable({
  providedIn: 'root',
})
export class EncodeImagesService {
  
  convertFileToBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };

      reader.onerror = () => {
        reject(new Error('Failed to read the file'));
      };

      reader.readAsDataURL(file);
    });
  }

  async encodeImages(images: ImageFile[]) {
    const encodedImages: string[] = [];

    for (let i = 0; i < images.length; i++) {
      const base64String = await this.convertFileToBase64(images[i].file);
      encodedImages.push(base64String);
    }

    return encodedImages;
  }
}
