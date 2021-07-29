import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EndingsPage } from './endings.page';

describe('EndingsPage', () => {
  let component: EndingsPage;
  let fixture: ComponentFixture<EndingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndingsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EndingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
