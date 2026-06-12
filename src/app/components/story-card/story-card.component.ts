import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-story-card',
  templateUrl: './story-card.component.html',
  styleUrls: ['./story-card.component.scss'],
  standalone: false,
})
export class StoryCardComponent implements OnInit {
  @Input() image!: string;
  @Input() avatar!: string;
  @Input() name!: string;
  @Input() date!: string;

  constructor() {}

  ngOnInit() {}
}
