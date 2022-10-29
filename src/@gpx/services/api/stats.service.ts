import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DataService } from './data.service';
import { DashboardStats } from '../../models/stats.model';

/**
 * Get dashboard statistics
 */
@Injectable({
  providedIn: 'root'
})
export class DashboardStatsService extends DataService<null, DashboardStats> {
  protected readonly model = DashboardStats;
  protected readonly actionUrl = '/api/stats/';

  public getStats(): Observable<DashboardStats> {
    return this.get();
  }

}
