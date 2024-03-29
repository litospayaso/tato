import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, ResolveEnd } from '@angular/router';
import { Storage } from '@ionic/storage';

import { filter, last } from 'rxjs/operators';
import { GamesService } from './services/games.service';

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
  constructor(
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private gamesService: GamesService,
    private statusBar: StatusBar,
    private storage: Storage
  ) {
    this.gamesService.reloadData();
    storage.get('lastRoute').then(lastRoute => {
      if (lastRoute && lastRoute !== '/' && router.url === '/') {
        this.router.navigate(lastRoute.split('/').filter(e => e.length > 0), {skipLocationChange: true });
      }
    });
    this.router.events.pipe(filter(event => event instanceof ResolveEnd)).subscribe(event => {
      const root: ResolveEnd = event as ResolveEnd;
      const rootToSave = root.urlAfterRedirects === '/settings' || root.urlAfterRedirects === '/about' ? '/home' : root.urlAfterRedirects;
      storage.set('lastRoute', rootToSave);
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
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  public toogleMenu() {
    this.widthMenu = this.widthMenu === '0' ? '100vw' : '0';
  }

}
