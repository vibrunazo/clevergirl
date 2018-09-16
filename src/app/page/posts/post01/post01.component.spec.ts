import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Post01Component } from './post01.component';

describe('Post01Component', () => {
  let component: Post01Component;
  let fixture: ComponentFixture<Post01Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Post01Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Post01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
