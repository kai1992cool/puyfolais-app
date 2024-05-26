import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { TitrePageComponent } from './commun/titre-page/titre-page.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { environment } from '../environments/environment.development';
import localeFr from '@angular/common/locales/fr';
import localeEs from '@angular/common/locales/es';
import localeEn from '@angular/common/locales/en';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAnalyticsModule, ScreenTrackingService, UserTrackingService } from '@angular/fire/compat/analytics';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { GoogleSsoDirective } from './directive/google-sso.directive';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialModule } from './material.module';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    TitrePageComponent,
    GoogleSsoDirective,
  ],
  imports: [
    MaterialModule,
    AngularFireAnalyticsModule,
    CommonModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient],
      },
      defaultLanguage: 'fr-FR',
    }),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient],
      },
      defaultLanguage: 'fr-FR',
    }),
  ],
  exports: [
    TitrePageComponent,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    AngularFireAuthModule,
    AngularFireModule,
    CommonModule,
    MaterialModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    provideAnimationsAsync(),
    ScreenTrackingService,
    UserTrackingService,
    provideHttpClient(withInterceptorsFromDi())
  ]
})
export class SharedModule {

  constructor() {
    registerLocaleData(localeFr); // Charger les données de la langue française
    registerLocaleData(localeEs); // Charger les données de la langue espagnol
    registerLocaleData(localeEn); // Charger les données de la langue anglais

    // Initialiser Firebase App et Google Analytics
    const app = initializeApp(environment.firebaseConfig);
    const analytics = getAnalytics(app);
  }

}