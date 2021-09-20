import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {

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
    // {
    //   title: 'Settings',
    //   url: '/settings',
    //   icon: 'settings-outline'
    // },
  ];

  ngAfterViewInit() {
  }

}
