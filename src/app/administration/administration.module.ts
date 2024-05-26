import { NgModule } from '@angular/core';

import { AdministrationRoutingModule } from './administration-routing.module';
import { AdminUtilisateursComponent } from './admin-utilisateurs/admin-utilisateurs.component';
import { AdminAccueilComponent } from './admin-accueil/admin-accueil.component';
import { AdminComponent } from './admin/admin.component';
import { AdminStructuresComponent } from './admin-structures/admin-structures.component';
import { AdminSaisonsComponent } from './admin-saisons/admin-saisons.component';
import { SaisonCardComponent } from './component/saison-card/saison-card.component';
import { SeanceCardComponent } from './component/seance-card/seance-card.component';
import { StructureDialogComponent } from './dialog/structure-dialog/structure-dialog.component';
import { StructureCardComponent } from './component/structure-card/structure-card.component';
import { GroupeDialogComponent } from './dialog/groupe-dialog/groupe-dialog.component';
import { AdminPuyfolaisComponent } from './admin-puyfolais/admin-puyfolais.component';
import { PuyfolaisCardComponent } from './component/puyfolais-card/puyfolais-card.component';  
import { FilterPipe } from './pipe/filter.pipe';
import { LocalizeDatePipe } from './pipe/localize-date.pipe';
import { SharedModule } from '../share.module';
import { EditPuyfolaisComponent } from './puyfolais/edit-puyfolais/edit-puyfolais.component';

@NgModule({
  declarations: [
    AdminUtilisateursComponent, 
    AdminAccueilComponent, 
    AdminComponent, 
    AdminStructuresComponent, 
    AdminSaisonsComponent, 
    SaisonCardComponent, 
    SeanceCardComponent,  
    StructureDialogComponent, 
    StructureCardComponent, 
    GroupeDialogComponent, 
    AdminPuyfolaisComponent, 
    EditPuyfolaisComponent, 
    PuyfolaisCardComponent,
    FilterPipe,
    LocalizeDatePipe],  
  imports: [
    SharedModule,
    AdministrationRoutingModule,
  ]
})
export class AdministrationModule { }
