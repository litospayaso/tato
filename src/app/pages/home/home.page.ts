import { Component, AfterViewInit } from '@angular/core';
import appPages from '@resources/appPages.json';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {

  public appPages = appPages;

  ngAfterViewInit() {
  }

  sendNotification() {

    Notification.requestPermission().then(perm => {
      if (perm === 'granted') {
        const notification = new Notification('Example notification on IOS', {
          body: 'if your phone supoprt IOS 16.4 you should be able to see this notification',
          icon: 'https://www.pngrepo.com/png/124191/180/apple.png'
        });
      }
    });
  }

}
