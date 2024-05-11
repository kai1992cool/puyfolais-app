import { Component, OnInit, inject } from '@angular/core';
import { SaisonService } from '../../service/saison.service';
import { ISaison } from '../../interface/saison';
import { MatDialog } from '@angular/material/dialog';
import { SaisonDialogComponent } from '../dialog/saison-dialog/saison-dialog.component';

@Component({
  selector: 'app-admin-saisons',
  templateUrl: './admin-saisons.component.html',
  styleUrl: './admin-saisons.component.scss'
})
export class AdminSaisonsComponent implements OnInit {

  constructor(private dialog: MatDialog) { }
  
  listSaisons: ISaison[] = [];
  saisonService = inject(SaisonService);
  saisonEditEnabled: boolean = false;
  saisonSelectionnee: ISaison | null = null;

  ngOnInit() {
   this.mettreAJourListeSaison();
  }

  openModal(): void {
    this.saisonSelectionnee = null;
    const dialogRef = this.dialog.open(SaisonDialogComponent, {
      width: '400px', // Ajustez la largeur de la modale selon vos besoins
    });

    dialogRef.afterClosed().subscribe(() => {
      this.mettreAJourListeSaison();
    });

  }

  mettreAJourListeSaison() {
    this.listSaisons = [];
    this.saisonService.recupererSaisons().subscribe(saisons => {
      this.listSaisons.push(...saisons); // Utilisation de l'opérateur spread pour ajouter chaque élément du tableau saisons à listSaisons
    });
    }
  
    validerModificationSaison(saison: ISaison) {
      // TODo : implémenter ici l'update en BDD
      this.saisonSelectionnee = null;

    }
  
    afficherBlocEditionSaison(saison: ISaison) {
      this.saisonSelectionnee = saison;
    }

    annulerEditionSaison() {
      this.saisonSelectionnee = null;
    }

}
