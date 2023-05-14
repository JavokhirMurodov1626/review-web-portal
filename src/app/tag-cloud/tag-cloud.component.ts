import { Component, Input, OnInit } from '@angular/core';
import {
  CloudData,
  CloudOptions,
  ZoomOnHoverOptions,
} from 'angular-tag-cloud-module';

@Component({
  selector: 'app-tag-cloud',
  templateUrl: './tag-cloud.component.html',
  styleUrls: ['./tag-cloud.component.scss'],
})
export class TagCloud implements OnInit {
  @Input() tags!: string[];

  options: CloudOptions = {
    // if width is between 0 and 1 it will be set to the width of the upper element multiplied by the value
    width: 1000,
    // if height is between 0 and 1 it will be set to the height of the upper element multiplied by the value
    height: 400,
    overflow: false,
  };

  zoomOnHoverOptions: ZoomOnHoverOptions = {
    scale: 1.2,
    transitionTime: 0.25,
    delay: 0.25,
  };

  data: CloudData[] = [];

  ngOnInit() {
    let tagMap = new Map();

    for (let i = 0; i < this.tags.length; i++) {
      let tag = this.tags[i];

      tagMap.set(tag,tagMap.get(tag)?(tagMap.get(tag)+1):1);

    }

    //populating tag cloud data
    this.data=this.tags.map(tag=>{
      return {
        text:tag,
        weight:tagMap.get(tag)
      }
    })

  }

  logClicked(clicked: CloudData) {
    // console.log(clicked);
    return;
  }
}
