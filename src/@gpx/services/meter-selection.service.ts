import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { pkType } from '../models/base';
import { AuthService } from './auth.service';
import { Meter } from '../models/meter.model';
import { AuthUser } from '../models/auth-user.model';
import { MeterService } from './api/meter.service';
import { UserService } from './api/user.service';
import { ResettableReplaySubject } from '../rxjs-subjects/resettable-replay-subject';


/**
 * Service that can be injected to provide information about which meter is currently selected (in the sidebar)
 */
@Injectable({
  providedIn: 'root'
})
export class MeterSelectionService {
  private _selectedMeterSubject: ResettableReplaySubject<Meter> = new ResettableReplaySubject<Meter>(1);
  private _availableMetersSubject: ResettableReplaySubject<Meter[]> = new ResettableReplaySubject<Meter[]>(1);

  constructor(private authService: AuthService,
              private userService: UserService,
              private meterService: MeterService) {

    authService.userUpdated.subscribe(user => {
      // Get meters if the user is available and we dont have meters yet
      if (this._availableMeters === null && user) {
        this.updateMeters(user);
      } else if (!user) {
        // If user was logged out, we clear the available meters
        this._availableMeters = null;
        this._selectedMeterSubject.next(new Meter());
        this._availableMetersSubject.next([]);
        this._selectedMeterSubject.reset();
        this._availableMetersSubject.reset();
      }
    });
  }

  private _availableMeters: Meter[] = null;

  /**
   * Get an observable object that updates when the list of available meters is updated
   */
  get availableMeters(): Observable<Meter[]> {
    return this._availableMetersSubject.asObservable();
  }

  /**
   * Get an observable object that updates when the meter selection is changed
   */
  get selectedMeter(): Observable<Meter> {
    return this._selectedMeterSubject.asObservable();
  }

  /**
   * Select a new meter (called in the sidenav dropdown)
   * @param meterPk: new meters pk
   */
  setMeter(meterPk: pkType): void {
    if (!this._availableMeters) {
      // No available meters, cant change meter if there are no meters
      return;
    }
    // find the newly selected meter in the available meters
    const meter = this._availableMeters.find(m => m.pk === meterPk);
    if (meter) {
      // Update the default_meter for this user
      this.authService.user.then(user => {
        this.userService.updateUser(user.pk, new AuthUser().deserialize({default_meter: meter.pk})).subscribe(updatedUser => {
          // Patch the auth user with new default meter
          this.authService.patchUser(updatedUser);
        });
      });
      // A new meter is selected, let the subscribers know!
      this._selectedMeterSubject.next(meter);
    } else {
      // Meter not found!
      console.log('MeterSelectionService: Meter with pk [', meterPk, '] not fount');
    }
  }

  /**
   * Retrieves a list of meters for given user
   * @param user: update meters for this user
   */
  public updateMeters(user: AuthUser): void {
    this.meterService.getMeterList(user.pk).subscribe(
      meters => {
        // Set available meters and select the default meter (by default) or the first one in the list
        this._availableMeters = meters;
        this._availableMetersSubject.next(this._availableMeters);
        const selectedMeter = this._availableMeters.find(meter => meter.pk === user.getDefaultMeter()?.pk);
        this._selectedMeterSubject.next(selectedMeter || this._availableMeters[0]);
      }
    );
  }
}
