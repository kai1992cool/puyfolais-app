import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { environment } from "../environments/environment.development";
import { AccueilComponent } from './accueil/accueil.component';
import { GoogleSsoDirective } from './google-sso.directive';

@NgModule({
  declarations: [
    AppComponent,
    AccueilComponent,
    GoogleSsoDirective  ],
  imports: [
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),    
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
