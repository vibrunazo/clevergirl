import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DinoSimComponent } from "./dinosim.component";
import {
  MatCardModule,
  MatSelectModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatAutocompleteModule,
  MatDividerModule,
  MatCheckboxModule
} from "@angular/material";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { DINOS } from "../dino-table/dinostats";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

const mockRoute = {
  navigate: jasmine.createSpy('navigate')
  };

describe("DinosimComponent", () => {
  let component: DinoSimComponent;
  let fixture: ComponentFixture<DinoSimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DinoSimComponent],
      imports: [
        MatCardModule,
        MatSelectModule,
        MatButtonModule,
        CommonModule,
        RouterTestingModule.withRoutes([
          {path: '', component: DinoSimComponent}
      ]),
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        MatSelectModule,
        MatDividerModule,
        MatCheckboxModule,
        BrowserAnimationsModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DinoSimComponent);
    component = fixture.componentInstance;
    component.dinos = DINOS;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
