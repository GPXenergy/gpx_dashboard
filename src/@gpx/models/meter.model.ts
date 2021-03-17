import { BaseModel, modelPropertiesObj, modelRelation } from './base';
import { GroupParticipant } from './group-meter.model';
import { User } from './user.model';

/**
 * Meter model
 */
export class Meter extends BaseModel {

  /// Related to user
  user: modelRelation<User>;
  // # Customizable name for this meter, for identification to the user
  name: string;
  // If the meter name and relations are made public when the group meter is made public
  visibility_type: 'private' | 'group' | 'public';
  // Meter type, configurable by the user, used to display better information on group meter
  type: 'consumer' | 'prosumer' | 'battery' | 'producer_solar' | 'producer_wind' | 'producer_other';
  //  GPX - Connector version
  gpx_version: string; // 'x.y.z'
  // Timestamp of last change to this model
  last_update: Date;
  // current group participation (active)
  group_participation: modelRelation<GroupParticipant>;


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
