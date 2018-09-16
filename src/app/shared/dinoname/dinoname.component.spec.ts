import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DinonameComponent } from './dinoname.component';

describe('DinonameComponent', () => {
  let component: DinonameComponent;
  let fixture: ComponentFixture<DinonameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DinonameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DinonameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
