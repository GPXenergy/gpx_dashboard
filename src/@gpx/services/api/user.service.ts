import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DataService } from './data.service';
import { pkType } from '@gpx/models/base';
import { User } from '@gpx/models/user.model';

export type UserList = User[];

/**
 *
 */
@Injectable({
  providedIn: 'root'
})
export class UserService extends DataService<UserList, User> {
  protected readonly model = User;
  protected readonly actionUrl = '/api/users/{{user_pk?}}/{%{{password}}password/%}';

  public createUser(user: User): Observable<User> {
    return this.add(user);
  }

  public getUser(userPk: pkType): Observable<User> {
    return this.get({user_pk: userPk});
  }

  public updateUser(userPk: pkType, user: User): Observable<User> {
    return this.update(user, {user_pk: userPk});
  }

  public deleteUser(userPk: pkType): Observable<User> {
    return this.remove({user_pk: userPk});
  }

}
