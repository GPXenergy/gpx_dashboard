import { BaseModel, modelPropertiesObj, modelRelation } from './base';
import { GroupParticipant } from './group-meter.model';
import { User } from './user.model';
import { EMeterType, EMeterVisibility, EResidenceEnergyLabel, EResidenceType } from './types';


/**
 * Meter model
 */
export class Meter extends BaseModel {

  /// Related to user
  user: modelRelation<User>;
  // # Customizable name for this meter, for identification to the user
  name: string;
  // If the meter name and relations are made public when the group meter is made public
  visibility_type: EMeterVisibility;
  // Meter type, configurable by the user, used to display better information on group meter
  type: EMeterType;
  //  GPX - Connector version
  gpx_version: string; // 'x.y.z'
  // Timestamp of last change to this model
  last_update: Date;
  // current group participation (active)
  group_participation: modelRelation<GroupParticipant>;

  // Residence information
  resident_count: number;
  residence_type: EResidenceType;
  residence_energy_label: EResidenceEnergyLabel;
  solar_panel_count: number;

  /// Power data
  sn_power: string;
  power_timestamp: Date;
  total_power_import_1: number;
  total_power_import_2: number;
  total_power_export_1: number;
  total_power_export_2: number;
  tariff: number;
  actual_power_import: number;
  actual_power_export: number;

  /// Gas data
  sn_gas: string;
  gas_timestamp: Date;
  actual_gas: number;
  total_gas: number;

  /// Solar data
  solar_timestamp: Date;
  actual_solar: number;
  total_solar: number;

  /// Period data (for dashboard
  period_import_1: number;
  period_import_2: number;
  period_export_1: number;
  period_export_2: number;
  period_gas: number;
  period_solar: number;

  /// measurement sets from meter with measurement endpoint for personal dashboard
  power_set: any[];
  solar_set: any[];
  gas_set: any[];

  /// measurement sets from meter with measurement endpoint for personal dashboard
  power_measurement_set: PowerMeasurement[];
  solar_measurement_set: SolarMeasurement[];
  gas_measurement_set: GasMeasurement[];

  /**
   * Flag this user is in a group meter
   */
  public get in_group(): boolean {
    return !!this.group_participation;
  }

  /**
   * Sum of export 1 and export 2
   */
  public get totalPowerExport(): number {
    return this.total_power_export_1 + this.total_power_export_2;
  }

  /**
   * Sum of import 1 and import 2
   */
  public get totalPowerImport(): number {
    return this.total_power_import_1 + this.total_power_import_2;
  }

  /**
   * Total import minus total export.
   * + export
   * - import
   */
  public get totalPower(): number {
    return this.totalPowerExport - this.totalPowerImport;
  }

  /**
   * Current power (importing or exporting),
   * + export
   * - import
   */
  public get actualPower(): number {
    return this.actual_power_export - this.actual_power_import;
  }

  public getUser(): User {
    return BaseModel.getModelProperty(User, this.user);
  }

  public getGroupParticipation(): GroupParticipant {
    return BaseModel.getModelProperty(GroupParticipant, this.group_participation);
  }

  protected createModelRelations(values: modelPropertiesObj<this>): void {
    super.createModelRelations(values);
    this.createRelation(User, values, 'user');
    this.createRelation(GroupParticipant, values, 'group_participation');
  }

  protected cleanFields(): void {
    super.cleanFields();
    this.total_power_import_1 = +this.total_power_import_1;
    this.total_power_import_2 = +this.total_power_import_2;
    this.total_power_export_1 = +this.total_power_export_1;
    this.total_power_export_2 = +this.total_power_export_2;
    this.actual_power_import = +this.actual_power_import;
    this.actual_power_export = +this.actual_power_export;
    this.total_gas = +this.total_gas;
    this.actual_solar = +this.actual_solar;
    if (this.power_set) {
      this.power_measurement_set = this.power_set.map(measurement => new PowerMeasurement().deserialize({
        timestamp: measurement[0],
        actual_import: measurement[1],
        actual_export: measurement[2],
        total_import_1: measurement[3],
        total_import_2: measurement[4],
        total_export_1: measurement[5],
        total_export_2: measurement[6],
      }));
    } else {
      this.power_measurement_set = [];
    }
    if (this.solar_set) {
      this.solar_measurement_set = this.solar_set.map(measurement => new SolarMeasurement().deserialize({
        timestamp: measurement[0],
        actual_solar: measurement[1],
        total_solar: measurement[2],
      }));
    } else {
      this.solar_measurement_set = [];
    }
    if (this.gas_set) {
      this.gas_measurement_set = this.gas_set.map(measurement => new GasMeasurement().deserialize({
        timestamp: measurement[0],
        actual_gas: measurement[1],
        total_gas: measurement[2],
      }));
    } else {
      this.gas_measurement_set = [];
    }
  }
}

export class SolarMeasurement extends BaseModel {
  timestamp: Date;
  actual_solar: number;
  total_solar: number;
}


export class PowerMeasurement extends BaseModel {
  timestamp: Date;
  actual_import: number;
  actual_export: number;
  total_import_1: number;
  total_import_2: number;
  total_export_1: number;
  total_export_2: number;
}


export class GasMeasurement extends BaseModel {
  timestamp: Date;
  actual_gas: number;
  total_gas: number;
}
