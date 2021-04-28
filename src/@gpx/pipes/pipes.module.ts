import { NgModule } from '@angular/core';
import { ExplicitDecimalPipe } from './explicit-number.pipe';
import { ShortenPipe } from './shorten.pipe';

@NgModule({
  declarations: [
    ExplicitDecimalPipe,
    ShortenPipe,
  ],
  imports: [],
  exports: [
    ExplicitDecimalPipe,
    ShortenPipe,
  ]
})
export class OanaxPipesModule {
}
