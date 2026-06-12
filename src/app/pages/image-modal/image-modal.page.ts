import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-image-modal',
  templateUrl: './image-modal.page.html',
  styleUrls: ['./image-modal.page.scss'],
})
export class ImageModalPage implements OnInit {
  @Input() data!: any;

  background: any = null;

  constructor(private modalController: ModalController) {}

  ngOnInit(): void {
    this.background = {
      backgroundImage: `url(${this.data})`,
    };
  }

  dismissModal() {
    this.modalController.dismiss();
  }
}
