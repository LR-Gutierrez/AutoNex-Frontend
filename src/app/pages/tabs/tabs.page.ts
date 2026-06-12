import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  isClicked = false;

  onClick($event: any) {
    this.isClicked = !this.isClicked;
  }
}
