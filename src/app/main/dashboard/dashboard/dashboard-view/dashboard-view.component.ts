import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MeterSelectionService } from '@gpx/services/meter-selection.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Meter } from '@gpx/models/meter.model';
import { IChartData } from './dashboard-graph/dashboard-graph.component';
import { Title } from '@angular/platform-browser';
import {
  GasMeasurementService,
  PowerMeasurementService,
  SolarMeasurementService,
} from '@gpx/services/api/measurement.service';
import { AuthService } from '@gpx/services/auth.service';
import { AuthUser } from '@gpx/models/auth-user.model';
import { MeterMeasurementFilter, MeterService } from '@gpx/services/api/meter.service';
import { FormControl, FormGroup } from '@angular/forms';


enum TimestampRange {
  day,
  week,
  month,
  year,
  current_day,
  current_week,
  current_month,
  current_year,
}


@Component({
  selector: 'dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss'],
})
export class DashboardViewComponent implements OnInit, OnDestroy {
  meter: Meter;
  user: AuthUser;
  energyChartInput: IChartData[];
  gasChartInput: IChartData[];
  loadingEnergy: boolean;
  loadingGas: boolean;

  /* For filtering */
  filterRangeOptions = TimestampRange;
  rangePickerForm: FormGroup;
  /* end filtering */

  private readonly _unsubscribeAll = new Subject<void>();

  constructor(private meterSelectionService: MeterSelectionService,
              private router: Router,
              private authService: AuthService,
              private meterService: MeterService,
              private powerMeasurementService: PowerMeasurementService,
              private gasMeasurementService: GasMeasurementService,
              private solarMeasurementService: SolarMeasurementService,
              private changeDetectorRef: ChangeDetectorRef,
              private titleService: Title) {
    titleService.setTitle('Persoonlijke meter | GPX');
  }


  ngOnInit(): void {
    this.loadingEnergy = true;
    this.loadingGas = true;
    this.meterSelectionService.availableMeters.pipe(takeUntil(this._unsubscribeAll)).subscribe(meters => {
      if (meters.length === 0) {
        // No meters for this user
        this.router.navigate(['configure', 'meter']);
      }
    });

    this.authService.user.then(user => {
      this.user = user;

      // Subscribe to meter changes for this user
      this.meterSelectionService.selectedMeter.pipe(takeUntil(this._unsubscribeAll)).subscribe(meter => {
        if (meter) {
          this.meter = meter;
          this.onRangeFilterChange(TimestampRange.day);
          this.changeDetectorRef.detectChanges();
        }
      });
    });

    this.rangePickerForm = new FormGroup({
      timestamp_after: new FormControl(),
      timestamp_before: new FormControl()
    });

    this.rangePickerForm.valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe(changes => {
    });
  }


  getMeterData(filter: MeterMeasurementFilter): void {
    this.meterService.getMeter(this.user.pk, this.meter.pk, filter).subscribe({
        next: (meter) => {
          this.meter = meter;
          this.setPowerSet();
          this.setGasSet();
        }
      }
    );
  }

  setPowerSet(): void {
    const energy = {name: 'import', series: []};
    const energy_ex = {name: 'export', series: []};
    const solar = {name: 'zon-productie', series: []};
    this.meter.power_measurement_set.forEach((obj, ind) => {
      energy.series.push({name: new Date(obj.timestamp), value: +obj.actual_import});
      if (this.meter.totalPowerExport > 0) {
        energy_ex.series.push({name: new Date(obj.timestamp), value: +obj.actual_export});
      }
    });

    this.meter.solar_measurement_set.forEach(obj => {
      solar.series.push({name: new Date(obj.timestamp), value: +obj.actual_solar});
    });
    this.energyChartInput = [energy];
    if (this.meter.totalPowerExport > 0) {
      this.energyChartInput.push(energy_ex);
    }
    if (solar.series.length) {
      this.energyChartInput.push(solar);
    }
    this.loadingEnergy = false;

  }

  setGasSet(): void {
    const gas = {name: 'Gas', series: []};
    this.meter.gas_measurement_set.forEach((obj, ind) => {
      gas.series.push({name: new Date(obj.timestamp), value: +obj.actual_gas});
    });

    this.gasChartInput = [gas];
    this.loadingGas = false;
  }


  /// On changing the range filter
  onRangeFilterChange(value: TimestampRange): void {
    const now = new Date();
    const lastUpdate = new Date(this.meter.last_update);
    const day = 24 * 60 * 60 * 1000; // calculated to day for Date object
    switch (value) {
      case TimestampRange.day:
        this.rangePickerForm.patchValue({
          timestamp_after: new Date(now.getTime() - day),
          timestamp_before: now,
        });
        break;
      case TimestampRange.week:
        this.rangePickerForm.patchValue({
          timestamp_after: new Date(now.getTime() - (day * 7)),
          timestamp_before: now,
        });
        break;
      case TimestampRange.month:
        this.rangePickerForm.patchValue({
          timestamp_after: new Date(now.getTime() - (day * 30)),
          timestamp_before: now,
        });
        break;
      case TimestampRange.year:
        this.rangePickerForm.patchValue({
          timestamp_after: new Date(now.getTime() - (day * 365)),
          timestamp_before: now,
        });
        break;
      case TimestampRange.current_day:
        this.rangePickerForm.patchValue({
          timestamp_after: new Date(now.getTime() - day),
          timestamp_before: now,
        });
        break;
      case TimestampRange.current_week:
        this.rangePickerForm.patchValue({
          timestamp_after: new Date(now.getTime() - (day * 7)),
          timestamp_before: now,
        });
        break;
      case TimestampRange.current_month:
        this.rangePickerForm.patchValue({
          timestamp_after: new Date(now.getTime() - (day * 30)),
          timestamp_before: now,
        });
        break;
      case TimestampRange.current_year:
        this.rangePickerForm.patchValue({
          timestamp_after: new Date(now.getTime() - (day * 365)),
          timestamp_before: now,
        });
        break;
    }
    this.applyNewRangeSelection();
  }

  closedRangePicker(): void {
    this.applyNewRangeSelection();
  }

  applyNewRangeSelection(): void {
    this.getMeterData(new MeterMeasurementFilter().assign({
      timestamp_after: this.rangePickerForm.value.timestamp_after.toISOString(),
      timestamp_before: this.rangePickerForm.value.timestamp_before.toISOString(),
    }));
  }


  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
