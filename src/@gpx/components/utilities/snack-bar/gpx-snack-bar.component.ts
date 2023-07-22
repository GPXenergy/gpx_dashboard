import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

export interface ISnackData {
  title: string;
  action?: string;
  navigate_action?: any[];
  icon?: string;
}

@Component({
  selector: 'gpx-snack-bar',
  templateUrl: './gpx-snack-bar.component.html',
})
export class GpxSnackBarComponent {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: ISnackData,
              private matSnackBarRef: MatSnackBarRef<GpxSnackBarComponent>,
              private router: Router) {
  }

  onAction(): void {
    this.matSnackBarRef.dismissWithAction();
    if (this.data.navigate_action) {
      this.router.navigate(this.data.navigate_action);
    }
  }
}
