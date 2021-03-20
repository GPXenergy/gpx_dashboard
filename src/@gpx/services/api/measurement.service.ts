import { DataService, QueryParams } from './data.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GasMeasurement, PowerMeasurement, SolarMeasurement } from '@gpx/models/meter.model';
import { pkType } from '@gpx/models/base';

export type PowerMeasurementList = PowerMeasurement[];
export type GasMeasurementList = GasMeasurement[];
export type SolarMeasurementList = SolarMeasurement[];

export class MeasurementFilter extends QueryParams {
  timestamp_after: string;
  timestamp_before: string;

  start_date: Date;
  end_date: Date;
}


/**
 * Power measurement service
 */
@Injectable({
  providedIn: 'root'
})
export class PowerMeasurementService extends DataService<PowerMeasurementList, PowerMeasurement> {
  protected model = PowerMeasurement;

  public getMeasurementList(userPk: pkType, meterPk: pkType, filter?: MeasurementFilter): Observable<PowerMeasurementList> {
    return this.getList({user_pk: userPk, meter_pk: meterPk}, filter);
  }

  /**
   * Uri for the power measurement list
   */
  protected getActionUrl(): string {
    return '/api/users/{{user_pk}}/meters/{{meter_pk}}/power/';
  }
}

/**
 * Gas measurement service
 */
@Injectable({
  providedIn: 'root'
})
export class GasMeasurementService extends DataService<GasMeasurementList, GasMeasurement> {
  protected model = GasMeasurement;

  public getMeasurementList(userPk: pkType, meterPk: pkType, filter?: MeasurementFilter): Observable<GasMeasurementList> {
    return this.getList({user_pk: userPk, meter_pk: meterPk}, filter);
  }

  /**
   * Uri for the gas measurement list
   */
  protected getActionUrl(): string {
    return '/api/users/{{user_pk}}/meters/{{meter_pk}}/gas/';
  }
}

/**
 * Solar measurement service
 */
@Injectable({
  providedIn: 'root'
})
export class SolarMeasurementService extends DataService<SolarMeasurementList, SolarMeasurement> {
  protected model = SolarMeasurement;

  public getMeasurementList(userPk: pkType, meterPk: pkType, filter?: MeasurementFilter): Observable<SolarMeasurementList> {
    return this.getList({user_pk: userPk, meter_pk: meterPk}, filter);
  }

  /**
   * Uri for the solar measurement list
   */
  protected getActionUrl(): string {
    return '/api/users/{{user_pk}}/meters/{{meter_pk}}/solar/';
  }
}
