import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-message-list-item',
  templateUrl: './message-list-item.component.html',
  styleUrls: ['./message-list-item.component.scss'],
  standalone: false,
})
export class MessageListItemComponent implements OnInit {
  @Input() avatar!: string;
  @Input() active!: boolean;
  @Input() user!: string;
  @Input() message!: string;
  @Input() time!: string;
  @Input() messageCount!: number;

  constructor() {}

  ngOnInit() {}
}
