import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from '../accueil/accueil.component';
import { adminGuard } from '../guard/admin.guard';
import { authGuard } from '../guard/auth.guard';
import { AdminUtilisateursComponent } from './admin-utilisateurs/admin-utilisateurs.component';
import { AdminAccueilComponent } from './admin-accueil/admin-accueil.component';

const routes: Routes = [
  
    {
      path: '',
      component: AdminAccueilComponent
    },
    {
      path: 'utilisateurs',
      component: AdminUtilisateursComponent
    }
    
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
