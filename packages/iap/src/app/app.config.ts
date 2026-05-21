import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SupabaseService } from './services/supabase.service';
import { ThemeService } from './services/theme.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    {
      provide: APP_INITIALIZER,
      useFactory: (supabase: SupabaseService, theme: ThemeService) => () => {
        theme.init();
        return supabase.init();
      },
      deps: [SupabaseService, ThemeService],
      multi: true,
    },
  ],
};
