import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MobileService } from '@gpx/services/mobile.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


export interface IChartData {
  name: string;
  series: { name: Date, value: number }[];
}

@Component({
  selector: 'dashboard-graph',
  templateUrl: './dashboard-graph.component.html',
  styleUrls: ['./dashboard-graph.component.scss']
})
export class DashboardGraphComponent implements OnInit, OnDestroy {

  private readonly _unsubscribeAll = new Subject<void>();

  @Input() chartInput: IChartData[] = [];
  @Input() loading = true;

  // multi: any[];
  view: any[] = [700, 300];
  // options
  legend = true;
  showLabels = true;
  animations = true;
  xAxis = true;
  yAxis = true;
  showYAxisLabel = true;
  showXAxisLabel = true;
  @Input() xAxisLabel = 'Periode';
  @Input() yAxisLabel: string;
  timeline = true;
  gradient = true;
  colorScheme = {
    domain: ['#FF3B4E', '#006937', '#FFE224']
  };

  constructor(private cd: ChangeDetectorRef, mb: MobileService) {
    mb.isMobile.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      isMobile => this.legend = !isMobile
    );
  }

  ngOnInit(): void {
  }

  /// method, dateTickFormatting...
  formatDate(value: any): string {
    const locale = 'nl-NL';
    if (value instanceof Date) {
      let formatOptions;
      if (value.getMinutes() !== 0) {
        formatOptions = {hour: '2-digit', minute: '2-digit'};
      } else if (value.getHours() !== 0) {
        formatOptions = {hour: '2-digit', minute: '2-digit'};
      } else if (value.getDate() !== 1) {
        formatOptions = value.getDay() === 0 ? {month: 'short', day: '2-digit'} : {weekday: 'short', day: '2-digit'};
      } else if (value.getMonth() !== 0) {
        formatOptions = {month: 'long'};
      } else {
        formatOptions = {year: 'numeric'};
      }
      return new Intl.DateTimeFormat(locale, formatOptions).format(value);
    }
  }

  get tooltipDateFormat(): string {
    const series = this.chartInput[0].series,
      firstDate = series[0].name,
      lastDate = series[series.length - 1].name,
      millisDiff = lastDate.valueOf() - firstDate.valueOf();
    if (millisDiff < 25 * 60 * 60 * 1000) {
      return 'HH:mm (dd MMM yyyy)';
    }
    if (millisDiff < 8 * 24 * 60 * 60 * 1000) {
      return 'HH:00 (dd MMM yyyy)';
    }
    return 'dd MMM yyyy';
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  unitForSeries(series: string): string {
    if (['import', 'export', 'zon-productie'].includes(series.toLowerCase())) {
      return 'kW';
    }
    if (['gasconsumptie'].includes(series.toLowerCase())) {
      return 'm³/h';
    }
  }

}
