import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DataService } from './data.service';
import { DashboardStats } from '../../models/stats.model';
import { User } from '../../models/user.model';

/**
 * Request new password
 */
@Injectable({
  providedIn: 'root'
})
export class ResetPasswordActionService extends DataService<null, User> {
  protected readonly model = User;
  protected readonly actionUrl = '/api/auth/reset-password/{{hash?}}';

  public requestPasswordReset(model: User): Observable<User> {
    return this.add(model);
  }

  public validateHash(hash: string): Observable<User> {
    return this.get({hash: hash});
  }

  public resetPassword(model: User, hash: string): Observable<User> {
    return this.update(model, {hash: hash});
  }
}
