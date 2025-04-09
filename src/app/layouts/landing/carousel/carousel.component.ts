import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  CarouselCaptionComponent,
  CarouselControlComponent,
  CarouselIndicatorsComponent,
  CarouselInnerComponent,
  CarouselItemComponent,
  ThemeDirective,
  CarouselModule
} from '@coreui/angular';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
  standalone: true,
  imports: [ThemeDirective, CarouselModule, CarouselIndicatorsComponent, CarouselInnerComponent, NgFor, CarouselItemComponent, CarouselCaptionComponent, CarouselControlComponent, RouterLink]
})

export class CarouselComponent implements OnInit{
  
  slides: any[] = new Array(3).fill({ id: -1, src: '', title: '', subtitle: '' });

  ngOnInit(): void {
    this.slides[0] = {
      id: 0,
      src: './assets/images/carousel/carousel1.jpg',
      title: 'State Excise',
      subtitle: 'Ensuring Public Health through Regulation and Intelligence, Enforcement Measures'
    };
    this.slides[1] = {
      id: 1,
      src: './assets/images/carousel/carousel2.jpg',
      title: 'State Excise',
      subtitle: 'Ensuring Public Health through Regulation and Intelligence, Enforcement Measures'
    };
    this.slides[2] = {
      id: 2,
      src: './assets/images/carousel/carousel3.jpg',
      title: 'State Excise',
      subtitle: 'Ensuring Public Health through Regulation and Intelligence, Enforcement Measures'
    };
    this.slides[3] = {
      id: 3,
      src: './assets/images/carousel/carousel4.jpg',
      title: 'State Excise',
      subtitle: 'Ensuring Public Health through Regulation and Intelligence, Enforcement Measures'
    };
    this.slides[4] = {
      id: 4,
      src: './assets/images/carousel/carousel5.jpg',
      title: 'State Excise',
      subtitle: 'Ensuring Public Health through Regulation and Intelligence, Enforcement Measures'
    };
    this.slides[5] = {
      id: 5,
      src: './assets/images/carousel/carousel6.jpg',
      title: 'State Excise',
      subtitle: 'Ensuring Public Health through Regulation and Intelligence, Enforcement Measures'
    };
    this.slides[6] = {
      id: 6,
      src: './assets/images/carousel/carousel7.jpg',
      title: 'State Excise',
      subtitle: 'Ensuring Public Health through Regulation and Intelligence, Enforcement Measures'
    };
  }
}
