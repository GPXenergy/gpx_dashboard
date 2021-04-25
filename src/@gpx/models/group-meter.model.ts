import { BaseModel, modelPropertiesObj, modelRelation, modelRelationArray } from './base';
import { User } from './user.model';

/**
 * GroupMeter model, connecting multiple meters together through participation
 */
export class GroupMeter extends BaseModel {

  /// read only values
  manager: modelRelation<User>;

  /// Settings
  name: string;  // Group name given by manager
  summary: string;  // Optional short description of the group meter
  created_on: Date;
  public: boolean;  // If public, the group meter can be retrieved by any visitor
  public_key: string;  // a-z, 0-9 and dashes, e.g. lommerd-dazo, only used by public (visitors)

  allow_invite: boolean;
  invitation_key: string;  // id to create a link for members to join

  /// Participants
  participants: modelRelationArray<GroupParticipant>;

  /// read only properties
  // total usage by all participants
  total_import: number;
  total_export: number;
  total_gas: number;

  // current usages by active participants
  actual_power: number;
  actual_gas: number;
  actual_solar: number;

  public get publicUrl(): string {
    if (this.public_key) {
      return `${window.location.origin}/live/${this.public_key}`;
    }
    return null;
  }

  public get invitationUrl(): string {
    return `${window.location.origin}/configure/group/?invite=${this.invitation_key}`;
  }

  public get totalPower(): number {
    return this.total_export - this.total_import;
  }

  public getParticipants(): GroupParticipant[] {
    return BaseModel.getModelPropertyArray(GroupParticipant, this.participants);
  }

  public getManager(): User {
    return BaseModel.getModelProperty(User, this.manager);
  }

  /**
   * Applies updates from incoming real time data
   * @param group: new group data
   */
  public applyUpdates(group: GroupMeter) {
    this.total_import = group.total_import;
    this.total_export = group.total_export;
    this.total_gas = group.total_gas;
    this.actual_power = group.actual_power;
    this.actual_gas = group.actual_gas;
    this.actual_solar = group.actual_solar;
    group.getParticipants().forEach(participant => {
      const local_participant = this.getParticipants().find(p => p.pk === participant.pk);
      local_participant.applyUpdates(participant);
    });
  }

  protected createModelRelations(values: modelPropertiesObj<this>): void {
    super.createModelRelations(values);
    this.createRelation(User, values, 'manager');
    this.createArrayRelation(GroupParticipant, values, 'participants');
  }
}

/**
 * Enum for participant connection
 * ACTIVE - was updated in last hour
 * INACTIVE - was active over 1 hour ago (quite old data)
 * OFFLINE - was updated over 24 hours ago (very old data)
 */
export enum ParticipantConnection {
  ACTIVE, INACTIVE, OFFLINE
}

/**
 * A group meter participant, joined a group meter at some point in time, might have left already, the data will be
 * kept.
 */
export class GroupParticipant extends BaseModel {
  /// To display on the group meter page, all data is in the meter model.
  group: modelRelation<GroupMeter>;

  /// For traceability and management
  active: boolean;
  joined_on: Date;
  last_activity: Date;
  type: 'consumer' | 'prosumer' | 'battery' | 'producer_solar' | 'producer_wind' | 'producer_other';
  left_on: Date;
  display_name: string;

  user_pk: number;

  // total usage by this participant,  calculated properties for showing in group meter page
  total_import: number;
  total_export: number;
  total_gas: number;

  // current usages by this participant, for showing in group meter page
  actual_power: number;
  actual_gas: number;
  actual_solar: number;

  /**
   * Get total power (in/export since joined) for this participant
   */
  public get totalPower(): number {
    return this.total_export - this.total_import;
  }

  /**
   * Get the actual internal power usage
   */
  public get actualInternal(): number {
    const internal = this.actual_solar - this.actual_power;
    return internal < 0 ? 0 : internal;
  }

  public get lastActivity(): ParticipantConnection {
    const MINUTE = 1000 * 60,
      HOUR = 60 * MINUTE,
      now = Date.now();

    if (now - (MINUTE * 30) < this.last_activity.valueOf()) {
      return ParticipantConnection.ACTIVE;
    } else if (now - (HOUR * 2) < this.last_activity.valueOf()) {
      return ParticipantConnection.INACTIVE;
    }
    return ParticipantConnection.OFFLINE;
  }

  public statusIcon(): string {
    switch (this.lastActivity) {
      case ParticipantConnection.ACTIVE:
        return 'signal_cellular_4_bar';
      case ParticipantConnection.INACTIVE:
        return 'signal_cellular_connected_no_internet_4_bar';
      case ParticipantConnection.OFFLINE:
        return 'signal_cellular_off';
    }
  }

  public statusText(): string {
    switch (this.lastActivity) {
      case ParticipantConnection.ACTIVE:
        return 'Live';
      case ParticipantConnection.INACTIVE:
        return 'Inactief';
      case ParticipantConnection.OFFLINE:
        return 'Offline';
    }
  }

  /**
   * Get group
   */
  public getGroup(): GroupMeter {
    return BaseModel.getModelProperty(GroupMeter, this.group);
  }

  /**
   * Applies updates from incoming real time data for participant
   * @param participant: new participant data
   */
  public applyUpdates(participant: GroupParticipant): void {
    this.last_activity = new Date();
    this.total_import = participant.total_import;
    this.total_export = participant.total_export;
    this.total_gas = participant.total_gas;
    this.actual_power = participant.actual_power;
    this.actual_gas = participant.actual_gas;
    this.actual_solar = participant.actual_solar;
  }

  public get typeName(): string {
    switch (this.type){
      case 'consumer':
        return 'Consument';
      case 'prosumer':
        return 'Prosument';
      case 'battery':
        return 'Batterij';
      case 'producer_solar':
        return 'Zonnepark';
      case 'producer_wind':
        return 'Windpark';
      case 'producer_other':
        return 'Producent (anders)';
      default:
        return 'Onbekend';
    }
  }

  public get averageGasPerDay(): number {
    const span = (this.last_activity.getTime() - this.joined_on.getTime()) / 1000;
    return span ? this.total_gas / span * 60 * 60 * 24 : 0;
  }

  public get averageImportPerDay(): number {
    const span = (this.last_activity.getTime() - this.joined_on.getTime()) / 1000;
    return span ? this.total_import / span * 60 * 60 * 24 : 0;
  }

  public get averageExportPerDay(): number {
    const span = (this.last_activity.getTime() - this.joined_on.getTime()) / 1000;
    return span ? this.total_export / span * 60 * 60 * 24 : 0;
  }

  protected createModelRelations(values: modelPropertiesObj<this>): void {
    super.createModelRelations(values);
    this.createRelation(GroupMeter, values, 'group');
  }

  protected cleanFields(): void {
    super.cleanFields();
    this.last_activity = new Date(this.last_activity);
    this.joined_on = new Date(this.joined_on);
    this.total_import = +this.total_import;
    this.total_export = +this.total_export;
    this.total_gas = +this.total_gas;
    this.actual_power = +this.actual_power;
    this.actual_gas = +this.actual_gas;
    this.actual_solar = +this.actual_solar;
  }

}

