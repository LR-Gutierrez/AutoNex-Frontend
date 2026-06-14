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
    <div
      [appReveal]="revealDelay"
      class="opacity-0 transition-opacity duration-[600ms] [&.revealed]:opacity-100"
      [class.text-center]="layout !== 'horizontal'"
      [class.flex]="layout === 'horizontal'"
      [class.items-center]="layout === 'horizontal'"
      [class.gap-3.5]="layout === 'horizontal'"
      [class.mb-12]="!!subtitle && layout !== 'horizontal'"
      [class.mb-8]="!subtitle && layout !== 'horizontal'"
      [class.max-[374px]:!mb-8]="!!subtitle && layout !== 'horizontal'"
    >
      @if (layout === 'horizontal') {
        <div class="w-[42px] h-[42px] rounded-[12px] grid place-items-center bg-gradient-to-br from-[rgba(255,59,48,0.22)] to-[rgba(255,59,48,0.06)] shadow-[inset_0_0_0_1px_rgba(255,59,48,0.12)] shrink-0 overflow-hidden">
          @if (logoSrc) {
            <img [src]="logoSrc" alt="AutoNex" class="w-full h-full object-contain rounded-[10px]" />
          } @else {
            <ion-icon [name]="placeholderIcon" class="text-[20px] text-[#d31d1d]"></ion-icon>
          }
        </div>
        <div>
          <h1 class="text-[20px] font-semibold tracking-[0.02em] leading-[1.1] m-0 text-(--app-text)">
            <span class="text-[#d31d1d]">Auto</span>Nex
            <span class="block text-[10px] font-light tracking-[0.14em] text-[#7c7c92] mt-1">GUI&amp;CAR, C.A.</span>
          </h1>
          @if (subtitle) {
            <p class="text-sm font-light italic text-(--app-text-muted) m-0 mt-2">{{ subtitle }}</p>
          }
        </div>
      } @else {
        <div class="mb-2">
          @if (logoSrc) {
            <img
              [src]="logoSrc"
              alt="AutoNex"
              class="object-contain mx-auto max-[374px]:!w-[100px] max-[374px]:!h-[100px]"
              [style.width.px]="logoSize"
              [style.height.px]="logoSize"
            />
          } @else {
            <div
              class="mx-auto bg-gradient-to-br from-[#d31d1d] to-[#a01515] rounded-[30px] shadow-[0_8px_24px_rgba(211,29,29,0.4)] flex items-center justify-center max-[374px]:!w-[100px] max-[374px]:!h-[100px]"
              [style.width.px]="logoSize"
              [style.height.px]="logoSize"
            >
              <ion-icon [name]="placeholderIcon" class="text-[40%] text-white"></ion-icon>
            </div>
          }
        </div>
        <div>
          <h1 class="text-[28px] font-semibold tracking-[2px] leading-[1.1] m-0 text-(--app-text) max-[374px]:text-[24px]">
            <span class="text-[#d31d1d]">Auto</span>Nex
            <span class="block text-[13px] font-light tracking-[1px] text-[#7c7c92] mt-0.5">GUI&amp;CAR, C.A.</span>
          </h1>
          @if (subtitle) {
            <p class="text-base font-light italic text-(--app-text-muted) m-0 mt-2">{{ subtitle }}</p>
          }
        </div>
      }
    </div>
  `,
  styles: [],
})
export class AuthBrandingComponent {
  @Input() layout: 'vertical' | 'horizontal' = 'vertical';
  @Input() logoSrc = 'assets/images/logo.png';
  @Input() logoSize = 120;
  @Input() placeholderIcon = 'airplane';
  @Input() subtitle?: string;
  @Input() revealDelay = 0;
}
