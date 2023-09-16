import { Component, Input, OnDestroy, OnInit } from '@angular/core';


@Component({
  selector: 'gpx-question-panel',
  templateUrl: './question-panel.component.html',
  styleUrls: ['./question-panel.component.scss'],
})
export class QuestionPanelComponent {
  @Input() question: string;
}
