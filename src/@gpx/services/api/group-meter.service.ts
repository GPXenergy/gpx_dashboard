import { DataService } from './data.service';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { GroupMeter, GroupParticipant } from '@gpx/models/group-meter.model';
import { pkType } from '@gpx/models/base';

export type GroupMeterList = GroupMeter[];
export type GroupParticipantList = GroupParticipant[];


/**
 *
 */
@Injectable({
  providedIn: 'root'
})
export class GroupMeterService extends DataService<GroupMeterList, GroupMeter> {
  protected model = GroupMeter;

  public getGroupMeterList(userPk: pkType, filter?: any): Observable<GroupMeterList> {
    return this.getList(filter, {user_pk: userPk});
  }

  public getGroupMeter(userPk: pkType, groupPk: pkType): Observable<GroupMeter> {
    return this.get({user_pk: userPk, group_pk: groupPk});
  }

  public getGroupMeterDisplay(groupPk: pkType): Observable<GroupMeter> {
    return this.get({group_pk: groupPk});
  }

  public getGroupMeterPublicDisplay(publicKey: string): Observable<GroupMeter> {
    if (publicKey === 'spijkermensen' || publicKey === 'aardehuizen') {  // TODO: Remove MOCK
      return from(new Promise<GroupMeter>((resolve, reject) => (resolve(MOCK_GROUP_METER()))));
    }
    return this.get({public_key: publicKey});
  }

  public getGroupMeterInvite(inviteKey: string): Observable<GroupMeter> {
    return this.get({invite_key: inviteKey});
  }

  public addGroupMeter(userPk: pkType, groupMeter: GroupMeter): Observable<GroupMeter> {
    return this.add(groupMeter, {user_pk: userPk});
  }

  public updateGroupMeter(userPk: pkType, meterPk: pkType, groupMeter: GroupMeter): Observable<GroupMeter> {
    return this.update(groupMeter, {user_pk: userPk, group_pk: meterPk});
  }

  public deleteGroupMeter(userPk: pkType, meterPk: pkType): Observable<null> {
    return this.remove({user_pk: userPk, group_pk: meterPk});
  }

  /**
   * Uri for the manage group meter endpoint, can generate:
   * /api/users/userpk/meters/groups/pk? - For group list / detail for user meters
   * /api/meters/groups/pk? - For display
   * /api/meters/groups/public/public_key? - For public display
   * /api/meters/groups/invite/invite_key? - For checking invitation key and displaying group info when joining
   */
  protected getActionUrl(): string {
    return '/api/{%users/{{user_pk}}/%}meters/groups/{%public/{{public_key}}%}{%invite/{{invite_key}}%}{{group_pk?}}/';
  }
}

@Injectable({
  providedIn: 'root'
})
export class GroupParticipationService extends DataService<GroupParticipantList, GroupParticipant> {
  protected model = GroupParticipant;

  public getGroupParticipantList(userPk: pkType, filter?: any): Observable<GroupParticipantList> {
    return this.getList(filter, {user_pk: userPk});
  }

  public getGroupParticipant(userPk: pkType, groupParticipantPk: pkType): Observable<GroupParticipant> {
    return this.get({user_pk: userPk, group_pk: groupParticipantPk});
  }

  public addGroupParticipant(userPk: pkType, groupParticipant: GroupParticipant): Observable<GroupParticipant> {
    return this.add(groupParticipant, {user_pk: userPk});
  }

  public updateGroupParticipant(userPk: pkType, participantPk: pkType, groupParticipant: GroupParticipant): Observable<GroupParticipant> {
    return this.update(groupParticipant, {user_pk: userPk, participation_pk: participantPk});
  }

  public deleteGroupParticipant(userPk: pkType, participantPk: pkType): Observable<null> {
    return this.remove({user_pk: userPk, participation_pk: participantPk});
  }

  /**
   * Uri for the manage group meter endpoint
   */
  protected getActionUrl(): string {
    return '/api/users/{{user_pk}}/meters/participation/{{participation_pk?}}';
  }

}


function MOCK_GROUP_METER(): GroupMeter {
  return new GroupMeter().deserialize({
    pk: 9999,
    name: 'Aardehuizen',
    public: true,
    public_key: 'aardehuizen',
    summary: 'Een mockup groepsmeter van de aardehuizen in Olst.',
    created_on: new Date(),
    manager: 9999,
    total_import: 1234.56,
    total_export: 0,
    total_gas: 123,
    actual_power: 12.34,
    participants: [
      new GroupParticipant().deserialize({
        pk: 421,
        display_name: 'Jochem',
        total_import: 2400.613,
        total_export: 5922.735,
        total_gas: 143,
        actual_power: 3.412,
        actual_solar: 4.111,
        actual_gas: 0,
        joined_on: new Date(),
        last_activity: new Date(),
      }),
      new GroupParticipant().deserialize({
        pk: 435,
        display_name: 'ZZ-Batterij',
        total_import: 3614.415,
        total_export: 3600.911,
        total_gas: 0,
        actual_power: -0.441,
        actual_solar: 4.241,
        actual_gas: 0,
        joined_on: new Date(),
        last_activity: new Date(),
      }),
      new GroupParticipant().deserialize({
        pk: 155,
        display_name: 'Linda',
        total_import: 7834.122,
        total_export: 0,
        total_gas: 589,
        actual_power: -2.859,
        actual_solar: 0,
        actual_gas: 0,
        joined_on: new Date(),
        last_activity: new Date(),
      }),
      new GroupParticipant().deserialize({
        pk: 48,
        display_name: 'SolarPV',
        total_import: 0.0,
        total_export: 4294.612,
        total_gas: 0,
        actual_power: 3.214,
        actual_solar: 3.214,
        actual_gas: 0,
        joined_on: new Date(),
        last_activity: new Date(),
      }),
      new GroupParticipant().deserialize({
        pk: 552,
        display_name: 'Maria',
        total_import: 1410.161,
        total_export: 0,
        total_gas: 289,
        actual_power: -2.144,
        actual_solar: 0,
        actual_gas: 0,
        joined_on: new Date(),
        last_activity: new Date(),
      }),
      new GroupParticipant().deserialize({
        pk: 421,
        display_name: 'Fred',
        total_import: 21.122,
        total_export: 23.551,
        total_gas: 3,
        actual_power: -0.231,
        actual_solar: 0.111,
        actual_gas: 6,
        joined_on: new Date(),
        last_activity: new Date(),
      }),
      new GroupParticipant().deserialize({
        pk: 86,
        display_name: 'Sjors',
        total_import: 1241.152,
        total_export: 0,
        total_gas: 151,
        actual_power: -2.200,
        actual_solar: 0,
        actual_gas: 0,
        joined_on: new Date(),
        last_activity: new Date(),
      }),
    ],
  });
}
