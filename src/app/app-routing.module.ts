import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from "./accueil/accueil.component";
import { SigninComponent } from "./signin/signin.component";
import { SignupComponent } from "./signup/signup.component";
import { authGuard } from './guard/auth.guard';

const routes: Routes = [
  { path: "", component: AccueilComponent },
 { path: "signin", component: SigninComponent },
 { path: "signup", component: SignupComponent },

  // { path: "une-route-securisee", component: UnComposantSecuriseComponent , canActivate: [authGuard],},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
