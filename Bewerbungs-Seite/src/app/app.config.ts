import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { CommonModule } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(CommonModule),
    provideRouter([])
  ]
};
