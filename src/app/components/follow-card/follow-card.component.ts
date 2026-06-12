import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-follow-card',
  templateUrl: './follow-card.component.html',
  styleUrls: ['./follow-card.component.scss'],
  standalone: false,
})
export class FollowCardComponent implements OnInit {
  @Input() image!: string;
  @Input() name!: string;
  @Input() location!: string;

  constructor() {}

  ngOnInit() {}
}
