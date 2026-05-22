import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { SupabaseService } from './services/supabase.service';
import { ThemeService } from './services/theme.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
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
