import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MediaObserver } from '@angular/flex-layout';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';
import { GroupMeter, GroupParticipant } from '@gpx/models/group-meter.model';


export interface IGroupMeterParticipantDialogData {
  participant: GroupParticipant;
  group: GroupMeter;
}

@Component({
  selector: 'app-group-meter-participant-dialog',
  templateUrl: './group-meter-participant-dialog.component.html',
  styleUrls: ['./group-meter-participant-dialog.component.scss'],
})
export class GroupMeterParticipantDialogComponent implements OnInit, OnDestroy {
  participant: GroupParticipant;
  group: GroupMeter;

  private readonly onDestroy = new Subject<void>();
  @ViewChild('drawer', {static: true}) matDrawer: MatDrawer;

  constructor(public dialogRef: MatDialogRef<GroupMeterParticipantDialogComponent>,
              public media: MediaObserver,
              private route: ActivatedRoute,
              @Inject(MAT_DIALOG_DATA) private data: IGroupMeterParticipantDialogData) {
    this.participant = data.participant;
    this.group = data.group;
  }


  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

}
