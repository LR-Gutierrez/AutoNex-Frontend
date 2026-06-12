import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification-item',
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.scss'],
  standalone: false,
})
export class NotificationItemComponent implements OnInit {
  @Input() avatar!: string;
  @Input() username!: string;
  @Input() message!: string;
  @Input() time!: string;

  constructor() {}

  ngOnInit() {}
}
