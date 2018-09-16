import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TuringComponent } from './turing.component';
import { MatButtonModule, MatInputModule, MatFormFieldModule, MatAutocompleteModule, MatCardModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { TuringRoutingModule } from './turing-routing.module';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('TuringComponent', () => {
  let component: TuringComponent;
  let fixture: ComponentFixture<TuringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        TuringRoutingModule,
        MatCardModule,
        FormsModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule
      ],
      declarations: [ TuringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TuringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
