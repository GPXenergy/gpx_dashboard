import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'user-info-view',
  templateUrl: './info-view.component.html',
  styleUrls: ['./info-view.component.scss'],
})
export class InfoViewComponent {
  constructor(private titleService: Title) {
    this.titleService.setTitle('Informatiebank | GPX');
  }
}
