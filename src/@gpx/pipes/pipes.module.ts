import { NgModule } from '@angular/core';
import { TimeAgoPipe } from './time-ago.pipe';
import { ExplicitDecimalPipe } from './explicit-number.pipe';
import { ShortenPipe } from './shorten.pipe';

@NgModule({
  declarations: [
    TimeAgoPipe,
    ExplicitDecimalPipe,
    ShortenPipe,
  ],
  imports: [],
  exports: [
    TimeAgoPipe,
    ExplicitDecimalPipe,
    ShortenPipe,
  ]
})
export class OanaxPipesModule {
}
