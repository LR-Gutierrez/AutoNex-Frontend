import { Component, Input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-auth-branding',
  standalone: true,
  imports: [IonIcon, RevealDirective],
  host: {
    '[class.layout-horizontal]': 'layout === "horizontal"',
  },
  template: `
    <div class="branding" [appReveal]="revealDelay" [class.with-subtitle]="!!subtitle">
      <div class="logo-cell">
        @if (logoSrc) {
          <img
            [src]="logoSrc"
            alt="AutoNex"
            class="logo-img"
            [class.logo-fill]="layout === 'horizontal'"
            [style.width.px]="layout === 'vertical' ? logoSize : undefined"
            [style.height.px]="layout === 'vertical' ? logoSize : undefined"
          />
        } @else {
          <div
            class="logo-fallback"
            [style.width.px]="layout === 'vertical' ? logoSize : undefined"
            [style.height.px]="layout === 'vertical' ? logoSize : undefined"
          >
            <ion-icon [name]="placeholderIcon"></ion-icon>
          </div>
        }
      </div>

      <div class="text-cell">
        <h1 class="brand-title">
          <span class="brand-accent">Auto</span>Nex
          <span class="brand-subtitle-line">GUI&amp;CAR, C.A.</span>
        </h1>
        @if (subtitle) {
          <p class="brand-subtitle">{{ subtitle }}</p>
        }
      </div>
    </div>
  `,
  styles: [
    `
    :host {
      --brand-title-color: white;
      --brand-accent-color: #d31d1d;
      --brand-subtitle-color: rgba(255, 255, 255, 0.6);
      --brand-subtitle2-color: #7c7c92;
      --brand-gap: 0;
    }

    .branding {
      opacity: 0;
      transition: opacity 0.6s ease-out;

      &.revealed {
        opacity: 1;
      }
    }

    /* ── VERTICAL (default: auth pages) ── */
    :host:not(.layout-horizontal) .branding {
      text-align: center;

      &.with-subtitle {
        margin-bottom: 48px;
      }

      &:not(.with-subtitle) {
        margin-bottom: 32px;
      }
    }

    :host:not(.layout-horizontal) .logo-cell {
      margin-bottom: 8px;
    }

    :host:not(.layout-horizontal) .logo-fallback {
      margin: 0 auto;
      background: var(--brand-logo-bg, linear-gradient(135deg, #d31d1d 0%, #a01515 100%));
      border-radius: 30px;
      box-shadow: var(--brand-logo-shadow, 0 8px 24px rgba(211, 29, 29, 0.4));
    }

    /* ── HORIZONTAL (sidebar / footer) ── */
    :host.layout-horizontal .branding {
      display: flex;
      align-items: center;
      gap: var(--brand-gap, 14px);
    }

    :host.layout-horizontal .logo-cell {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      display: grid;
      place-items: center;
      background: linear-gradient(135deg, rgba(255, 59, 48, 0.22), rgba(255, 59, 48, 0.06));
      box-shadow: inset 0 0 0 1px rgba(255, 59, 48, 0.12);
      flex-shrink: 0;
      overflow: hidden;
    }

    :host.layout-horizontal .logo-img.logo-fill {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 10px;
    }

    :host.layout-horizontal .logo-fallback {
      border-radius: 0;
      box-shadow: none;
      background: transparent;

      ion-icon {
        font-size: 20px;
        color: var(--brand-accent-color);
      }
    }

    :host.layout-horizontal .brand-title {
      font-size: 20px;
      letter-spacing: 0.02em;
    }

    :host.layout-horizontal .brand-subtitle-line {
      font-size: 10px;
      letter-spacing: 0.14em;
      margin-top: 4px;
    }

    /* ── SHARED: LOGO ── */
    .logo-img {
      object-fit: contain;
    }

    .logo-fallback {
      display: flex;
      align-items: center;
      justify-content: center;

      ion-icon {
        font-size: 40%;
        color: white;
      }
    }

    /* ── SHARED: TEXT ── */
    .brand-title {
      font-size: 28px;
      font-weight: 600;
      color: var(--brand-title-color);
      margin: 0;
      letter-spacing: 2px;
      line-height: 1.1;
    }

    .brand-accent {
      color: var(--brand-accent-color);
    }

    .brand-subtitle-line {
      display: block;
      font-size: 13px;
      font-weight: 300;
      color: var(--brand-subtitle2-color);
      letter-spacing: 1px;
      margin-top: 2px;
    }

    .brand-subtitle {
      font-size: 16px;
      color: var(--brand-subtitle-color);
      margin: 8px 0 0;
      font-weight: 300;
      font-style: italic;
    }

    /* ── LIGHT MODE ── */
    @media (prefers-color-scheme: light) {
      :host:not(.layout-horizontal) {
        --brand-title-color: #1a1a2e;
        --brand-subtitle-color: rgba(0, 0, 0, 0.6);
      }
    }

    /* ── SMALL SCREEN ── */
    @media (max-width: 374px) {
      :host:not(.layout-horizontal) .branding.with-subtitle {
        margin-bottom: 32px;
      }

      :host:not(.layout-horizontal) .logo-img,
      :host:not(.layout-horizontal) .logo-fallback {
        width: 100px !important;
        height: 100px !important;
      }

      :host:not(.layout-horizontal) .brand-title {
        font-size: 24px;
      }
    }
    `,
  ],
})
export class AuthBrandingComponent {
  @Input() layout: 'vertical' | 'horizontal' = 'vertical';
  @Input() logoSrc = 'assets/images/logo.png';
  @Input() logoSize = 120;
  @Input() placeholderIcon = 'airplane';
  @Input() subtitle?: string;
  @Input() revealDelay = 0;
}
