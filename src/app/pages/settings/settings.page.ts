import { Component, AfterViewInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
})
export class SettingsPage implements AfterViewInit {

  public languages = [{key: 'en', value: 'English'}, {key: 'es', value: 'Español'}];
  public language = 'en';
  public storage: Storage;

  constructor(
    private store: Storage,
    public modalController: ModalController
  ) {
  }

  async ngAfterViewInit() {
    this.storage = new Storage();
    await this.storage.create();
  }

  updateLanguage(){
    this.storage.set('language', this.language);
  }

  public closeModal() {
    this.modalController.dismiss();
  }

}
