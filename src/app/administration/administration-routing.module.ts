import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminUtilisateursComponent } from './admin-utilisateurs/admin-utilisateurs.component';
import { AdminAccueilComponent } from './admin-accueil/admin-accueil.component';
import { AdminStructuresComponent } from './admin-structures/admin-structures.component';
import { AdminSaisonsComponent } from './admin-saisons/admin-saisons.component';
import { AdminPuyfolaisComponent } from './admin-puyfolais/admin-puyfolais.component';
import { EditPuyfolaisComponent } from './puyfolais/edit-puyfolais/edit-puyfolais.component';

const routes: Routes = [
  
    {
      path: '',
      component: AdminAccueilComponent
    },
    {
      path: 'utilisateurs',
      component: AdminUtilisateursComponent
    },
    {
      path: 'structures',
      component: AdminStructuresComponent
    },
    {
      path: 'saisons',
      component: AdminSaisonsComponent
    },
    {
      path: 'puyfolais',
      component: AdminPuyfolaisComponent,
    },
    
    {
      path: 'puyfolais/edit',
      component: EditPuyfolaisComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
