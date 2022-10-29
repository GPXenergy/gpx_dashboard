import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { MobileService } from '@gpx/services/mobile.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

interface IChartData {
  name: string;
  series: { name: Date, value: number }[];
  unit: string;
}

export interface IGraphData {
  data: IChartData[];
  colorScheme?: {domain: string[]};
}

@Component({
  selector: 'gpx-dashboard-graph',
  templateUrl: './dashboard-graph.component.html',
  styleUrls: ['./dashboard-graph.component.scss']
})
export class DashboardGraphComponent implements OnChanges, OnDestroy {

  private readonly _unsubscribeAll = new Subject<void>();

  @Input() chartInput: IGraphData = {data: []};
  @Input() loading = true;

  // multi: any[];
  view: any[] = [700, 300];
  // options
  isMobile = true;
  showLabels = true;
  animations = true;
  xAxis = true;
  yAxis = true;
  showYAxisLabel = true;
  showXAxisLabel = true;
  @Input() xAxisLabel = 'Periode';
  @Input() yAxisLabel: string;
  gradient = false;

  constructor(private cd: ChangeDetectorRef, mb: MobileService) {
    mb.isMobile.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      isMobile => this.isMobile = isMobile
    );
  }

  ngOnChanges(): void {
    this.cd.detectChanges();
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
    const series = this.chartInput.data[0].series,
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
    return this.chartInput.data.find(obj => obj.name === series).unit;
  }

}
