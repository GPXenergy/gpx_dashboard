import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MediaObserver } from '@angular/flex-layout';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';

export interface IGroupMeterParticipantDialogData {
}


@Component({
  selector: 'app-group-meter-participant-dialog',
  templateUrl: './group-meter-participant-dialog.component.html',
  styleUrls: ['./group-meter-participant-dialog.component.scss'],
})
export class GroupMeterParticipantDialogComponent implements OnInit, OnDestroy {

  private readonly onDestroy = new Subject<void>();
  @ViewChild('drawer', {static: true}) matDrawer: MatDrawer;

  constructor(public dialogRef: MatDialogRef<GroupMeterParticipantDialogComponent>,
              public media: MediaObserver,
              private route: ActivatedRoute,
              @Inject(MAT_DIALOG_DATA) private data: IGroupMeterParticipantDialogData) {
  }


  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

}
