import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DinolevelComponent } from './dinolevel.component';

describe('DinolevelComponent', () => {
  let component: DinolevelComponent;
  let fixture: ComponentFixture<DinolevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DinolevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DinolevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
