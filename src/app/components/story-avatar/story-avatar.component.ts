import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-story-avatar',
  templateUrl: './story-avatar.component.html',
  styleUrls: ['./story-avatar.component.scss'],
  standalone: false,
})
export class StoryAvatarComponent implements OnInit {
  @Input() avatar!: string;
  @Input() name!: string;
  @Input() live!: boolean;
  @Input() active!: boolean;

  constructor() {}

  ngOnInit() {}

  setActive() {}
}
