import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LiboardComponent } from './liboard.component';

describe('LiboardComponent', () => {
  let component: LiboardComponent;
  let fixture: ComponentFixture<LiboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiboardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LiboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
