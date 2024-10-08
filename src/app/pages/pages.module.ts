import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';

import { TranslatePipe } from '@pipes/translate.pipe';

import { PercentagePipe } from '@pipes/percentage.pipe';

import { HomePage } from '@pages/home/home.page';
import { TrainingPage } from '@pages/training/training.page';
import { AnalysisPage } from '@pages/analysis/analysis.page';
import { GamesPage } from '@pages/games/games.page';
import { PuzzlesPage } from '@pages/puzzles/puzzles.page';
import { EndingsPage } from '@pages/endings/endings.page';
import { SettingsPage } from '@pages/settings/settings.page';

import { PromotionModalComponent } from '@components/promotion-modal/promotion-modal.component';
import { LiboardComponent } from '@components/liboard/liboard.component';
import { MovesTableComponent } from '@components/moves-table/moves-table.component';
import { TrainingModalComponent } from '@components/training-modal/training-modal.component';
import { ResultModalComponent } from '@components/result-modal/result-modal.component';
import { PuzzlesModalComponent } from '@components/puzzles-modal/puzzles-modal.component';
import { EndingsModalComponent } from '@components/endings-modal/endings-modal.component';

import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonicModule,
    SharedModule,
    IonicStorageModule.forRoot(),
  ],
  providers: [
    TranslatePipe
  ],
  declarations: [
    PercentagePipe,
    HomePage,
    TrainingPage,
    AnalysisPage,
    GamesPage,
    PuzzlesPage,
    EndingsPage,
    SettingsPage,
    PromotionModalComponent,
    LiboardComponent,
    TrainingModalComponent,
    ResultModalComponent,
    PuzzlesModalComponent,
    EndingsModalComponent,
    MovesTableComponent
  ]
})
export class PagesModule {}
