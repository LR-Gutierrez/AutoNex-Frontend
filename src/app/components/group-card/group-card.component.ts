import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-group-card',
  templateUrl: './group-card.component.html',
  styleUrls: ['./group-card.component.scss'],
  standalone: false,
})
export class GroupCardComponent implements OnInit {
  @Input() image!: string;
  @Input() name!: string;
  @Input() members!: number;

  constructor() {}

  ngOnInit() {}
}
