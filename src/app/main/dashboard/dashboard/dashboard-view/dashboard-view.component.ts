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
  filterRangeOptions = TimestampRange;
  powerMeasurement: PowerMeasurement[] = [];
  solarMeasurement: SolarMeasurement[] = [];
  energyMeasurementFilter: MeasurementFilter;
  rangeSelectPower: TimestampRange = TimestampRange.day;
  energyChartInput: IChartData[];
  loadingEnergy: boolean;
  gasMeasurement: GasMeasurement[] = [];
  gasMeasurementFilter: MeasurementFilter;
  rangeSelectGas: TimestampRange = TimestampRange.day;
  gasChartInput: IChartData[];
  loadingGas: boolean;
  invertPowerImport: boolean;

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
    titleService.setTitle('Dashboard | GPX');
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

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    clearInterval(this.interval);
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
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
    const energy = {name: 'levering', series: []};
    const energy_ex = {name: 'teruglevering', series: []};
    const solar = {name: 'zon-productie', series: []};
    this.powerMeasurement.forEach((obj, ind) => {
      energy.series.push({name: new Date(obj.timestamp), value: this.invertPowerImport ? -obj.actual_import : +obj.actual_import});
      if (this.meter.totalPowerExport > 0) {
        energy_ex.series.push({name: new Date(obj.timestamp), value: +obj.actual_export});
      }
    });

    this.solarMeasurement.forEach(obj => {
      solar.series.push({name: new Date(obj.timestamp), value: +obj.actual_solar});
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
    const gas = {name: 'Gas', series: []};
    this.gasMeasurement.forEach((obj, ind) => {
      gas.series.push({name: new Date(obj.timestamp), value: +obj.actual_gas});
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
    clearInterval(this.interval);
    this.interval = setInterval(this.getLatestMeterData, 300000);
  }


  getLatestMeterData = () => {
    this.onRangeFilterChange(this.rangeSelectPower, this.energyMeasurementFilter);
    this.onRangeFilterChange(this.rangeSelectGas, this.gasMeasurementFilter);
    this.getMeterPowerData();
    this.getMeterGasData();
    this.getMeterData();
  };

}
