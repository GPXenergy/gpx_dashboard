import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DashboardStats } from '@gpx/models/stats.model';
import { DashboardStatsService } from '@gpx/services/api/stats.service';

@Component({
  selector: 'gpx-user-info-view',
  templateUrl: './info-view.component.html',
  styleUrls: ['./info-view.component.scss'],
})
export class InfoViewComponent implements OnInit {
  stats: DashboardStats;

  constructor(private titleService: Title, private statsService: DashboardStatsService) {
    this.titleService.setTitle('Informatie | GPX');
  }

  ngOnInit(): void {
    this.statsService.getStats().subscribe(stats => {
      this.stats = stats;
    });
  }

}
