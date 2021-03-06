import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ConfigurationViewComponent } from './configuration-view.component';
import { MatTabsModule } from '@angular/material/tabs';
import { AccountConfigurationContentComponent } from './account/account-configuration-content.component';
import { GroupConfigurationContentComponent } from './group/group-configuration-content.component';
import { MeterConfigurationContentComponent } from './meter/meter-configuration-content.component';
import { GPXSharedModule } from '@gpx/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { LoadingIndicatorModule } from '@gpx/components/utilities/loading-indicator/loading-indicator.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CreateGroupMeterDialogModule } from './group/create-group-meter-dialog/create-group-meter-dialog.module';
import { OanaxSnackBarModule } from '@gpx/components/utilities/snack-bar/oanax-snack-bar.module';
import { JoinGroupMeterDialogModule } from './group/join-group-meter-dialog/join-group-meter-dialog.module';
import { MatSelectModule } from '@angular/material/select';
import { ChangePasswordModule } from './account/change-password/change-password.module';


const routes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'account'
  },
  {
    path: '',
    component: ConfigurationViewComponent,
    children: [
      {
        path: 'account',
        component: AccountConfigurationContentComponent,
      },
      {
        path: 'meter',
        component: MeterConfigurationContentComponent,
      },
      {
        path: 'group',
        component: GroupConfigurationContentComponent,
      },
    ]
  },
];

@NgModule({
  declarations: [
    ConfigurationViewComponent,
    AccountConfigurationContentComponent,
    MeterConfigurationContentComponent,
    GroupConfigurationContentComponent,
  ],
  imports: [
    GPXSharedModule,
    MatTabsModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    LoadingIndicatorModule,
    MatCheckboxModule,
    MatMenuModule,
    MatDividerModule,
    ClipboardModule,
    CreateGroupMeterDialogModule,
    JoinGroupMeterDialogModule,
    OanaxSnackBarModule,
    MatSelectModule,
    ChangePasswordModule
  ]
})
export class ConfigurationViewModule {
}
