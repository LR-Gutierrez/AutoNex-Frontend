import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
  standalone: false,
})
export class EventCardComponent implements OnInit {
  @Input() name!: string;
  @Input() image!: string;
  @Input() date!: string;
  @Input() from!: string;
  @Input() to!: string;
  @Input() location!: string;
  @Input() avatars!: string[];
  @Input() total!: number;

  constructor() {}

  ngOnInit() {}
}
