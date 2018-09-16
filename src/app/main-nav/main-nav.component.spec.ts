
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainNavComponent } from './main-nav.component';
import { MatSidenavModule, MatToolbarModule, MatButtonModule, MatListModule, MatIconModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('MainNavComponent', () => {
  let component: MainNavComponent;
  let fixture: ComponentFixture<MainNavComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MainNavComponent ],
      imports: [
        MatSidenavModule,
        MatToolbarModule,
        MatButtonModule,
        MatListModule,
        MatIconModule,
        BrowserAnimationsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
