import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-promotion-modal',
  templateUrl: './promotion-modal.component.html',
  styleUrls: ['./promotion-modal.component.scss'],
})
export class PromotionModalComponent implements OnInit {

  @Input() color: string;

  constructor(
    private popover: PopoverController
  ) { }

  ngOnInit() {
  }

  closeModal(piece: string) {
    this.popover.dismiss(piece);
  }

}
