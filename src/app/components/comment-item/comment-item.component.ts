import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-comment-item',
  templateUrl: './comment-item.component.html',
  styleUrls: ['./comment-item.component.scss'],
  standalone: false,
})
export class CommentItemComponent implements OnInit {
  @Input() comment!: any;
  @Input() light!: boolean;

  isActive = false;

  constructor() {}

  ngOnInit() {}
}
