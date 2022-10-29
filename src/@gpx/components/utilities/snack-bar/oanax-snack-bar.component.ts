import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

export interface OanaxSnackData {
  title: string;
  action?: string;
  navigate_action?: any[];
  icon?: string;
}

@Component({
  selector: 'gpx-oanax-snack-bar',
  templateUrl: './oanax-snack-bar.component.html',
})
export class OanaxSnackBarComponent {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: OanaxSnackData,
              private matSnackBarRef: MatSnackBarRef<OanaxSnackBarComponent>,
              private router: Router) {
  }

  onAction() {
    this.matSnackBarRef.dismissWithAction();
    if (this.data.navigate_action) {
      this.router.navigate(this.data.navigate_action);
    }
  }
}
