import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OanaxSnackBarComponent } from './oanax-snack-bar.component';


describe('OanaxSnackBarComponent', () => {
  let component: OanaxSnackBarComponent;
  let fixture: ComponentFixture<OanaxSnackBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OanaxSnackBarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OanaxSnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
