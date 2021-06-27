import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { PercentagePipe } from '@pipes/percentage.pipe';

import { HomePage } from '@pages/home/home.page';
import { TrainingPage } from '@pages/training/training.page';
import { AnalysisPage } from '@pages/analysis/analysis.page';
import { GamesPage } from '@pages/games/games.page';

import { PromotionModalComponent } from '@components/promotion-modal/promotion-modal.component';
import { LiboardComponent } from '@components/liboard/liboard.component';
import { MovesTableComponent } from '@components/moves-table/moves-table.component';
import { TrainingModalComponent } from '@components/training-modal/training-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonicModule,
    IonicStorageModule.forRoot(),
  ],
  declarations: [
    PercentagePipe,
    HomePage,
    TrainingPage,
    AnalysisPage,
    GamesPage,
    PromotionModalComponent,
    LiboardComponent,
    TrainingModalComponent,
    MovesTableComponent
  ]
})
export class PagesModule {}
