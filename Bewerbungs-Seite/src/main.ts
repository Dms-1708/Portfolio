import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(FormsModule),
    provideHttpClient()
  ]
}).catch(err => console.error(err));
