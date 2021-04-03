import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatDialog } from '@angular/material/dialog';
import { GroupMeter, GroupParticipant, ParticipantConnection } from '@gpx/models/group-meter.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GroupMeterParticipantDialogComponent } from '../group-meter-participant-dialog/group-meter-participant-dialog.component';

@Component({
  selector: 'app-group-meter-card',
  templateUrl: './group-meter-card.component.html',
  styleUrls: ['./group-meter-card.component.scss']
})
export class GroupMeterCardComponent implements OnInit, OnDestroy {

  private readonly _unsubscribeAll = new Subject<void>();

  @Input() connection: 'top' | 'bottom';
  @Input() participant: GroupParticipant;
  @Input() groupMeter: GroupMeter;

  constructor(private media: MediaObserver,
              private dialog: MatDialog) {
  }


  ngOnInit(): void {
  }

  groupParticipantDetail(): void {

    const dialogRef = this.dialog.open(GroupMeterParticipantDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      maxHeight: this.media.isActive('xs') ? '90vh' : '600px',
      autoFocus: false,
      panelClass: 'dialog-no-padding',
      data: {
        participant: this.participant,
        group: this.groupMeter
      },
      closeOnNavigation: false
    });
    dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {

    });
  }

  statusIcon(): string {
    switch (this.participant.lastActivity) {
      case ParticipantConnection.ACTIVE:
        return 'signal_cellular_4_bar';
      case ParticipantConnection.INACTIVE:
        return 'signal_cellular_connected_no_internet_4_bar';
      case ParticipantConnection.OFFLINE:
        return 'signal_cellular_off';
    }
  }

  statusText(): string {
    switch (this.participant.lastActivity) {
      case ParticipantConnection.ACTIVE:
        return 'Live';
      case ParticipantConnection.INACTIVE:
        return 'Inactief';
      case ParticipantConnection.OFFLINE:
        return 'Offline';
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
