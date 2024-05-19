import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';
import { AdminUtilisateursComponent } from './admin-utilisateurs/admin-utilisateurs.component';
import { AdminAccueilComponent } from './admin-accueil/admin-accueil.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from '../app.module';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AdminComponent } from './admin/admin.component';
import { AdminStructuresComponent } from './admin-structures/admin-structures.component';
import { AdminSaisonsComponent } from './admin-saisons/admin-saisons.component';
import { SaisonCardComponent } from './component/saison-card/saison-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatBadgeModule } from '@angular/material/badge';

import { SeanceCardComponent } from './component/seance-card/seance-card.component';
import { LocalizeDatePipe } from './pipe/localize-date.pipe';


@NgModule({
  declarations: [AdminUtilisateursComponent, AdminAccueilComponent, AdminComponent, AdminStructuresComponent, AdminSaisonsComponent, SaisonCardComponent, SeanceCardComponent, LocalizeDatePipe],  
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDatepickerModule,
    MatTooltipModule,
    MatBadgeModule,
    MatSlideToggle,
    FormsModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient],
      },
      defaultLanguage: 'fr-FR',
    }),
  ]
})
export class AdministrationModule { }
