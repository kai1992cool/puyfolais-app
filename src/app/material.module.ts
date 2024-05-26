import { NgModule } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatMenuModule } from '@angular/material/menu'
import { MatChipsModule } from '@angular/material/chips'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatBadgeModule } from '@angular/material/badge'
import { MatSlideToggle } from '@angular/material/slide-toggle'
import { MatListModule } from '@angular/material/list'

@NgModule({
  declarations: [],
  imports: [
    MatToolbarModule,
    MatMenuModule,
    MatFormFieldModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatBadgeModule,
    MatSelectModule,
    MatSlideToggle,
    MatListModule,
    MatDialogModule,
    MatDividerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatInputModule,
  ],
  exports: [
    MatToolbarModule,
    MatMenuModule,
    MatFormFieldModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatBadgeModule,
    MatSelectModule,
    MatSlideToggle,
    MatListModule,
    MatDialogModule,
    MatDividerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatInputModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },

  ]
})
export class MaterialModule { }

