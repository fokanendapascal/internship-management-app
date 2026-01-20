import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './services/interceptor/auth-interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),

        provideHttpClient(
            withInterceptors([authInterceptor])
        ),
    ]
};
