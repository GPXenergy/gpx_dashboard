import { ReplaySubject } from 'rxjs';

/**
 * A replay subject that allows resetting the event list
 */
export class ResettableReplaySubject<T> extends ReplaySubject<T> {
  public reset(): void {
    // hacky-shit
    // tslint:disable-next-line:no-string-literal
    this['_events'] = [];
  }
}
