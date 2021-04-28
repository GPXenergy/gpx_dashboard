import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PageLayoutComponent } from './page-layout.component';
import { FooterModule } from '../components/footer/footer.module';
import { ToolbarModule } from '../components/toolbar/toolbar.module';
import { ContentModule } from '../components/content/content.module';
import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [
    PageLayoutComponent
  ],
  imports: [
    CommonModule,
    FooterModule,
    ToolbarModule,
    ContentModule,
    MatSidenavModule,
    MatMenuModule,
    MatDividerModule,
    FlexLayoutModule,
    RouterModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [
    PageLayoutComponent
  ]
})
export class PageLayoutModule {
}
