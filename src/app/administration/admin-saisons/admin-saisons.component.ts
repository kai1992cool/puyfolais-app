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
  
  listeToutesSaisons: ISaison[] = [];
  saisonService = inject(SaisonService);
  editionSaisonActivee: boolean = false;
  saisonSelectionnee: ISaison | null = null;

  ngOnInit() {
   this.mettreAJourListeSaison();
  }

  ouvrirModalAjoutSaison(): void {
    this.saisonSelectionnee = null;
    const dialogAjoutSaison = this.dialog.open(SaisonDialogComponent, {
      width: '400px', 
    });

    dialogAjoutSaison.afterClosed().subscribe(() => {
      this.mettreAJourListeSaison();
    });

  }

  mettreAJourListeSaison() {
    this.listeToutesSaisons = [];
    this.saisonService.recupererSaisons().subscribe(saisons => {
      this.listeToutesSaisons.push(...saisons); // Utilisation de l'opérateur spread pour ajouter chaque élément du tableau saisons à listSaisons
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
