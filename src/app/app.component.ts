import { Component } from '@angular/core';

import { Router, ResolveEnd } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { ModalController } from '@ionic/angular';

import { filter, last } from 'rxjs/operators';
import { GamesService } from './services/games.service';

import { SettingsPage } from '@pages/settings/settings.page';

import appPages from '@resources/appPages.json';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public title = '';
  public pageBack = '';
  public widthMenu = '0';
  public appPages = appPages;
  public currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  public storage;
  constructor(
    private router: Router,
    private gamesService: GamesService,
    public modalController: ModalController,
  ) {
    this.gamesService.reloadData();
    this.createDatabase();
    setTimeout(() => {
      this.currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }, 15000);
    this.initializeApp();
  }

  async createDatabase() {
    this.storage = new Storage();
    await this.storage.create();
    this.storage.get('lastRoute').then(lastRoute => {
      if (lastRoute && lastRoute !== '/' && this.router.url === '/') {
        this.router.navigate(lastRoute.split('/').filter(e => e.length > 0), { skipLocationChange: true });
      }
    });
    this.router.events.pipe(filter(event => event instanceof ResolveEnd)).subscribe(event => {
      const root: ResolveEnd = event as ResolveEnd;
      const rootToSave = root.urlAfterRedirects === '/settings' || root.urlAfterRedirects === '/about' ? '/home' : root.urlAfterRedirects;
      this.storage.set('lastRoute', rootToSave);
      const routerName = root.url.split('/')[1];
      switch (routerName) {
        case 'analysis':
          if (rootToSave.split('/').length > 2) {
            this.pageBack = '/games';
          }
          break;
        case 'settings':
          this.pageBack = '/home';
          break;
        default:
          this.pageBack = '';
          break;
      }
      this.title = routerName;
    });

  }

  initializeApp() {
  }

  public updateFocus() {
    document.getElementById('appbar')?.focus();
  }

  public async openSettings() {
    const modal = await this.modalController.create({
      component: SettingsPage,
    });
    await modal.present();

  }

}
