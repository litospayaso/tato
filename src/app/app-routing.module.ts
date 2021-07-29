import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomePage } from '@pages/home/home.page';
import { TrainingPage } from '@pages/training/training.page';
import { AnalysisPage } from '@pages/analysis/analysis.page';
import { GamesPage } from '@pages/games/games.page';
import { PuzzlesPage } from '@pages/puzzles/puzzles.page';
import { EndingsPage } from '@pages/endings/endings.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'home',
    component: HomePage,
  },
  {
    path: 'analysis',
    component: AnalysisPage,
  },
  {
    path: 'analysis/:id',
    component: AnalysisPage,
  },
  {
    path: 'training',
    component: TrainingPage,
  },
  {
    path: 'games',
    component: GamesPage,
  },
  {
    path: 'puzzles',
    component: PuzzlesPage,
  },
  {
    path: 'endings',
    component: EndingsPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
