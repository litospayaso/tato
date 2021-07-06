import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PuzzlesPage } from './puzzles.page';

describe('PuzzlesPage', () => {
  let component: PuzzlesPage;
  let fixture: ComponentFixture<PuzzlesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PuzzlesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PuzzlesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
