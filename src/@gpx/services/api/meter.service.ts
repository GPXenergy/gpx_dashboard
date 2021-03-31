import { DataService } from './data.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { pkType } from '@gpx/models/base';
import { Meter } from '@gpx/models/meter.model';
import { MeasurementFilter } from './measurement.service';

export type MeterList = Meter[];

export class MeterMeasurementFilter extends MeasurementFilter {
  measurements = true;
}

/**
 *
 */
@Injectable({
  providedIn: 'root'
})
export class MeterService extends DataService<MeterList, Meter> {
  protected readonly model = Meter;
  protected readonly actionUrl = '/api/users/{{user_pk}}/meters/{{meter_pk?}}';

  public getMeterList(userPk: pkType, filter?: any): Observable<MeterList> {
    return this.getList({user_pk: userPk}, filter);
  }

  public getMeter(userPk: pkType, meterPk: pkType, measurementFilter?: MeterMeasurementFilter): Observable<Meter> {
    return this.get({user_pk: userPk, meter_pk: meterPk}, measurementFilter);
  }

  public updateMeter(userPk: pkType, meterPk: pkType, meter: Meter): Observable<Meter> {
    return this.update(meter, {user_pk: userPk, meter_pk: meterPk});
  }

  public removeMeter(userPk: pkType, meterPk: pkType): Observable<Meter> {
    return this.remove({user_pk: userPk, meter_pk: meterPk});
  }

}
