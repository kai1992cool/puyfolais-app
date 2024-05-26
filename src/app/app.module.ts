import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AngularFireAnalyticsModule, ScreenTrackingService, UserTrackingService } from '@angular/fire/compat/analytics';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";

import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { environment } from "../environments/environment.development";
import { AccueilComponent } from './accueil/accueil.component';
import { GoogleSsoDirective } from './directive/google-sso.directive';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ConfirmationDialogComponent } from './dialog/confirmation-dialog/confirmation-dialog.component';
import { SaisonDialogComponent } from './administration/dialog/saison-dialog/saison-dialog.component';
import { AdministrationModule } from './administration/administration.module';

import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeEs from '@angular/common/locales/es';
import localeEn from '@angular/common/locales/en';
import { ValidationDialogComponent } from './dialog/validation-dialog/validation-dialog.component';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    AccueilComponent,
    GoogleSsoDirective,
    SigninComponent,
    SignupComponent,
    ConfirmationDialogComponent,
    SaisonDialogComponent,
    ValidationDialogComponent
  ],
  bootstrap: [AppComponent], imports: [AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAnalyticsModule,
    BrowserModule,
    AdministrationModule,
    AppRoutingModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatCardModule,
    MatInputModule,
    MatDialogModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient],
      },
      defaultLanguage: 'fr-FR',
    })], providers: [
      provideAnimationsAsync(),
      { provide: LOCALE_ID, useValue: 'fr-FR' },
      { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
      ScreenTrackingService,
      UserTrackingService,
      provideHttpClient(withInterceptorsFromDi())
    ]
})
export class AppModule {

  constructor() {
    registerLocaleData(localeFr); // Charger les données de la langue française
    registerLocaleData(localeEs); // Charger les données de la langue espagnol
    registerLocaleData(localeEn); // Charger les données de la langue anglais

    // Initialiser Firebase App et Google Analytics
    const app = initializeApp(environment.firebaseConfig);
    const analytics = getAnalytics(app);
  }

}
