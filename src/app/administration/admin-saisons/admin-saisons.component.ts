import { Component, OnInit, inject } from '@angular/core';
import { SaisonService } from '../../service/saison.service';
import { ISaison } from '../../interface/saison';
import { MatDialog } from '@angular/material/dialog';
import { SaisonDialogComponent } from '../../dialog/saison-dialog/saison-dialog.component';

@Component({
  selector: 'app-admin-saisons',
  templateUrl: './admin-saisons.component.html',
  styleUrl: './admin-saisons.component.scss'
})
export class AdminSaisonsComponent implements OnInit {

  constructor(private dialog: MatDialog) { }
  
  listSaisons: ISaison[] = [];
  saisonService = inject(SaisonService);
  
  ngOnInit() {
    this.saisonService.recupererSaisons().subscribe(saisons => {
      this.listSaisons.push(...saisons); // Utilisation de l'opérateur spread pour ajouter chaque élément du tableau saisons à listSaisons
    });
  }

  openModal(): void {
    this.dialog.open(SaisonDialogComponent, {
      width: '400px', // Ajustez la largeur de la modale selon vos besoins
    });
  }

  
}
