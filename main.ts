import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/interceptors/auth.interceptor';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));

bootstrapApplication(App, { 
    providers: [ 
        provideRouter(routes),
        provideHttpClient(withInterceptors([authInterceptor])),
        ],
    }).catch((err) => console.error(err));
