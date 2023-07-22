import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GpxSnackBarComponent } from './gpx-snack-bar.component';


describe('GPXSnackBarComponent', () => {
  let component: GpxSnackBarComponent;
  let fixture: ComponentFixture<GpxSnackBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GpxSnackBarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpxSnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
