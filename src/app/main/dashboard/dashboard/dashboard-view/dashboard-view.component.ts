import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MeterSelectionService } from '@gpx/services/meter-selection.service';
import { takeUntil } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { GasMeasurement, Meter, PowerMeasurement, SolarMeasurement } from '@gpx/models/meter.model';
import { IChartData } from './dashboard-graph/dashboard-graph.component';
import { Title } from '@angular/platform-browser';
import {
  GasMeasurementService,
  MeasurementFilter,
  PowerMeasurementService,
  SolarMeasurementService,
} from '@gpx/services/api/measurement.service';
import { AuthService } from '@gpx/services/auth.service';
import { AuthUser } from '@gpx/models/auth-user.model';
import { MeterService } from '@gpx/services/api/meter.service';
import { FormControl, FormGroup } from '@angular/forms';
import { formatISO, format } from 'date-fns';


enum TimestampRange {
  day,
  week,
  month,
  year
}


@Component({
  selector: 'dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss'],
})
export class DashboardViewComponent implements OnInit, OnDestroy {
  meter: Meter;
  user: AuthUser;
  powerMeasurement: PowerMeasurement[] = [];
  solarMeasurement: SolarMeasurement[] = [];
  energyChartInput: IChartData[];
  loadingEnergy: boolean;
  gasMeasurement: GasMeasurement[] = [];
  gasChartInput: IChartData[];
  loadingGas: boolean;

  /* For filtering */
  invertPowerImport: boolean;
  filterRangeOptions = TimestampRange;
  rangeSelectPower: TimestampRange = TimestampRange.day;
  energyMeasurementFilter: MeasurementFilter;
  gasMeasurementFilter: MeasurementFilter;
  rangeSelectGas: TimestampRange = TimestampRange.day;

  rangePickerForm: FormGroup;
  /* end filtering */

