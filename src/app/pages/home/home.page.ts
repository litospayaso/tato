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

}
