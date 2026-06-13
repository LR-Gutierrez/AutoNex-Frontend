import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  template: `
    <div
      class="user-avatar"
      [style.width.px]="size"
      [style.height.px]="size"
    >
      @if (photoUrl && !imgError) {
        <img
          [src]="photoUrl"
          [alt]="name"
          class="avatar-img"
          (error)="imgError = true"
        />
      } @else {
        <img src="assets/icon/user_4_fill.svg" alt="" class="avatar-fallback" />
      }
    </div>
  `,
  styles: `
    .user-avatar {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--avatar-radius, 50%);
      overflow: hidden;
      flex-shrink: 0;
      background: rgba(255, 255, 255, 0.1);
    }

    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar-fallback {
      width: 60%;
      height: 60%;
    }

    @media (prefers-color-scheme: dark) {
      .user-avatar {
        background: rgba(255, 255, 255, 0.1);
      }
      .avatar-fallback {
        filter: brightness(0) invert(1);
        opacity: 0.7;
      }
    }

    @media (prefers-color-scheme: light) {
      .user-avatar {
        background: rgba(0, 0, 0, 0.06);
      }
      .avatar-fallback {
        filter: brightness(0);
        opacity: 0.5;
      }
    }
  `,
})
export class UserAvatarComponent {
  @Input({ required: true }) name!: string;
  @Input() photoUrl?: string;
  @Input() size = 40;

  imgError = false;
}
