import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-indicator',
  templateUrl: './loading-indicator.component.html',
  styles: ['.spinner-container {margin-top:80px; margin-bottom:25px;}']

})
export class LoadingIndicatorComponent {

  // default text
  @Input() loadingIndicatorText = 'Data aan het laden';

  // to be used with lists
  @Input() listLength: number;
  // to be used with single objects
  @Input() objectFound: boolean;
  @Input() noLengthText = 'Geen data gevonden';

  @Input() loading: boolean;
}
