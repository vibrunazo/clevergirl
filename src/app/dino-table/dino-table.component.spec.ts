import { fakeAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { DinoTableComponent } from "./dino-table.component";
import {
  MatCardModule,
  MatPaginator,
  MatSort,
  MatTableModule,
  MatSelectModule,
  MatButtonModule,
  MatTooltipModule
} from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe("DinoTableComponent", () => {
  let component: DinoTableComponent;
  let fixture: ComponentFixture<DinoTableComponent>;

  beforeEach(
    fakeAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DinoTableComponent, MatPaginator, MatSort],
        imports: [
          MatCardModule,
          MatTableModule,
          MatSelectModule,
          MatButtonModule,
          MatTooltipModule,
          BrowserAnimationsModule
        ],
        providers: []
      }).compileComponents();

      fixture = TestBed.createComponent(DinoTableComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it("should compile", () => {
    expect(component).toBeTruthy();
  });
});
