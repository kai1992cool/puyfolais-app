import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from "./accueil/accueil.component";
import { SigninComponent } from "./signin/signin.component";
import { SignupComponent } from "./signup/signup.component";
import { authGuard } from './guard/auth.guard';
import { adminGuard } from './guard/admin.guard';
import { AdminComponent } from './administration/admin/admin.component';

const routes: Routes = [
  { path: "", component: AccueilComponent },
  { path: "signin", component: SigninComponent },
  { path: "signup", component: SignupComponent },
  {
    path: "admin", component: AdminComponent, canActivate: [authGuard, adminGuard], loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
