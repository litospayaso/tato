import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, ResolveEnd } from '@angular/router';

import { filter } from 'rxjs/operators';

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
      title: 'Play Computer',
      url: '/training',
      icon: 'barbell-outline'
    },
  ];
  constructor(
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
  ) {
    this.router.events.pipe(filter(event => event instanceof ResolveEnd)).subscribe(event => {
      const root: ResolveEnd = event as ResolveEnd;
      const routerName = root.url.split('/')[1];
      switch (routerName) {
        case 'lesson':
          this.pageBack = '/home';
          break;
        default:
          this.pageBack = '';
          break;
      }
      this.setTitle(routerName);
      if (root.url.split('/').length > 2) {
        this.pageBack = routerName === 'evaluation' ? '/exercises' : '/home';
      } else {
        this.pageBack = '';
      }
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
        title = 'Play computer';
        break;
      default:
        break;
    }
    this.title = title;
  }
}
