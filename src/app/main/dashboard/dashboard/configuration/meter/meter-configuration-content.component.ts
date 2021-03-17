import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { AuthService } from '@gpx/services/auth.service';
import { ModelFormBuilder, ModelFormGroup } from '@gpx/forms/model-form';
import { FormValidatorService } from '@gpx/forms/validator.service';
import { MeterSelectionService } from '@gpx/services/meter-selection.service';
import { takeUntil } from 'rxjs/operators';
import { Validators } from '@angular/forms';
import { SnackBarService } from '@gpx/services/snack-bar.service';
import { AuthUser } from '@gpx/models/auth-user.model';
import { MeterService } from '@gpx/services/api/meter.service';
import { Meter } from '@gpx/models/meter.model';


@Component({
  selector: 'meter-config-content',
  templateUrl: './meter-configuration-content.component.html',
  styleUrls: ['./meter-configuration-content.component.scss'],
})
export class MeterConfigurationContentComponent implements OnInit, OnDestroy {
  user: AuthUser;
  selectedMeter: Meter;
  meterForm: ModelFormGroup<Meter>;
  loading: boolean;
  isCopied: boolean;
  timeOut: NodeJS.Timeout;
  private readonly _unsubscribeAll = new Subject<void>();

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private _snackBar: SnackBarService,
              private authService: AuthService,
              private meterService: MeterService,
              private formBuilder: ModelFormBuilder,
              private formValidator: FormValidatorService,
              private meterSelectionService: MeterSelectionService,
              private titleService: Title) {
    this.titleService.setTitle('Meter Instellingen | GPX');
  }

  ngOnInit(): void {
    this.loading = true;

    this.authService.userUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe(user => {
      this.user = user;
    });

    this.meterSelectionService.selectedMeter.pipe(takeUntil(this._unsubscribeAll)).subscribe(meter => {
      this.selectedMeter = meter;
      this.initForm(meter);
      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    clearTimeout(this.timeOut);
  }

  initForm(meter: Meter): void {
    this.meterForm = this.formBuilder.modelGroup(Meter, meter, {
      name: ['', Validators.required],
      visibility_type: [null, Validators.required],
      type: [null, Validators.required],
    });
  }

  cancelChanges(): void {
    // to reset and mark as untouched and not dirty
    this.initForm(this.selectedMeter);
  }

  onSubmitForm(): void {
    // to reset and mark as untouched and not dirty
    if (this.meterForm.valid) {
      const updatedMeter = this.meterForm.getModel();
      this.meterService.updateMeter(this.user.pk, this.selectedMeter.pk, updatedMeter).subscribe(
        meter => {
          this.selectedMeter.deserialize(meter);
          this.initForm(this.selectedMeter);
          this._snackBar.success({
            title: `Meter "${this.selectedMeter.name}" is succesvol aangepast!`,
          });
        },
        e => {
          if (e.error && e.status === 400) {
            this.meterForm.applyRemoteErrors(e.error);
          }
        }
      );

    }
  }

  copyLink(): void {
    this.isCopied = true;
    clearTimeout(this.timeOut);
    this.timeOut = setTimeout(() => {
      this.isCopied = false;
    }, 1500);
  }

  deleteMeter(event): void {
    if (confirm(`Weet je zeker dat je ${this.selectedMeter.name} wil verwijderen? Alle meter-gerelateerde data wordt verwijderd!`)) {
      this.meterService.removeMeter(this.user.pk, this.selectedMeter.pk).subscribe(
        result => {
          this._snackBar.success({
            title: `Je hebt ${this.selectedMeter.name} verwijderd!`,
          });
          this.meterSelectionService.updateMeters(this.user);
        }
      );
    }
  }

  newApiKey(event): void {
    // TODO
  }

}
