import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatSnackBarConfig } from '@angular/material/snack-bar/snack-bar-config';
import { GpxSnackBarComponent, ISnackData } from '../components/utilities/snack-bar/gpx-snack-bar.component';

/**
 * Snackbar service to display snacks in the browser to update/notify the user
 * - Info: blue info bar with content and info icon
 * - Success: green info bar with content and smiley icon
 * - Warning: red info bar with content and warning icon
 * Default configuration: snackbar in the bottom center of the screen, stays for 4 seconds before disappearing
 */
@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  private _defaultOptions: MatSnackBarConfig = {
    duration: 4000,
    verticalPosition: 'bottom',
  };

  constructor(private _snackBar: MatSnackBar) {
  }

  /**
   * Show an info snack, with given data and configuration
   * @param data
   * @param snackConfig
   */
  public info(data: ISnackData, snackConfig: MatSnackBarConfig = {}): MatSnackBarRef<GpxSnackBarComponent> {
    return this._open({
      ...this._defaultOptions,
      ...snackConfig,
      data: {
        icon: 'info',
        ...data
      }
    });
  }


  /**
   * Show a success snack, with given data and configuration
   * @param data
   * @param snackConfig
   */
  public success(data: ISnackData, snackConfig: MatSnackBarConfig = {}): MatSnackBarRef<GpxSnackBarComponent> {
    return this._open({
      ...this._defaultOptions,
      ...snackConfig,
      panelClass: 'b-green',
      data: {
        icon: 'mood',
        ...data
      }
    });
  }


  /**
   * Show a warning snack, with given data and configuration
   * @param data
   * @param snackConfig
   */
  public warn(data: ISnackData, snackConfig: MatSnackBarConfig = {}): MatSnackBarRef<GpxSnackBarComponent> {
    return this._open({
      ...this._defaultOptions,
      ...snackConfig,
      panelClass: 'b-action',
      data: {
        icon: 'warning',
        ...data
      }
    });
  }

  /**
   * Open the snackbar with configuration
   * @param config
   * @private
   */
  private _open(config: MatSnackBarConfig): MatSnackBarRef<GpxSnackBarComponent> {
    return this._snackBar.openFromComponent(GpxSnackBarComponent, config);
  }
}
