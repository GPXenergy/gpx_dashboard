import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MediaObserver } from '@angular/flex-layout';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';
import { GroupMeter, GroupParticipant } from '@gpx/models/group-meter.model';
import { EResidenceEnergyLabel, EResidenceType } from '../../../../models/types';


export interface IGroupMeterParticipantDialogData {
  participant: GroupParticipant;
  group: GroupMeter;
}

interface IParticipantTableData{
  label: string;
  total: number;
  average?: number;
  unit: string;
  inverted?: boolean;
}

@Component({
  selector: 'gpx-group-meter-participant-dialog',
  templateUrl: './group-meter-participant-dialog.component.html',
  styleUrls: ['./group-meter-participant-dialog.component.scss'],
})
export class GroupMeterParticipantDialogComponent implements OnInit, OnDestroy {
  participant: GroupParticipant;
  group: GroupMeter;

  residenceTypes = EResidenceType;
  energyLabels = EResidenceEnergyLabel;

  participantData: IParticipantTableData[] = [];

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
    if (this.participant.total_import) {
      this.participantData.push({
        label: 'Stroom (import)',
        total: this.participant.total_import,
        average: this.participant.averageImportPerDay,
        unit: 'kWh',
        inverted: true,
      });
    }
    if (this.participant.total_export) {
      this.participantData.push({
        label: 'Stroom (export)',
        total: this.participant.total_export,
        average: this.participant.averageExportPerDay,
        unit: 'kWh',
        inverted: false,
      });
    }
    if (this.participant.total_export && this.participant.total_export) {
      this.participantData.push({
        label: 'Stroom (balans)',
        total: this.participant.totalPower,
        unit: 'kWh',
        inverted: false,
      });
    }
    if (this.participant.total_import) {
      this.participantData.push({
        label: 'Gas',
        total: this.participant.total_gas,
        average: this.participant.averageGasPerDay,
        unit: 'm³',
        inverted: null,
      });
    }
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

}
