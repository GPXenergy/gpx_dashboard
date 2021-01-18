import { DataService } from './data.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { pkType } from '@gpx/models/base';
import { Meter } from '@gpx/models/meter.model';

export type MeterList = Meter[];

/**
 *
 */
@Injectable({
  providedIn: 'root'
})
export class MeterService extends DataService<MeterList, Meter> {
  protected model = Meter;

  public getMeterList(userPk: pkType, filter?: any): Observable<MeterList> {
    return this.getList(filter, {user_pk: userPk});
  }

  public getMeter(userPk: pkType, meterPk: pkType): Observable<Meter> {
    return this.get({user_pk: userPk, meter_pk: meterPk});
  }

  public updateMeter(userPk: pkType, meterPk: pkType, meter: Meter): Observable<Meter> {
    return this.update(meter, {user_pk: userPk, meter_pk: meterPk});
  }

  public removeMeter(userPk: pkType, meterPk: pkType): Observable<Meter> {
    return this.remove({user_pk: userPk, meter_pk: meterPk});
  }

  /**
   * Uri for the manage meter endpoint
   */
  protected getActionUrl(): string {
    return '/api/users/{{user_pk}}/meters/{{meter_pk?}}';
  }

}
