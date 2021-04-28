import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Title } from '@angular/platform-browser';
import {
  connectorComponents,
  IConnectorComponents,
  ILEDData,
  IMeterMake,
  IMeterModel,
  ledData,
  meterGroups
} from '../manual_data';


interface IMeterTableData extends IMeterModel {
  make?: string;
}

@Component({
  selector: 'gpxc-manual-view',
  templateUrl: './gpx-connector-manual-view.component.html',
  styleUrls: ['./gpx-connector-manual-view.component.scss'],
})
export class GpxConnectorManualViewComponent implements OnInit, OnDestroy {
  private readonly _unsubscribeAll = new Subject<void>();

  meterGroups: IMeterMake[] = meterGroups;
  ledData: ILEDData[] = ledData;
  connectorComponents: IConnectorComponents = connectorComponents;

  selectedVersion = 'v1';

  constructor(private titleService: Title) {
    this.titleService.setTitle('Gebruikershandleiding GPXconnector | GPX');
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  get meterTableData(): IMeterTableData[] {
    return [].concat(...this.meterGroups.map((groupData) => {
      return groupData.meters.map((value: any, index) => {
        if (index === 0) {
          value.make = groupData.name;
        }
        return value;
      });
    }));
  }
}
