import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, ResolveEnd } from '@angular/router';
import { Storage } from '@ionic/storage';

import { filter, last } from 'rxjs/operators';
import { GamesService } from './services/games.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public title = '';
  public pageBack = '';
  public widthMenu = '0';
  public appPages = [
    {
      title: 'home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Analysis',
      url: '/analysis',
      icon: 'create'
    },
    {
      title: 'My games',
      url: '/games',
      icon: 'search-outline'
    },
    {
      title: 'Opening',
      url: '/training',
      icon: 'barbell-outline'
    },
    {
      title: 'Tactics',
      url: '/puzzles',
      icon: 'extension-puzzle-outline'
    },
    {
      title: 'Endings',
      url: '/endings',
      icon: 'rocket-outline'
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: 'settings-outline'
    },
  ];
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
      this.setTitle(routerName);
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

  setTitle(root: string) {
    let title = 'Tato';
    switch (root) {
      case 'home':
        title = 'Tato';
        break;
      case 'analysis':
        title = 'Analysis';
        break;
      case 'training':
        title = 'Opening';
        break;
      case 'games':
        title = 'My games';
        break;
      case 'puzzles':
        title = 'Tactics';
        break;
      case 'endings':
        title = 'Endings';
        break;
      case 'settings':
        title = 'Settings';
        break;
      default:
        break;
    }
    this.title = title;
  }
}
