import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Validators } from '@angular/forms';
import { ModelFormBuilder, ModelFormGroup } from '@gpx/forms/model-form';
import { FormErrors } from '@gpx/forms/form-error.model';
import { FormValidatorService } from '@gpx/forms/validator.service';
import { GroupMeterService } from '@gpx/services/api/group-meter.service';
import { User } from '@gpx/models/user.model';
import { AuthService } from '@gpx/services/auth.service';
import { MeterSelectionService } from '@gpx/services/meter-selection.service';
import { Meter } from '@gpx/models/meter.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GroupMeter, GroupParticipant } from '@gpx/models/group-meter.model';


export interface ChangeGroupManagerDialogData {
  group: GroupMeter;
}

export interface ChangeGroupManagerDialogResult {
  manager: GroupParticipant;
}

@Component({
  selector: 'change-group-manager-dialog',
  templateUrl: './change-group-manager-dialog.component.html',
  styleUrls: ['./change-group-manager-dialog.component.scss']
})
export class ChangeGroupManagerDialogComponent implements OnInit, OnDestroy {
  groupMeterForm: ModelFormGroup<GroupMeter>;
  user: User;
  groupMeter: GroupMeter;

  private readonly _unsubscribeAll = new Subject<void>();

  constructor(public dialogRef: MatDialogRef<ChangeGroupManagerDialogComponent>,
              private authService: AuthService,
              private modelFormBuilder: ModelFormBuilder,
              private meterSelectService: MeterSelectionService,
              private manageGroupMeterService: GroupMeterService,
              @Inject(MAT_DIALOG_DATA) private data: ChangeGroupManagerDialogData) {
    this.groupMeter = data.group;
  }

  ngOnInit(): void {
    this.authService.user.then(user => this.user = user);
    this.initForm();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  initForm(): void {
    this.groupMeterForm = this.modelFormBuilder.modelGroup(GroupMeter, null, {
      manager: [null],
    });
  }

  onSubmit(): void {
    this.groupMeterForm.markAsTouched();

    if (this.groupMeterForm.valid) {
      this.manageGroupMeterService.updateGroupMeter(this.user?.pk, this.data.group.pk, this.groupMeterForm.getModel()).subscribe(response => {
        this.dialogRef.close({
          groupMeter: response
        });
      }, e => {
        if (e.error && e.status === 400) {
          this.groupMeterForm.applyRemoteErrors(e.error);
        }
      });
    }


  }

  onNoClick(): void {
    this.dialogRef.close({
      groupMeter: null
    });
  }

}
