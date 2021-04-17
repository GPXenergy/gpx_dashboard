import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';
import { ModelFormBuilder, ModelFormGroup } from '@gpx/forms/model-form';
import { FormValidatorService } from '@gpx/forms/validator.service';
import { GroupMeterService, GroupParticipationService } from '@gpx/services/api/group-meter.service';
import { User } from '@gpx/models/user.model';
import { AuthService } from '@gpx/services/auth.service';
import { GroupMeter, GroupParticipant } from '@gpx/models/group-meter.model';
import { MeterSelectionService } from '@gpx/services/meter-selection.service';
import { Meter } from '@gpx/models/meter.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { pkType } from '@gpx/models/base';


export interface JoinGroupMeterDialogData {
  invitationKey: string;
}

export interface JoinGroupMeterDialogResult {
  groupParticipant: GroupParticipant;
}

class JoinGroupParticipant extends GroupParticipant {
  meter: pkType;
  invitation_key: string;
}

@Component({
  selector: 'app-join-group-meter-dialog',
  templateUrl: './join-group-meter-dialog.component.html',
  styleUrls: ['./join-group-meter-dialog.component.scss']
})
export class JoinGroupMeterDialogComponent implements OnInit, OnDestroy {
  groupParticipantForm: ModelFormGroup<JoinGroupParticipant>;
  user: User;
  availableMeters: Meter[];
  groupMeter: GroupMeter;
  validInvitation = true;
  loading = true;
  private readonly _unsubscribeAll = new Subject<void>();

  constructor(public dialogRef: MatDialogRef<JoinGroupMeterDialogComponent>,
              private authService: AuthService,
              private modelFormBuilder: ModelFormBuilder,
              private meterSelectService: MeterSelectionService,
              private groupMeterService: GroupMeterService,
              private groupParticipationService: GroupParticipationService,
              private formValidator: FormValidatorService,
              @Inject(MAT_DIALOG_DATA) private data: JoinGroupMeterDialogData) {
  }

  ngOnInit(): void {
    this.authService.user.then(user => this.user = user);
    this.meterSelectService.availableMeters.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      availableMeters => this.availableMeters = availableMeters
    );
    this.meterSelectService.selectedMeter.pipe(takeUntil(this._unsubscribeAll)).subscribe(selectedMeter => {
      this.groupMeterService.getGroupMeterInvite(this.data.invitationKey).subscribe(
        group => {
          this.groupMeter = group;
          if (selectedMeter) {
            this.initForm(selectedMeter, group);
          }
        },
        error => this.validInvitation = false,
        () => this.loading = false
      );
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  /**
   * Validator function for meter selection, meter must not be in a group already
   * @param c: control
   */
  meterNotInGroup(c: AbstractControl): ValidationErrors {
    const meter = this.availableMeters.find(m => m.pk === c.value);
    return meter.in_group ? {meteringroup: true} : null;
  }

  initForm(initialMeter: Meter, group: GroupMeter): void {
    this.groupParticipantForm = this.modelFormBuilder.modelGroup(JoinGroupParticipant, null, {
      meter: [initialMeter?.pk, [Validators.required, (c: AbstractControl) => this.meterNotInGroup(c)]],
      display_name: [null],
      group: [group.pk],
      invitation_key: [group.invitation_key],
    });
    this.groupParticipantForm.markAllAsTouched();
    this.groupParticipantForm.runValidation();
  }

  onSubmit(): void {
    this.groupParticipantForm.markAsTouched();

    if (this.groupParticipantForm.valid) {
      const participant = this.groupParticipantForm.getModel();
      this.groupParticipationService.addGroupParticipant(this.user.pk, participant).subscribe(response => {
          this.dialogRef.close({
            groupParticipant: response
          });
        },
        e => {
          if (e.error && e.status === 400) {
            this.groupParticipantForm.applyRemoteErrors(e.error);
          }
        }
      );
    }
  }

  onNoClick(): void {
    this.dialogRef.close({
      groupParticipant: null
    });
  }

}
