import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { AccueilComponent } from './accueil/accueil.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ConfirmationDialogComponent } from './dialog/confirmation-dialog/confirmation-dialog.component';
import { SaisonDialogComponent } from './administration/dialog/saison-dialog/saison-dialog.component';
import { AdministrationModule } from './administration/administration.module';
import { SharedModule } from './share.module';
import { ValidationDialogComponent } from './dialog/validation-dialog/validation-dialog.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    AccueilComponent,
    SigninComponent,
    SignupComponent,
    ConfirmationDialogComponent,
    SaisonDialogComponent,
    ValidationDialogComponent],
  bootstrap: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    AdministrationModule,
    SharedModule  
  ],
  providers: [ ]
})
export class AppModule { }
