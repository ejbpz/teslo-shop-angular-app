import { AfterViewInit, Component, ElementRef, input, OnChanges, SimpleChanges, viewChild } from '@angular/core';
import { Navigation, Pagination } from 'swiper/modules';
import Swiper from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ProductImagePipe } from '@/products/pipes/product-image.pipe';

@Component({
  selector: 'product-swiper',
  imports: [ProductImagePipe],
  templateUrl: './product-swiper.component.html',
})
export class ProductSwiperComponent implements AfterViewInit, OnChanges {
  images = input.required<string[]>();
  swiperDiv = viewChild.required<ElementRef>('swiperDiv');

  swiper: Swiper|undefined = undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['images'].firstChange) return;

    if(!this.swiper) return;
    this.swiper.destroy(true, true);
    const paginationEl = this.swiperDiv().nativeElement?.querySelector('.swiper-pagination');

    paginationEl.innerHTML = ``;

    setTimeout(() => {
      this.swiperInit()
    }, 100);

  }

  ngAfterViewInit(): void {
    this.swiperInit();
  }


  swiperInit() {
    const element:HTMLDivElement = this.swiperDiv().nativeElement;
    if(!element) return;

    this.swiper = new Swiper(element, {
      modules: [
        Navigation,
        Pagination
      ],

      direction: 'horizontal',
      loop: true,

      pagination: {
        el: '.swiper-pagination',
      },

      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });
  }
}
