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
import { pkType } from '@gpx/models/base';
import { GroupMeter } from '@gpx/models/group-meter.model';


/**
 * Model used when creating a new group meter
 */
export class NewGroupMeter extends GroupMeter {
  meter: pkType;
}

export interface CreateGroupMeterDialogResult {
  groupMeter: NewGroupMeter;
}

@Component({
  selector: 'create-group-meter-dialog',
  templateUrl: './create-group-meter-dialog.component.html',
  styleUrls: ['./create-group-meter-dialog.component.scss']
})
export class CreateGroupMeterDialogComponent implements OnInit, OnDestroy {
  groupMeterForm: ModelFormGroup<NewGroupMeter>;
  formErrors: FormErrors;
  user: User;
  availableMeters: Meter[];
  private readonly _unsubscribeAll = new Subject<void>();

  constructor(public dialogRef: MatDialogRef<CreateGroupMeterDialogComponent>,
              private authService: AuthService,
              private modelFormBuilder: ModelFormBuilder,
              private meterSelectService: MeterSelectionService,
              private manageGroupMeterService: GroupMeterService,
              private formValidator: FormValidatorService,
              @Inject(MAT_DIALOG_DATA) private data: any) {
  }

  ngOnInit() {
    this.authService.user.then(user => this.user = user);
    this.meterSelectService.availableMeters.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      availableMeters => this.availableMeters = availableMeters
    );
    this.meterSelectService.selectedMeter.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      selectedMeter => this.initForm(selectedMeter)
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  initForm(meter: Meter) {
    this.groupMeterForm = this.modelFormBuilder.modelGroup(NewGroupMeter, null, {
      name: [null, Validators.required],
      public: [false],
      meter: [meter.pk, Validators.required],
    });
    this.formErrors = new FormErrors(this.groupMeterForm);
    this.groupMeterForm.valueChanges.subscribe(() => {
      this.formValidator.validateForm(this.groupMeterForm, this.formErrors);
    });
  }

  onSubmit() {
    this.groupMeterForm.markAsTouched();

    if (this.groupMeterForm.valid) {
      this.manageGroupMeterService.addGroupMeter(this.user?.pk, this.groupMeterForm.getModel()).subscribe(response => {
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
