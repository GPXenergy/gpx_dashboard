import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupMeterParticipantDialogComponent } from './group-meter-participant-dialog.component';


describe('GroupMeterParticipantDialogComponent', () => {
  let component: GroupMeterParticipantDialogComponent;
  let fixture: ComponentFixture<GroupMeterParticipantDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupMeterParticipantDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupMeterParticipantDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
