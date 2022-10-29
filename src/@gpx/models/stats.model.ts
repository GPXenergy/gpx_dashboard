import { BaseModel, modelPropertiesObj, modelRelation } from './base';
import { GroupParticipant } from './group-meter.model';
import { User } from './user.model';
import { EMeterType, EMeterVisibility, EResidenceEnergyLabel, EResidenceType } from './types';


/**
 * DashboardStats model
 */
export class DashboardStats extends BaseModel {
  live_meters: number;
  total_meters: number;
  public_groups: number;
  total_groups: number;
  total_users: number;
}
