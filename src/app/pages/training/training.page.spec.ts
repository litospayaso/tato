import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TrainingPage } from './training.page';

describe('HomePage', () => {
  let component: TrainingPage;
  let fixture: ComponentFixture<TrainingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TrainingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