  interval: NodeJS.Timeout;

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
    this.invertPowerImport = false;
    this.energyMeasurementFilter = new MeasurementFilter();
    this.gasMeasurementFilter = new MeasurementFilter();
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
          this.getLatestMeterData();
          this.changeDetectorRef.detectChanges();
        }
      });
    });

  }





  getMeterData(): void {
    this.meterService.getMeter(this.user.pk, this.meter.pk).subscribe(
      meter => this.meter = meter,
      error => clearInterval(this.interval)
    );
  }

  getMeterPowerData(): void {
    forkJoin([
      this.powerMeasurementService.getMeasurementList(this.user.pk, this.meter.pk, this.energyMeasurementFilter),
      this.solarMeasurementService.getMeasurementList(this.user.pk, this.meter.pk, this.energyMeasurementFilter)
    ]).subscribe(data => {
      this.powerMeasurement = data[0];
      this.solarMeasurement = data[1];
      this.setPowerSet();
    }, e => {
      console.log('error:', e);
    }, () => {
      this.loadingEnergy = false;

    });
  }

  setPowerSet(): void {
    const energy = { name: 'levering', series: [] };
    const energy_ex = { name: 'teruglevering', series: [] };
    const solar = { name: 'zon-productie', series: [] };
    this.powerMeasurement.forEach((obj, ind) => {
      energy.series.push({ name: new Date(obj.timestamp), value: this.invertPowerImport ? -obj.power_imp : +obj.power_imp });
      if (this.meter.totalPowerExport > 0) {
        energy_ex.series.push({ name: new Date(obj.timestamp), value: +obj.power_exp });
      }
    });

    this.solarMeasurement.forEach(obj => {
      solar.series.push({ name: new Date(obj.timestamp), value: +obj.solar });
    });
    this.energyChartInput = [energy];
    if (this.meter.totalPowerExport > 0) {
      this.energyChartInput.push(energy_ex);
    }
    if (solar.series.length) {
      this.energyChartInput.push(solar);
    }
  }

  getMeterGasData(): void {
    if (this.meter.pk === 9999) {
      // this.mockPowerMeasurements();
      // this.setPowerSet();
      return;
    }
    this.gasMeasurementService.getMeasurementList(this.user.pk, this.meter.pk, this.gasMeasurementFilter).subscribe(
      data => {
        this.gasMeasurement = data;
        this.setGasSet();
      }, e => {
        console.log('error:', e);
      }, () => {
        this.loadingGas = false;
      });
  }

  setGasSet(): void {
    const gas = { name: 'Gas', series: [] };
    this.gasMeasurement.forEach((obj, ind) => {
      gas.series.push({ name: new Date(obj.timestamp), value: +obj.gas });
    });

    this.gasChartInput = [gas];
  }


  /// On changing the range filter
  onRangeFilterChange(value: TimestampRange, filter: MeasurementFilter): void {
    const now = new Date();
    const day = 24 * 60 * 60 * 1000; // calculated to day for Date object
    switch (value) {
      case TimestampRange.day:
        filter.assign({
          timestamp_after: new Date(now.getTime() - day).toISOString(),
          timestamp_before: now.toISOString(),
        });
        break;
      case TimestampRange.week:
        filter.assign({
          timestamp_after: new Date(now.getTime() - (day * 7)).toISOString(),
          timestamp_before: now.toISOString(),
        });
        break;

      case TimestampRange.month:
        filter.assign({
          timestamp_after: new Date(now.getTime() - (day * 30)).toISOString(),
          timestamp_before: now.toISOString(),
        });
        break;

      case TimestampRange.year:
        filter.assign({
          timestamp_after: new Date(now.getTime() - (day * 365)).toISOString(),
          timestamp_before: now.toISOString(),
        });
        break;
    }
    this.setupRangePicker(new Date(filter.timestamp_after), new Date(filter.timestamp_before));
    clearInterval(this.interval);
    this.interval = setInterval(this.getLatestMeterData, 300000);
  }

  setupRangePicker(start, end): void {

    if (!this.rangePickerForm) {
      this.rangePickerForm = new FormGroup({
        start: new FormControl(new Date(start)),
        end: new FormControl(new Date(end))
        // start: new FormControl(format(start, 'dd-MM-yyyy HH:mm')),
        // end: new FormControl(format(end, 'dd-MM-yyyy HH:mm'))
      });

      
      this.rangePickerForm.get('start').markAsUntouched();
      this.rangePickerForm.get('end').markAsUntouched();
      this.rangePickerForm.markAsUntouched();
      // this.rangePickerForm.markAsPristine();

      this.rangePickerForm.valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe(changes => {
        // console.log(changes, new Date(changes.start).toISOString());

        // if (changes.start && changes.end) {
        //   this.energyMeasurementFilter.assign({
        //     timestamp_after: new Date(start).toISOString(),
        //     timestamp_before: new Date(end).toISOString(),
        //   });
        // } else if (changes.start) {
        //   this.energyMeasurementFilter.assign({
        //     timestamp_after: new Date(start).toISOString(),
        //     timestamp_before: new Date().toISOString(),
        //   });
        // }
      });
    } else {
      this.rangePickerForm.get('start').patchValue(new Date(start), { emitEvent: false });
      this.rangePickerForm.get('end').patchValue(new Date(end), { emitEvent: false });
      // this.rangePickerForm.get('start').patchValue(format(start, 'dd-MM-yyyy HH:mm'), { emitEvent: false });
      // this.rangePickerForm.get('end').patchValue(format(end, 'dd-MM-yyyy HH:mm'), { emitEvent: false });
    }

    this.rangePickerForm.markAsUntouched();
    this.rangePickerForm.markAsPristine();

    


  }

  closedRangePicker(gas?: boolean) {
    if (!this.rangePickerForm.dirty) {
      return;
    }
    console.log(this.rangePickerForm, this.rangePickerForm.dirty);
    if (this.rangePickerForm.get('start').value && this.rangePickerForm.get('end').value) {
      this.energyMeasurementFilter.assign({
        timestamp_after: new Date(this.rangePickerForm.get('start').value).toISOString(),
        timestamp_before: new Date(this.rangePickerForm.get('end').value).toISOString(),
      });
    } else if (this.rangePickerForm.get('start').value) {
      this.energyMeasurementFilter.assign({
        timestamp_after: new Date(this.rangePickerForm.get('start').value).toISOString(),
        timestamp_before: new Date().toISOString(),
      });
    }
    console.log('fire2');

    clearInterval(this.interval);
    this.interval = setInterval(this.getLatestMeterData, 300000);
    // console.log(this.rangePickerForm.get('start').value);
  }


  getLatestMeterData = () => {
    this.onRangeFilterChange(this.rangeSelectPower, this.energyMeasurementFilter);
    this.onRangeFilterChange(this.rangeSelectGas, this.gasMeasurementFilter);
    this.getMeterPowerData();
    this.getMeterGasData();
    this.getMeterData();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    clearInterval(this.interval);
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
