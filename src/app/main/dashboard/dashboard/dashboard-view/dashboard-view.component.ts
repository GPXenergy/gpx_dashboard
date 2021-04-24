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
import { MobileService } from '@gpx/services/mobile.service';


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

  isMobile: boolean;

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
              private mobileService: MobileService,
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
          this.onRangeFilterChange(TimestampRange.current_day);
          this.changeDetectorRef.detectChanges();
        }
      });
    });

    this.rangePickerForm = new FormGroup({
      timestamp_after: new FormControl(),
      timestamp_before: new FormControl()
    });

    this.mobileService.isMobile.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      isMobile => this.isMobile = isMobile
    );
  }


  getMeterData(filter: MeterMeasurementFilter): void {
    this.loadingEnergy = true;
    this.loadingGas = true;
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
    const energy = {name: 'Import', series: []};
    const energy_ex = {name: 'Export', series: []};
    const solar = {name: 'Zon-productie', series: []};
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
    const gas = {name: 'Gasconsumptie', series: []};
    this.meter.gas_measurement_set.forEach((obj, ind) => {
      gas.series.push({name: new Date(obj.timestamp), value: +obj.actual_gas});
    });

    this.gasChartInput = [gas];
    this.loadingGas = false;
  }


  /// On changing the range filter
  onRangeFilterChange(value: TimestampRange): void {
    const after = new Date();
    const before = new Date();
    switch (value) {
      case TimestampRange.day:
        after.setDate(after.getDate() - 1);
        break;
      case TimestampRange.week:
        after.setDate(after.getDate() - 7);
        break;
      case TimestampRange.month:
        after.setDate(after.getDate() - 31);
        break;
      case TimestampRange.year:
        after.setDate(after.getDate() - 365);
        break;
      case TimestampRange.current_day:
        after.setHours(0, 0, 0, 0);
        before.setHours(23, 59, 59, 999);
        break;
      case TimestampRange.current_week:
        after.setDate(after.getDate() + (-after.getDay() || -7) + 1);
        after.setHours(0, 0, 0, 0);
        before.setDate(before.getDate() + (-before.getDay() || -7) + 7);
        before.setHours(23, 59, 59, 999);
        break;
      case TimestampRange.current_month:
        after.setFullYear(after.getFullYear(), after.getMonth(), 1);
        after.setHours(0, 0, 0, 0);
        before.setFullYear(before.getFullYear(), before.getMonth() + 1, 0);
        before.setHours(23, 59, 59, 999);
        break;
      case TimestampRange.current_year:
        after.setFullYear(after.getFullYear(), 0, 1);
        after.setHours(0, 0, 0, 0);
        before.setFullYear(before.getFullYear() + 1, 0, 0);
        before.setHours(23, 59, 59, 999);
        break;
    }
    this.rangePickerForm.patchValue({
      timestamp_after: after,
      timestamp_before: before,
    });
    this.applyNewRangeSelection();
  }

  closedRangePicker(): void {
    const end: Date = this.rangePickerForm.value.timestamp_before;
    if (end.getHours() === 0) {
      const _23h59m = (23 * 60 * 60 * 1000) + (59 * 60 * 1000);
      this.rangePickerForm.patchValue({
        timestamp_before: new Date(end.getTime() + _23h59m)
      });
      this.applyNewRangeSelection();
    }
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
