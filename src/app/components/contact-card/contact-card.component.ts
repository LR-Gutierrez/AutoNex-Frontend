import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact-card',
  templateUrl: './contact-card.component.html',
  styleUrls: ['./contact-card.component.scss'],
  standalone: false,
})
export class ContactCardComponent implements OnInit {
  @Input() image!: string;
  @Input() name!: string;
  @Input() isActive!: boolean;

  constructor() {}

  ngOnInit() {}
}
