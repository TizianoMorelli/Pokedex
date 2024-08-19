import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // Configura il router con le rotte
    provideHttpClient()    // Configura le animazioni se necessarie
  
  ],
  
};
