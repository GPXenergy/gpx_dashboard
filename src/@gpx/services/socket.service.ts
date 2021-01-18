import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

import { DomainService } from './domain.service';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { GroupMeter, GroupParticipant } from '../models/group-meter.model';
import { map } from 'rxjs/operators';

/**
 * Socket response from the nodejs
 */
interface IResponse<T = null> {
  ok: boolean;
  error: any;
  data: T;
}

/**
 * Group data received from socket, has shorter property names to reduce data
 */
interface ILiveGroupData {
  pk: number;  // Group meter id
  r: {  // Participant updates
    pk: number;
    ti: number;
    te: number;
    tg: number;
    p: number;
    g: number;
    s: number;
  }[];
  ti: number;  // total power import
  te: number;  // total power export
  tg: number;  // total gas
  p: number;  // actual power
  g: number;  // actual gas
  s: number;  // actual solar
}

/**
 * connection to the nodejs server for real time data
 */
@Injectable({
  providedIn: 'root'
})
export class SocketService extends Socket {
  private readonly _groupUpdates: Observable<GroupMeter>;
  private readonly _socketConnected: Observable<null>;

  constructor(private authService: AuthService, private domainService: DomainService) {
    super({
      url: domainService.domainInfo('nodejs').url.replace('http', 'ws'),
      options: {
        reconnection: true,
        autoConnect: true,
      }
    });

    this._groupUpdates = this.fromEvent<ILiveGroupData>('group:update').pipe(map(
      // convert the incoming data to a group meter instance
      group => new GroupMeter().deserialize({
        pk: group.pk,
        total_import: group.ti,
        total_export: group.te,
        total_gas: group.tg,
        actual_power: group.p,
        actual_gas: group.g,
        actual_solar: group.s,
        participants: group.r.map(participant => new GroupParticipant().deserialize({
          pk: participant.pk,
          total_import: participant.ti,
          total_export: participant.te,
          total_gas: participant.tg,
          actual_power: participant.p,
          actual_gas: participant.g,
          actual_solar: participant.s,
        }))
      })
    ));

    this._socketConnected = this.fromEvent('connect');
  }

  get groupUpdates(): Observable<GroupMeter> {
    return this._groupUpdates;
  }

  get socketConnected(): Observable<null> {
    return this._socketConnected;
  }

  subscribeToGroup(group: GroupMeter, as_public: boolean) {
    this.emit('group:connect', {
      authorization: this.authService.token,
      group: as_public ? group.public_key : group.pk,
      public: as_public,
    }, (response: IResponse) => {
      console.log('Socket:', response);
    });
  }

  unsubscribeFromGroup(groupPk: number) {
    this.emit('group:disconnect', {
      group: groupPk
    }, (response: IResponse) => {
      console.log('Socket:', response);
    });
  }
}
