import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MediaObserver } from '@angular/flex-layout';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';
import { GroupMeter } from '@gpx/models/group-meter.model';


@Component({
  selector: 'app-group-meter-info-dialog',
  templateUrl: './group-meter-info-dialog.component.html',
  styleUrls: ['./group-meter-info-dialog.component.scss'],
})
export class GroupMeterInfoDialogComponent implements OnInit, OnDestroy {
  meter: GroupMeter;

  private readonly onDestroy = new Subject<void>();
  @ViewChild('drawer', {static: true}) matDrawer: MatDrawer;

  constructor(public dialogRef: MatDialogRef<GroupMeterInfoDialogComponent>,
              public media: MediaObserver,
              private route: ActivatedRoute,
              @Inject(MAT_DIALOG_DATA) private data: GroupMeter) {
    this.meter = data;
  }


  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

}
