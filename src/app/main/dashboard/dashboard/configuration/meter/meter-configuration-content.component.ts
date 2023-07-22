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
import { EMeterType, EMeterVisibility, EResidenceEnergyLabel, EResidenceType } from '@gpx/models/types';
import { Meter } from '@gpx/models/meter.model';
import { UserService } from '../../../../../../@gpx/services/api/user.service';


@Component({
  selector: 'gpx-meter-config-content',
  templateUrl: './meter-configuration-content.component.html',
  styleUrls: ['./meter-configuration-content.component.scss'],
})
export class MeterConfigurationContentComponent implements OnInit, OnDestroy {
  private readonly _unsubscribeAll = new Subject<void>();
  meterTypes = EMeterType;
  meterVisibilityTypes = EMeterVisibility;
  residenceTypes = EResidenceType;
  residenceEnergyLabels = EResidenceEnergyLabel;
  user: AuthUser;
  selectedMeter: Meter;
  allMeters: Meter[];
  meterForm: ModelFormGroup<Meter>;
  loading: boolean;
  isCopied: boolean;
  timeOut: NodeJS.Timeout;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private _snackBar: SnackBarService,
              private authService: AuthService,
              private meterService: MeterService,
              private formBuilder: ModelFormBuilder,
              private userService: UserService,
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

    this.meterSelectionService.availableMeters.pipe(takeUntil(this._unsubscribeAll)).subscribe(meters => {
      this.allMeters = meters;
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
      resident_count: [0, Validators.required],
      residence_type: [EResidenceType.UNDEFINED, Validators.required],
      residence_energy_label: [EResidenceEnergyLabel.UNDEFINED, Validators.required],
      solar_panel_count: [0, Validators.required],
    });

    this.meterForm.get('type').valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe(value => {
      // To reset solar panel count when not prosumer
      if (value !== EMeterType.PROSUMER && this.meterForm.get('solar_panel_count').value > 0) {
        this.meterForm.get('solar_panel_count').patchValue(0);
      }
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
    if (this.selectedMeter.getGroupParticipation()?.getGroup()?.getManager()?.pk === this.user.pk) {
      alert(`Kan ${this.selectedMeter.name} nog niet verwijderen, je bent beheerder van de groepsmeter. Draag de groep eerst over naar een andere gebruiker of verwijder de groep!`);
      return;
    }
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
    if (confirm(`Met een nieuwe API key verliezen je huidig aangesloten meters hun verbinding! Je zal hierna de nieuwe API key opnieuw moeten instellen op elke GPXconnector die je in gebruik hebt.\nWeet je zeker dat je een nieuwe API key wil aanvragen?`)) {
      this.userService.updateUser(this.user.pk, new AuthUser().deserialize({new_api_key: true})).subscribe(
        result => {
          this._snackBar.success({
            title: `Je hebt nu een nieuwe API key!`,
          });
          this.authService.patchUser(result);
          this.changeDetectorRef.detectChanges();
        }
      );
    }
  }

}
