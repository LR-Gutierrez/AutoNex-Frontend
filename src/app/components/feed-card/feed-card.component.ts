import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-feed-card',
  templateUrl: './feed-card.component.html',
  styleUrls: ['./feed-card.component.scss'],
  standalone: false,
})
export class FeedCardComponent implements OnInit {
  @Input() avatar!: string;
  @Input() name!: string;
  @Input() date!: string;
  @Input() images!: string[];
  @Input() likes!: number;
  @Input() comments!: number;
  @Input() separator!: boolean;

  imgConfig = {
    spaceBetween: 6,
    slidesPerView: 1,
    centeredSlides: true,
  };

  constructor() {}

  ngOnInit() {}
}
